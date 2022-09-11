import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../..";
import { hasAssets, MAX_RATIO } from "../../../../store";
import { Portfolio } from "../accountState";
import { Assets } from "../assetState";
import { getAdjustedSum } from "./getWithdrowMaxAmount";



export const computeBorrowMaxAmount = (tokenId: string, assets: Assets, portfolio: Portfolio) => {
    const asset = assets[tokenId];
    const adjustedCollateralSum = getAdjustedSum("collateral", portfolio, assets);
    const adjustedBorrowedSum = getAdjustedSum("borrowed", portfolio, assets);
    const volatiliyRatio = asset.config.volatility_ratio || 0;
    const price = asset.price?.usd || 1;

    const maxBorrowAmount = adjustedCollateralSum
        .sub(adjustedBorrowedSum)
        .mul(volatiliyRatio)
        .div(MAX_RATIO)
        .div(price)
        .mul(95)
        .div(100);

    return maxBorrowAmount;
};

export const getBorrowMaxAmount = (tokenId: string) =>
    createSelector(
        (state: RootState) => state.assets,
        (state: RootState) => state.account,
        (assets, account) => {
            if (!account.accountId || !tokenId) return 0;
            if (!hasAssets(assets)) return 0;

            const maxBorrowAmount = computeBorrowMaxAmount(tokenId, assets.data, account.portfolio);

            return maxBorrowAmount.toNumber();
        },
    );
