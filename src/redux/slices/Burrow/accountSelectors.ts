import { createSelector } from "@reduxjs/toolkit"

export const getAccountPortfolio = createSelector(
    (state) => state.account,
    (account) => account.portfolio,
);

export const getHasNonFarmedAssets = createSelector(
    (state) => state.account,
    (account) => account.portfolio.hasNonFarmedAssets,
);

export const getAccountStatus = createSelector(
    (state) => state.account,
    (account) => account.status === "pending"
)