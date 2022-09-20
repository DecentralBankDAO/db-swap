import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../..";
import { transformAsset } from "../../../store";
import { hiddenAssets } from "./config";

const { REACT_APP_NEAR_ENV } = process.env;
const USNcontractId = REACT_APP_NEAR_ENV === 'testnet' ? 'usdn.testnet' : 'usn'

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
            .filter((tokenId) => !hiddenAssets.includes(tokenId))[0];

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
        const asset = assets[USNcontractId];
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