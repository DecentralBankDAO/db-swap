import { createSelector } from "@reduxjs/toolkit";
import Decimal from "decimal.js"
import { hasAssets, toUsd, transformAsset } from "../../../store";
import { hiddenAssets } from "./config";

export const getAvailableAssets = (source: "supply" | "borrow") =>
  createSelector(
    (state) => state.assets.data,
    (state) => state.account,
    (state) => state.app,
    (assets, account, app) => {
      const filterKey = source === "supply" ? "can_deposit" : "can_borrow";
      return Object.keys(assets)
        .filter((tokenId) => assets[tokenId].config[filterKey])
        .filter((tokenId) => !hiddenAssets.includes(assets[tokenId].token_id))
        .map((tokenId) => transformAsset(assets[tokenId], account, assets, app));
    },
  );

export const getTotalSupplyAndBorrowUSD = (tokenId: string) =>
  createSelector(
    (state) => state.assets,
    (assets) => {
      const asset = assets.data[tokenId];
      if (!asset) return [0, 0];

      const totalSupplyD = new Decimal(asset.supplied.balance).toFixed();
      const totalBorrowD = new Decimal(asset.borrowed.balance).toFixed();

      return [toUsd(totalSupplyD, asset), toUsd(totalBorrowD, asset)];
    },
  );


export const getAssets = createSelector(
  (state) => state.assets,
  (assets) => assets,
)

export const isHasAssets = createSelector(
  (state) => state.assets,
  (assets) => hasAssets(assets),
)

export const isAssetsFetching = createSelector(
  (state) => state.assets,
  (assets) => assets.status === "fetching",
);