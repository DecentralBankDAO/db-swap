import { BN } from "bn.js";
import Decimal from "decimal.js";
import getAccount from "../../api/get-account";
import getAssets from "../../api/get-assets";
import { ChangeMethodsLogic, ChangeMethodsNearToken, ChangeMethodsOracle, ChangeMethodsToken } from "../../interfaces";
import { computeWithdrawMaxAmount } from "../../redux/slices/Burrow/Selectors/getWithdrowMaxAmount";
import { transformAccount } from "../../redux/transform/account";
import { transformAssets } from "../../redux/transform/assets";
import { decimalMax, decimalMin, getBurrow, nearTokenId } from "../../utils/burrow";
import { NEAR_DECIMALS, NEAR_STORAGE_DEPOSIT, NO_STORAGE_DEPOSIT_CONTRACTS } from "../constants";
import { expandToken, expandTokenDecimal } from "../helpers";
import { getTokenContract, isRegistered, prepareAndExecuteTransactions, Transaction } from "../tokens";



interface Props {
    tokenId: string;
    extraDecimals: number;
    amount: number | string;
    isMax: boolean;
    wallet: any;
}

export async function withdraw({ tokenId, extraDecimals, amount, isMax, wallet }: Props) {
    const assets = await getAssets(wallet).then(transformAssets);
    const account = await getAccount(wallet).then(transformAccount);
    if (!account) return;

    const asset = assets[tokenId];
    const { decimals } = asset.metadata;
    const { logicContract, oracleContract, account: walletAccount } = await getBurrow(wallet);
    const tokenContract = await getTokenContract(tokenId, walletAccount);
    const isNEAR = tokenId === nearTokenId;

    const suppliedBalance = new Decimal(account.portfolio?.supplied[tokenId]?.balance || 0);
    const maxAmount = computeWithdrawMaxAmount(tokenId, assets, account.portfolio!);

    const expandedAmount = isMax
        ? maxAmount
        : decimalMin(maxAmount, expandTokenDecimal(amount, decimals + extraDecimals));

    const transactions: Transaction[] = [];

    if (
        !(await isRegistered(account.accountId, tokenContract, wallet)) &&
        !NO_STORAGE_DEPOSIT_CONTRACTS.includes(tokenContract.contractId)
    ) {
        transactions.push({
            receiverId: tokenContract.contractId,
            functionCalls: [
                {
                    methodName: ChangeMethodsToken[ChangeMethodsToken.storage_deposit],
                    amount: new BN(expandToken(NEAR_STORAGE_DEPOSIT, NEAR_DECIMALS)),
                },
            ],
        });
    }

    const withdrawAction = {
        Withdraw: {
            token_id: tokenId,
            max_amount: !isMax ? expandedAmount.toFixed(0) : undefined,
        },
    };

    const decreaseCollateralAmount = decimalMax(expandedAmount.sub(suppliedBalance), 0);

    if (decreaseCollateralAmount.gt(0)) {
        transactions.push({
            receiverId: oracleContract.contractId,
            functionCalls: [
                {
                    methodName: ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
                    args: {
                        receiver_id: logicContract.contractId,
                        msg: JSON.stringify({
                            Execute: {
                                actions: [
                                    {
                                        DecreaseCollateral: {
                                            token_id: tokenId,
                                            amount: decreaseCollateralAmount.toFixed(0),
                                        },
                                    },
                                    withdrawAction,
                                ],
                            },
                        }),
                    },
                },
            ],
        });
    } else {
        transactions.push({
            receiverId: logicContract.contractId,
            functionCalls: [
                {
                    methodName: ChangeMethodsLogic[ChangeMethodsLogic.execute],
                    args: {
                        actions: [withdrawAction],
                    },
                },
            ],
        });
    }

    // 10 yocto is for rounding errors.
    if (isNEAR && expandedAmount.gt(10)) {
        transactions.push({
            receiverId: tokenContract.contractId,
            functionCalls: [
                {
                    methodName: ChangeMethodsNearToken[ChangeMethodsNearToken.near_withdraw],
                    args: {
                        amount: expandedAmount.sub(10).toFixed(0),
                    },
                },
            ],
        });
    }

    await prepareAndExecuteTransactions(transactions, wallet);
}