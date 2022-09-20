import { BN } from "bn.js";
import Decimal from "decimal.js";
import getBalance from "../../api/get-balance";
import { ChangeMethodsNearToken, ChangeMethodsToken } from "../../interfaces";
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
    amount: number;
    extraDecimals: number;
    isMax: boolean;
    wallet: any;
}) {
    const { account, logicContract } = await getBurrow(wallet);
    const tokenContract = await getTokenContract(tokenId, account);
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

    if (isNEAR && expandedAmountToken.gt(tokenBalance)) {
        const toWrapAmount = expandedAmountToken.sub(tokenBalance);
        functionCalls.push(...(await registerNearFnCall(account.accountId, tokenContract, wallet)));
        functionCalls.push({
            methodName: ChangeMethodsNearToken[ChangeMethodsNearToken.near_deposit],
            gas: new BN("5000000000000"),
            amount: new BN(toWrapAmount.toFixed(0)),
        });
    }

    const msg = {
        Execute: {
            actions: [
                {
                    Repay: {
                        max_amount: !isMax
                            ? expandedAmountToken.mul(extraDecimalMultiplier).toFixed(0)
                            : undefined,
                        token_id: tokenId,
                    },
                },
            ],
        },
    };

    functionCalls.push({
        methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
        gas: new BN("150000000000000"),
        args: {
            receiver_id: logicContract.contractId,
            amount: expandedAmountToken.toFixed(0),
            msg: JSON.stringify(msg),
        },
    });

    await prepareAndExecuteTransactions([
        {
            receiverId: tokenContract.contractId,
            functionCalls,
        },
    ],
        wallet
    );
}
