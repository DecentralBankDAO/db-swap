import * as nearApiJs from "near-api-js";
import { createTransaction, functionCall } from "near-api-js/lib/transaction";
import { useState } from "react";
import {
    formatNearAmount,
    formatTokenAmount,
    parseTokenAmount,
} from "../components/swap/formatToken";
import { baseDecode } from "borsh";
import SpecialWallet from "../services/SpecialWallet";

const { REACT_APP_NEAR_ENV } = process.env;
const IS_MAINNET = REACT_APP_NEAR_ENV === "mainnet" ? true : false;
const usnContractName = !IS_MAINNET ? "usdn.testnet" : "usn";
const wNEAR = !IS_MAINNET ? "wrap.testnet" : "wrap.near";
const usdcContractName = !IS_MAINNET
    ? "usdc.fakes.testnet"
    : "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near";
const REFcontract = !IS_MAINNET
    ? "ref-finance-101.testnet"
    : "v2.ref-finance.near";

const ONE_YOCTO_NEAR = "1";
const GAS_TO_CALL_WITHDRAW = "";
const GAS_FOR_CALL = "200000000000000"; // 200 TGas

async function createBatchTransaction({
    accountId,
    wallet,
    receiverId,
    actions,
    nonceOffset = 1,
}) {
    const localKey = await wallet._near.connection.signer.getPublicKey(
        accountId,
        REACT_APP_NEAR_ENV
    );
    let accessKey = await wallet
        .account()
        .accessKeyForTransaction(receiverId, actions, localKey);
    if (!accessKey) {
        throw new Error(
            `Cannot find matching key for transaction sent to ${receiverId}`
        );
    }

    const block = await wallet._near.connection.provider.block({
        finality: "final",
    });
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
                actions: t.functionCalls.map(
                    ({
                        methodName,
                        args,
                        gas = "150000000000000",
                        amount = "1",
                    }) => functionCall(methodName, args, gas, amount)
                ),
            });
        })
    );

    console.log("currentTransactions", currentTransactions);
    return specialWallet.requestSignTransactions(
        currentTransactions,
        callbackUrl
    );
};

const setArgsUSNContractWithdraw = (amount, fullAmount) => {
    return {
        args: {
            asset_id: usdcContractName,
            amount:
                amount === formatTokenAmount(fullAmount, 18, 5).toString()
                    ? fullAmount
                    : parseTokenAmount(amount, 18),
        },
        amount: ONE_YOCTO_NEAR,
        gas: GAS_FOR_CALL,
    };
};

const setArgsUSDTContractTransfer = (amount, fullAmount) => {
    return {
        args: {
            receiver_id: usnContractName,
            amount:
                amount === formatTokenAmount(fullAmount, 6, 5).toString()
                    ? fullAmount
                    : parseTokenAmount(amount, 6),
            msg: "",
        },
        amount: ONE_YOCTO_NEAR,
        gas: GAS_FOR_CALL,
    };
};

export const ftViewFunc = async (tokenId, methodName, args, wallet) => {
    return wallet
        .account()
        .viewFunction(tokenId, methodName, args)
        .catch(() => "0");
};

export const useFetchByorSellUSN = () => {
    const [isLoading, setIsLoading] = useState(false);
    // const usnMethods = {
    //     viewMethods: ['version', 'name', 'symbol', 'decimals', 'ft_balance_of'],
    //     changeMethods: ['withdraw'],
    // };

    // const usdtMethods = {
    //     viewMethods: ['storage_balance_of', 'storage_balance_bounds'],
    //     changeMethods: ['ft_transfer_call', 'storage_deposit'],
    // };

    const fetchByOrSell = async (
        tokenIn,
        tokenOut,
        accountId,
        amount,
        symbol,
        fullAmount,
        wallet
    ) => {
        // const usdtContract = new nearApiJs.Contract(
        //     account,
        //     usdtContractName,
        //     usdtMethods
        // );
        const transactions = [];
        const tokenInActions = [];
        const tokenOutActions = [];

        const registerToken = async (token) => {
            const storageToken = token.contractName
                ? token.contractName
                : wNEAR;
            const tokenRegistered = await ftViewFunc(
                storageToken,
                "storage_balance_of",
                { account_id: accountId },
                wallet
            ).catch(() => {
                throw new Error(`${storageToken} doesn't exist.`);
            });

            const bounds = await ftViewFunc(
                storageToken,
                "storage_balance_bounds",
                {},
                wallet
            );

            if (tokenRegistered === null) {
                tokenOutActions.push({
                    methodName: "storage_deposit",
                    args: {
                        registration_only: true,
                        account_id: accountId,
                    },
                    gas: "30000000000000",
                    amount: bounds.min,
                });

                transactions.push({
                    receiverId: storageToken,
                    functionCalls: tokenOutActions,
                });
            }
        };

        await registerToken(tokenOut);

        if (
            tokenIn?.onChainFTMetadata?.symbol === "NEAR" ||
            tokenOut?.onChainFTMetadata?.symbol === "NEAR"
        ) {
            const contractIn = tokenIn.contractName
                ? tokenIn.contractName
                : wNEAR;
            const contractOut = tokenOut.contractName
                ? tokenOut.contractName
                : wNEAR;
            const decimalsIn = tokenIn.onChainFTMetadata?.decimals;

            const swapAmount = await ftViewFunc(
                REFcontract,
                "get_return",
                {
                    pool_id: 424,
                    token_in: contractIn,
                    token_out: contractOut,
                    amount_in:
                        amount ===
                        formatTokenAmount(fullAmount, decimalsIn, 5).toString()
                            ? fullAmount
                            : parseTokenAmount(amount, decimalsIn),
                },
                wallet
            );

            const ft_transfer_action = {
                receiverId: contractIn,
                functionCalls: [
                    {
                        methodName: "ft_transfer_call",
                        args: {
                            receiver_id: REFcontract,
                            amount:
                                amount ===
                                formatTokenAmount(
                                    fullAmount,
                                    decimalsIn,
                                    5
                                ).toString()
                                    ? fullAmount
                                    : parseTokenAmount(amount, decimalsIn),
                            msg: JSON.stringify({
                                force: 0,
                                actions: [
                                    {
                                        pool_id: 424,
                                        token_in: contractIn,
                                        token_out: contractOut,
                                        min_amount_out: "0",
                                    },
                                ],
                            }),
                        },
                        amount: ONE_YOCTO_NEAR,
                        gas: "180000000000000",
                    },
                ],
            };

            if (tokenOut?.onChainFTMetadata?.symbol === "NEAR") {
                transactions.push(ft_transfer_action, {
                    receiverId: wNEAR,
                    functionCalls: [
                        {
                            methodName: "near_withdraw",
                            args: {
                                amount: swapAmount,
                            },
                            amount: ONE_YOCTO_NEAR,
                            gas: "150000000000000",
                        },
                    ],
                });
            }

            if (tokenIn?.onChainFTMetadata?.symbol === "NEAR") {
                transactions.push(
                    {
                        receiverId: wNEAR,
                        functionCalls: [
                            {
                                methodName: "near_deposit",
                                args: {},
                                amount: parseTokenAmount(amount, 24),
                                gas: "150000000000000",
                            },
                        ],
                    },
                    ft_transfer_action
                );
            }

            return executeMultipleTransactions(accountId, wallet, transactions);
        }

        const fromUSN = tokenIn?.onChainFTMetadata?.symbol === "USN";

        tokenInActions.push({
            methodName: fromUSN ? "withdraw" : "ft_transfer_call",
            args: fromUSN
                ? {
                      asset_id: tokenOut.contractName,
                      amount:
                          amount ===
                          formatTokenAmount(fullAmount, 18, 5).toString()
                              ? fullAmount
                              : parseTokenAmount(amount, 18),
                  }
                : {
                      receiver_id: usnContractName,
                      amount:
                          amount ===
                          formatTokenAmount(fullAmount, 6, 5).toString()
                              ? fullAmount
                              : parseTokenAmount(amount, 6),
                      msg: "",
                  },
            amount: ONE_YOCTO_NEAR,
            gas: GAS_FOR_CALL,
            // deposit: '1',
        });

        transactions.push({
            receiverId: tokenIn.contractName,
            functionCalls: tokenInActions,
        });

        return executeMultipleTransactions(accountId, wallet, transactions);
    };

    return { fetchByOrSell, isLoading, setIsLoading };
};
