import { Contract } from "near-api-js";
import Decimal from "decimal.js";
import BN from "bn.js";

import { DEFAULT_PRECISION, NEAR_DECIMALS, NEAR_STORAGE_DEPOSIT, NEAR_STORAGE_DEPOSIT_DECIMAL, NEAR_STORAGE_DEPOSIT_MIN, NEAR_STORAGE_EXTRA_DEPOSIT, NO_STORAGE_DEPOSIT_CONTRACTS } from "./constants";
import { expandToken, expandTokenDecimal, getContract } from "./helpers";
import {
  ChangeMethodsToken,
  ViewMethodsToken,
  IMetadata,
  Balance,
  ViewMethodsLogic,
  ChangeMethodsOracle,
  ChangeMethodsNearToken,
  ChangeMethodsLogic,
} from "../interfaces";
import { decimalMax, decimalMin, getBurrow, nearTokenId } from "../utils/burrow";
import getBalance from "../api/get-balance";
import { executeMultipleTransactions } from "../hooks/fetchByorSellUSN";


Decimal.set({ precision: DEFAULT_PRECISION });

export interface Transaction {
  receiverId: string;
  functionCalls: FunctionCallOptions[];
}

export interface FunctionCallOptions {
  methodName: string;
  args?: Record<string, unknown>;
  gas?: BN;
  amount?: BN;
}

export const getTokenContract = async (tokenContractAddress: string, account: any): Promise<Contract> => {
  return getContract(account, tokenContractAddress, ViewMethodsToken, ChangeMethodsToken);
};

export const getMetadata = async (token_id: string, wallet: any): Promise<IMetadata | undefined> => {
  try {
    const { account, view } = await getBurrow(wallet);
    const tokenContract: Contract = await getTokenContract(token_id, account);

    const metadata: IMetadata = (await view(
      tokenContract,
      ViewMethodsToken[ViewMethodsToken.ft_metadata],
    )) as IMetadata;

    metadata.token_id = token_id;
    return metadata;
  } catch (err: any) {
    console.error(`Failed to get metadata for ${token_id} ${err.message}`);
    return undefined;
  }
};

export const getAllMetadata = async (token_ids: string[], wallet: any): Promise<IMetadata[]> => {
  try {
    const metadata: IMetadata[] = (
      await Promise.all(token_ids.map((token_id) => getMetadata(token_id, wallet)))
    ).filter((m): m is IMetadata => !!m);

    return metadata;
  } catch (err) {
    console.error(err);
    throw new Error("getAllMetadata");
  }
};

export const isRegistered = async (account_id: string, contract: Contract, wallet): Promise<boolean> => {
  const { view } = await getBurrow(wallet);

  const balance = (await view(contract, ViewMethodsLogic[ViewMethodsLogic.storage_balance_of], {
    account_id,
  })) as Balance;

  return balance && balance?.total !== "0";
};

export const registerNearFnCall = async (accountId: string, contract: Contract, wallet) =>
  !(await isRegistered(accountId, contract, wallet))
    ? [
      {
        methodName: ChangeMethodsLogic[ChangeMethodsLogic.storage_deposit],
        attachedDeposit: new BN(expandToken(0.00125, NEAR_DECIMALS)),
        gas: new BN("5000000000000"),
      },
    ]
    : [];

export const depositTransactions = async ({
  tokenId,
  extraDecimals,
  amount,
  isMax,
  wallet,
}: {
  tokenId: string;
  extraDecimals: number;
  amount: number;
  isMax: boolean;
  wallet: any;
}) => {
  const transactions: Transaction[] = [];
  const functionCalls: FunctionCallOptions[] = [];

  const { account, logicContract } = await getBurrow(wallet);
  const { decimals } = (await getMetadata(tokenId, wallet))!;
  const tokenContract = await getTokenContract(tokenId, account);

  const tokenBalance = new Decimal(await getBalance(tokenId, account.accountId, wallet));

  const expandedAmount = isMax
    ? tokenBalance
    : decimalMin(expandTokenDecimal(amount, decimals), tokenBalance);

  const collateralAmount = expandTokenDecimal(expandedAmount, extraDecimals);

  const collateralActions = {
    actions: [
      {
        IncreaseCollateral: {
          token_id: tokenId,
          max_amount: collateralAmount.toFixed(0),
        },
      },
    ],
  };

  if (
    !(await isRegistered(account.accountId, tokenContract, wallet)) &&
    !NO_STORAGE_DEPOSIT_CONTRACTS.includes(tokenContract.contractId)
  ) {
    functionCalls.push({
      methodName: ChangeMethodsToken[ChangeMethodsToken.storage_deposit],
      args: {
        account_id: account.accountId
      },
      amount: new BN(expandToken(NEAR_STORAGE_DEPOSIT, NEAR_DECIMALS)),
    });
  }

  functionCalls.push({
    methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
    args: {
      receiver_id: logicContract.contractId,
      amount: expandedAmount.toFixed(0),
      msg: JSON.stringify({ Execute: collateralActions }),
    }
  });

  transactions.push({
    receiverId: tokenContract.contractId,
    functionCalls
  })

  return transactions;
};

export const borrowTransactions = async ({
  borrowTokenId,
  borrowExtraDecimals,
  borrowAmount,
  wallet,
}: {
  borrowTokenId: string;
  borrowExtraDecimals: number;
  borrowAmount: number;
  wallet: any;
}) => {
  const { oracleContract, logicContract, account } = await getBurrow(wallet);
  const { decimals } = (await getMetadata(borrowTokenId, wallet))!;
  const tokenContract = await getTokenContract(borrowTokenId, account);

  const transactions: Transaction[] = [];

  const expandedAmount = expandTokenDecimal(borrowAmount, decimals + borrowExtraDecimals);
  console.log('expandedAmount', expandedAmount.toFixed(0));


  if (
    !(await isRegistered(account.accountId, tokenContract, wallet)) &&
    !NO_STORAGE_DEPOSIT_CONTRACTS.includes(tokenContract.contractId)
  ) {
    transactions.push({
      receiverId: tokenContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsToken[ChangeMethodsToken.storage_deposit],
          args: {
            account_id: account.accountId
          },
          amount: new BN(expandToken(NEAR_STORAGE_DEPOSIT, NEAR_DECIMALS)),
        },
      ],
    });
  }

  const borrowTemplate = {
    Execute: {
      actions: [
        {
          Borrow: {
            token_id: borrowTokenId,
            amount: expandedAmount.toFixed(0),
          },
        },
        {
          Withdraw: {
            token_id: borrowTokenId,
            max_amount: expandedAmount.toFixed(0),
          },
        },
      ],
    },
  };

  transactions.push({
    receiverId: oracleContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
        args: {
          receiver_id: logicContract.contractId,
          msg: JSON.stringify(borrowTemplate),
        },
      },
    ],
  });

  return transactions;
};

export const wNEARtransactions = async ({
  amount,
  isMax,
  wallet,
}: {
  amount: number;
  isMax: boolean;
  wallet: any;
}) => {

  const transactions: Transaction[] = [];

  const { account, logicContract } = await getBurrow(wallet);
  const tokenContract: Contract = await getTokenContract(nearTokenId, account);

  const accountBalance = decimalMax(
    0,
    new Decimal((await account.getAccountBalance()).available).sub(NEAR_STORAGE_DEPOSIT_DECIMAL),
  );
  const tokenBalance = new Decimal(await getBalance(nearTokenId, account.accountId, wallet));
  const maxAmount = accountBalance.add(tokenBalance);

  const expandedAmount = isMax
    ? maxAmount
    : decimalMin(expandTokenDecimal(amount, NEAR_DECIMALS), maxAmount);
  const extraDeposit = decimalMax(0, expandedAmount.sub(tokenBalance));

  const collateralActions = {
    actions: [
      {
        IncreaseCollateral: {
          token_id: nearTokenId,
          max_amount: expandedAmount.toFixed(0),
        },
      },
    ],
  };

  transactions.push({
    receiverId: tokenContract.contractId,
    functionCalls: [
      ...(await registerNearFnCall(account.accountId, tokenContract, wallet)),
      ...(extraDeposit.greaterThan(0)
        ? [
          {
            methodName: ChangeMethodsNearToken[ChangeMethodsNearToken.near_deposit],
            args: {},
            gas: new BN("5000000000000"),
            amount: new BN(extraDeposit.toFixed(0)),
          },
        ]
        : []),
      {
        methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
        gas: new BN("150000000000000"),
        args: {
          receiver_id: logicContract.contractId,
          amount: expandedAmount.toFixed(0),
          msg: JSON.stringify({ Execute: collateralActions }),
        },
      },
    ],
  })

  return transactions;
}

export const prepareAndExecuteTransactions = async (operations: Transaction[] = [], wallet) => {
  const { account, logicContract, view } = await getBurrow(wallet);
  const transactions: Transaction[] = [];

  const storageDepositTransaction = (deposit: number) => ({
    receiverId: logicContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsLogic[ChangeMethodsLogic.storage_deposit],
        args: {
          account_id: account.accountId
        },
        amount: new BN(expandToken(deposit, NEAR_DECIMALS)),
      },
    ],
  });

  // check if account is registered in burrow cash
  if (!(await isRegistered(account.accountId, logicContract, wallet))) {
    transactions.push(storageDepositTransaction(NEAR_STORAGE_DEPOSIT));
  } else {
    const balance = (await view(
      logicContract,
      ViewMethodsLogic[ViewMethodsLogic.storage_balance_of],
      {
        account_id: account.accountId,
      },
    )) as Balance;

    const balanceAvailableDecimal = new Decimal(balance.available);
    const nearStorageDepositMin = expandTokenDecimal(NEAR_STORAGE_DEPOSIT_MIN, NEAR_DECIMALS);

    if (balanceAvailableDecimal.lessThan(nearStorageDepositMin)) {
      transactions.push(storageDepositTransaction(NEAR_STORAGE_EXTRA_DEPOSIT));
    }
  }

  transactions.push(...operations);
  await executeMultipleTransactions(account.accountId, wallet, transactions);
};