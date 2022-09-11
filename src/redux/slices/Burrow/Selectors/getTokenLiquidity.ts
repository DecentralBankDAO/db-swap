import { createSelector } from "@reduxjs/toolkit";
import { hasAssets, toUsd } from "../../../../store";



export const getTokenLiquidity = (tokenId: string) =>
  createSelector(
    (state) => state.assets,
    (assets) => {
      if (!hasAssets(assets) || !tokenId) return 0;
      const asset = assets.data[tokenId];
      const supplied = toUsd(asset.supplied.balance, asset);
      const reserved = toUsd(asset.reserved, asset);
      const borrowed = toUsd(asset.borrowed.balance, asset);
      return supplied + reserved - borrowed;
    },
  );
