import { clone } from "ramda";

import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../..";
import { expandTokenDecimal, hasAssets, MAX_RATIO } from "../../../../store";
import { getAdjustedSum } from "./getWithdrowMaxAmount";


export const recomputeHealthFactorAdjust = (tokenId: string, amount: number) =>
    createSelector(
        (state: RootState) => state.assets,
        (state: RootState) => state.account,
        (assets, account) => {
            if (!hasAssets(assets)) return 0;
            if (!account.portfolio || !tokenId) return 0;

            const { metadata, config } = assets.data[tokenId];
            const decimals = metadata.decimals + config.extra_decimals;

            const newBalance = expandTokenDecimal(amount, decimals).toFixed();

            const clonedAccount = clone(account);

            if (!clonedAccount.portfolio.collateral[tokenId]) {
                clonedAccount.portfolio.collateral[tokenId] = {
                    balance: newBalance,
                    shares: newBalance,
                    apr: "0",
                };
            }

            clonedAccount.portfolio.collateral[tokenId] = {
                ...clonedAccount.portfolio.collateral[tokenId],
                balance: newBalance,
            };

            const adjustedCollateralSum = getAdjustedSum(
                "collateral",
                clonedAccount.portfolio,
                assets.data,
            );
            const adjustedBorrowedSum = getAdjustedSum("borrowed", account.portfolio, assets.data);

            const healthFactor = adjustedCollateralSum.div(adjustedBorrowedSum).mul(100).toNumber();

            return healthFactor < MAX_RATIO ? healthFactor : MAX_RATIO;
        },
    );
