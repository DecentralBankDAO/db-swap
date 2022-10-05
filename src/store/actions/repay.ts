import { BN } from "bn.js";
import Decimal from "decimal.js";
import getBalance from "../../api/get-balance";
import { ChangeMethodsOracle } from "../../interfaces";
import { decimalMax, decimalMin, getBurrow, nearTokenId } from "../../utils/burrow";
import { getAccountDetailed } from "../accounts";
import { NEAR_STORAGE_DEPOSIT_DECIMAL } from "../constants";
import { expandTokenDecimal } from "../helpers";
import { FunctionCallOptions, getMetadata, getTokenContract, prepareAndExecuteTransactions, registerNearFnCall } from "../tokens";

export async function repay({
    tokenId,
    amount,
    extraDecimals,
    isMax,
    wallet
}: {
    tokenId: string;
    amount: number | string;
    extraDecimals: number;
    isMax: boolean;
    wallet: any;
}) {
    const { account, logicContract, oracleContract } = await getBurrow(wallet);
    const { decimals } = (await getMetadata(tokenId, wallet))!;
    const detailedAccount = (await getAccountDetailed(account.accountId, wallet))!;
    const isNEAR = tokenId === nearTokenId;
    const functionCalls: FunctionCallOptions[] = [];

    const borrowedBalance = new Decimal(
        detailedAccount.borrowed.find((a) => a.token_id === tokenId)?.balance || 0,
    );

    const extraDecimalMultiplier = expandTokenDecimal(1, extraDecimals);

    const tokenBorrowedBalance = borrowedBalance.divToInt(extraDecimalMultiplier);

    const tokenBalance = new Decimal(await getBalance(tokenId, account.accountId, wallet));
    const accountBalance = decimalMax(
        0,
        new Decimal((await account.getAccountBalance()).available).sub(NEAR_STORAGE_DEPOSIT_DECIMAL),
    );

    const maxAvailableBalance = isNEAR ? tokenBalance.add(accountBalance) : tokenBalance;
    const maxAmount = decimalMin(tokenBorrowedBalance, maxAvailableBalance);
    const expandedAmountToken = isMax
        ? maxAmount
        : decimalMin(maxAmount, expandTokenDecimal(amount, decimals));

    const msg = {
        Execute: {
            actions: [
                {
                    RepayUsn: expandedAmountToken.mul(extraDecimalMultiplier).toFixed(0),
                },
            ],
        },
    };

    functionCalls.push({
        methodName: ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
        gas: new BN("150000000000000"),
        args: {
            receiver_id: logicContract.contractId,
            amount: expandedAmountToken.toFixed(0),
            msg: JSON.stringify(msg),
        },
    });

    await prepareAndExecuteTransactions([
        {
            receiverId: oracleContract.contractId,
            functionCalls,
        },
    ],
        wallet
    );
}
