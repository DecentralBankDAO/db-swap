import Decimal from "decimal.js";
import BN from "bn.js";
import getBalance from "../../api/get-balance";
import { decimalMin, getBurrow, nearTokenId } from "../../utils/burrow";
import { expandToken, expandTokenDecimal } from "../helpers";
import { borrowTransactions, depositTransactions, getMetadata, getTokenContract, isRegistered, prepareAndExecuteTransactions, Transaction, wNEARtransactions } from "../tokens";
import { NEAR_DECIMALS, NEAR_STORAGE_DEPOSIT, NO_STORAGE_DEPOSIT_CONTRACTS } from "../constants";
import { ChangeMethodsToken } from "../../interfaces";
import { executeMultipleTransactions } from "../../hooks/fetchByorSellUSN";

// export interface Transaction {
//   receiverId: string;
//   functionCalls: FunctionCallOptions[];
// }

// export interface FunctionCallOptions {
//   methodName: string;
//   args?: Record<string, unknown>;
//   gas?: BN;
//   amount?: BN;
// }

const depositAndBorrow = async ({
  tokenId,
  extraDecimals,
  amount,
  isMax,
  borrowTokenId,
  borrowExtraDecimals,
  borrowAmount,
  wallet,
}: {
  tokenId: string;
  extraDecimals: number;
  amount: number | string;
  isMax: boolean;
  borrowTokenId: string;
  borrowExtraDecimals: number;
  borrowAmount: number;
  wallet: any;
}) => {
  const transactions: Transaction[] = [];

  const depositTR = await depositTransactions({
    tokenId,
    extraDecimals,
    amount,
    isMax,
    wallet,
  });

  const borrowTR = await borrowTransactions({
    borrowAmount,
    borrowTokenId,
    borrowExtraDecimals,
    wallet
  })

  if (amount && borrowAmount) {
    if (tokenId === nearTokenId) {
      const wNEARtr = await wNEARtransactions({
        amount,
        isMax,
        wallet
      });

      transactions.push(...wNEARtr);
    } else {
      transactions.push(...depositTR);
    }

    transactions.push(...borrowTR);

  } else if (amount) {
    if (tokenId === nearTokenId) {
      const wNEARtr = await wNEARtransactions({
        amount,
        isMax,
        wallet
      });

      transactions.push(...wNEARtr);
    } else {
      transactions.push(...depositTR);
    }
  } else {
    transactions.push(...borrowTR);
  }

  // const functionCalls: FunctionCallOptions[] = [];


  // const { decimals } = (await getMetadata(tokenId, wallet))!;
  // const tokenContract = await getTokenContract(tokenId, wallet);

  // const tokenBalance = new Decimal(await getBalance(tokenId, account.accountId, wallet));

  // const expandedAmount = isMax
  //   ? tokenBalance
  //   : decimalMin(expandTokenDecimal(amount, decimals), tokenBalance);

  // const collateralAmount = expandTokenDecimal(expandedAmount, extraDecimals);

  // const collateralActions = {
  //   actions: [
  //     {
  //       IncreaseCollateral: {
  //         token_id: tokenId,
  //         max_amount: collateralAmount.toFixed(0),
  //       },
  //     },
  //   ],
  // };

  // if (
  //   !(await isRegistered(account.accountId, tokenContract, wallet)) &&
  //   !NO_STORAGE_DEPOSIT_CONTRACTS.includes(tokenContract.contractId)
  // ) {
  //   functionCalls.push({
  //     methodName: ChangeMethodsToken[ChangeMethodsToken.storage_deposit],
  //     args: {
  //       account_id: account.accountId
  //     },
  //     amount: new BN(expandToken(NEAR_STORAGE_DEPOSIT, NEAR_DECIMALS)),
  //   });
  // }

  // functionCalls.push({
  //   methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
  //   args: {
  //     receiver_id: logicContract.contractId,
  //     amount: expandedAmount.toFixed(0),
  //     msg: JSON.stringify({ Execute: collateralActions }),
  //   }
  // });

  // transactions.push({
  //   receiverId: tokenContract.contractId,
  //   functionCalls
  // })

  return await prepareAndExecuteTransactions(transactions, wallet)
};

export default depositAndBorrow;