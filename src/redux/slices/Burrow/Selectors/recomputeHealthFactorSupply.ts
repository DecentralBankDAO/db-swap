import Decimal from "decimal.js";
import { clone } from "ramda";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../..";
import { expandTokenDecimal, hasAssets, MAX_RATIO } from "../../../../store";
import { getAdjustedSum } from "./getWithdrowMaxAmount";



export const recomputeHealthFactorSupply = (tokenId: string, amount: number) =>
    createSelector(
        (state: RootState) => state.assets,
        (state: RootState) => state.account,
        (state: RootState) => state.app,
        (assets, account, app) => {
            if (!hasAssets(assets)) return 0;
            if (!account.portfolio || !tokenId) return 0;

            const { metadata, config } = assets.data[tokenId];
            const decimals = metadata.decimals + config.extra_decimals;

            const clonedAccount = clone(account);

            if (!clonedAccount.portfolio.collateral[tokenId]) {
                clonedAccount.portfolio.collateral[tokenId] = {
                    balance: "0",
                    shares: "0",
                    apr: "0",
                };
            }

            const collateralBalance = new Decimal(clonedAccount.portfolio.collateral[tokenId].balance);
            const amountDecimal = expandTokenDecimal(amount, decimals);
            const newBalance = collateralBalance.plus(app.selected.useAsCollateral ? amountDecimal : 0);

            clonedAccount.portfolio.collateral[tokenId].balance = newBalance.toFixed();

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
