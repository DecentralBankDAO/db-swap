

import * as nearApiJs from 'near-api-js';
import { createTransaction, functionCall} from 'near-api-js/lib/transaction';
import { useState } from 'react';
import { formatNearAmount, formatTokenAmount, parseTokenAmount } from '../components/swap/formatToken';
import { baseDecode } from 'borsh';
import SpecialWallet from '../services/SpecialWallet';

const { REACT_APP_NEAR_ENV } = process.env;
const IS_MAINNET = REACT_APP_NEAR_ENV === 'mainnet' ? true : false;
const usnContractName = !IS_MAINNET ? 'usdn.testnet' : 'usn';
const usdtContractName = !IS_MAINNET ? 'usdt.fakes.testnet' : 'dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near';

const ONE_YOCTO_NEAR = '1';
const GAS_TO_CALL_WITHDRAW = '';
const GAS_FOR_CALL = '200000000000000'; // 200 TGas



async function createBatchTransaction({
    accountId,
    wallet,
    receiverId,
    actions,
    nonceOffset = 1,
  }) {

    const localKey = await wallet._near.connection.signer.getPublicKey(accountId, REACT_APP_NEAR_ENV)
    let accessKey = await  wallet.account().accessKeyForTransaction(
        receiverId,
        actions,
        localKey
      );
      if (!accessKey) {
        throw new Error(
          `Cannot find matching key for transaction sent to ${receiverId}`
        );
      }

    const block = await  wallet._near.connection.provider.block({ finality: 'final' })
    const blockHash = baseDecode(block.header.hash);

    const publicKey = nearApiJs.utils.PublicKey.from(accessKey.public_key);
    const nonce = accessKey.access_key.nonce + nonceOffset;

    return createTransaction(
      accountId,
      publicKey,
      receiverId,
      nonce,
      actions,
      blockHash
    );
  }

export const executeMultipleTransactions = async (
    accountId,
    wallet,
    transactions,
    callbackUrl
  ) => {

    const near = new nearApiJs.Near({
      keyStore: new nearApiJs.keyStores.BrowserLocalStorageKeyStore(),
      headers: {},
      ...wallet._near.config,
    });

    const specialWallet = new SpecialWallet(near, accountId);

    const currentTransactions = await Promise.all(
          transactions.map((t, i) => {
            return createBatchTransaction({
              accountId,
              wallet,  
              receiverId: t.receiverId,
              nonceOffset: i + 1,
              actions: t.functionCalls.map(({methodName, args, gas, amount}) =>
                functionCall(
                  methodName,
                  args,
                  gas,
                  amount
                )
              ),
            });
          })
        );

    return specialWallet.requestSignTransactions(currentTransactions, callbackUrl);
  };

const setArgsUSNContractWithdraw = (amount, fullAmount) => {
    return {
        args: {
            amount: amount === formatTokenAmount(fullAmount, 18, 5).toString() ? fullAmount : parseTokenAmount(amount, 18),
        },
        amount: ONE_YOCTO_NEAR,
        gas: GAS_FOR_CALL,
    };
};

const setArgsUSDTContractTransfer = (amount, fullAmount) => {
    return {
        args: {
            receiver_id:usnContractName,
            amount: amount === formatTokenAmount(fullAmount, 6, 5).toString() ? fullAmount : parseTokenAmount(amount, 6),
            msg: '',
        },
        amount: ONE_YOCTO_NEAR,
        gas: GAS_FOR_CALL,
    };
};

export const useFetchByorSellUSN = (account) => {
    const [isLoading, setIsLoading] = useState(false);
    const usnMethods = {
        viewMethods: ['version', 'name', 'symbol', 'decimals', 'ft_balance_of'],
        changeMethods: ['withdraw'],
    };

    const usdtMethods = {
        viewMethods: ['storage_balance_of', 'storage_balance_bounds'],
        changeMethods: ['ft_transfer_call', 'storage_deposit'],
    };

    const fetchByOrSell = async (
        accountId,
        amount,
        symbol,
        fullAmount,
        wallet
    ) => {
        const usdtContract = new nearApiJs.Contract(
            account,
            usdtContractName,
            usdtMethods
        );
        const transactions = [];
        const tokenInActions = [];
        const tokenOutActions = [];

        if (symbol === 'USDT.e') {
           return await usdtContract.ft_transfer_call(setArgsUSDTContractTransfer(amount, fullAmount));
        } else {
            const usnContract = new nearApiJs.Contract(
                account,
                usnContractName,
                usnMethods
            );
            const storage = await usdtContract.storage_balance_of({"account_id": accountId});
            if(!storage) {
                const bounds = await usdtContract.storage_balance_bounds();
                tokenOutActions.push({
                    methodName: 'storage_deposit',
                    args: {
                      account_id: accountId,
                    },
                    gas: '30000000000000',
                    amount: bounds.min,
                  });
            
                  transactions.push({
                    receiverId: usdtContractName,
                    functionCalls: tokenOutActions,
                  });

                  tokenInActions.push({
                    methodName: 'withdraw',
                    args: {
                        amount: amount === formatTokenAmount(fullAmount, 18, 5).toString() ? fullAmount : parseTokenAmount(amount, 18)
                    },
                    amount: ONE_YOCTO_NEAR,
                    gas: GAS_FOR_CALL,
                  });
            
                  transactions.push({
                    receiverId: usnContractName,
                    functionCalls: tokenInActions,
                  });
                  

                  return executeMultipleTransactions(accountId, wallet, transactions)

            } else {
                return await usnContract.withdraw(setArgsUSNContractWithdraw(amount, fullAmount));
            }
        }
    };

    return { fetchByOrSell, isLoading, setIsLoading};
}