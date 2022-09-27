import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../..";
import { transformAsset } from "../../../store";
import { usnTokenId } from "../../../utils/burrow";
import { hiddenAssets } from "./config";

export const getFullDigits = createSelector(
    (state: RootState) => state.app,
    (app) => app.fullDigits,
);

export const getTableSorting = createSelector(
    (state: RootState) => state.app,
    (app) => app.tableSorting,
);

export const getShowDust = createSelector(
    (state: RootState) => state.app,
    (app) => app.showDust,
);

export const getDisplayAsTokenValue = createSelector(
    (state: RootState) => state.app,
    (app) => app.displayAsTokenValue,
);

export const getConfig = createSelector(
    (state: RootState) => state.app,
    (app) => app.config,
)

export const getAssetData = createSelector(
    (state: RootState) => state.app,
    (state: RootState) => state.assets.data,
    (state: RootState) => state.account,
    (app, assets, account) => {
        const defaultTokenId = Object.keys(assets)
            .filter((tokenId) => !hiddenAssets.includes(tokenId) && tokenId !== usnTokenId)[0];

        const asset = assets[app.selected?.tokenId || defaultTokenId];

        return {
            tokenId: asset?.token_id,
            action: app.selected.action,
            ...(asset ? transformAsset(asset, account, assets, app) : {}),
        };
    },
);

export const getAssetDataUSN = createSelector(
    (state: RootState) => state.app,
    (state: RootState) => state.assets.data,
    (state: RootState) => state.account,
    (app, assets, account) => {
        const asset = assets[usnTokenId];
        return {
            tokenId: asset?.token_id,
            action: app.selected.action,
            ...(asset ? transformAsset(asset, account, assets, app) : {}),
        };
    },
)

export const getSelectedValues = createSelector(
    (state: RootState) => state.app,
    (app) => app.selected,
);

export const getDegenMode = createSelector(
    (state: RootState) => state.app,
    (app) => app.degenMode,
)

export const getGlobalAction = createSelector(
    (state: RootState) => state.app,
    (app) => app.globalAction,
)