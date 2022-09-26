import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../..";
import { hasAssets, MAX_RATIO } from "../../../../store";
import { Portfolio } from "../accountState";
import { Assets } from "../assetState";
import { getAdjustedSum, predictByBorrow } from "./getWithdrowMaxAmount";



export const computeBorrowMaxAmount = (collateralAssetTokenId: string, tokenId: string, assets: Assets, portfolio: Portfolio, amount: number | string) => {
    const asset = assets[tokenId];
    const adjustedCollateralSum = getAdjustedSum("collateral", portfolio, assets);
    const adjustedBorrowedSum = getAdjustedSum("borrowed", portfolio, assets);
    const predictedBorrow = predictByBorrow(assets, amount, collateralAssetTokenId)
    const volatiliyRatio = asset.config.volatility_ratio || 0;
    const price = asset.price?.usd || 1;

    const maxBorrowAmount = adjustedCollateralSum
        .add(predictedBorrow)
        .sub(adjustedBorrowedSum)
        .mul(volatiliyRatio)
        .div(MAX_RATIO)
        .div(price)
        .mul(95)
        .div(100);

    return maxBorrowAmount;
};

export const getBorrowMaxAmount = (collateralAssetTokenId: string, tokenId: string) =>
    createSelector(
        (state: RootState) => state.assets,
        (state: RootState) => state.account,
        (state: RootState) => state.app.selected.amount,
        (assets, account, amount) => {
            if (!account.accountId || !tokenId) return 0;
            if (!hasAssets(assets)) return 0;

            const maxBorrowAmount = computeBorrowMaxAmount(collateralAssetTokenId, tokenId, assets.data, account.portfolio, amount);

            return maxBorrowAmount.toNumber();
        },
    );
