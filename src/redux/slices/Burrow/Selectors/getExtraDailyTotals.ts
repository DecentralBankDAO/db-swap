import { createSelector } from "@reduxjs/toolkit";
import { hasAssets } from "../../../../store";

import { getAccountRewards } from "./getAccountRewards";

export const getExtraDailyTotals = ({ isStaking = false }: { isStaking: boolean }) =>
  createSelector(
    (state) => state.assets,
    getAccountRewards,
    (state) => state.app.config,
    (assets, rewards, config) => {
      if (!hasAssets(assets)) return 0;

      const { extra, brrr } = rewards;

      const gainBrrr =
        (brrr.dailyAmount || 0) * (assets.data[config.booster_token_id]?.price?.usd || 0);

      const gainExtra = Object.keys(extra).reduce((acc, tokenId) => {
        const price = assets.data[tokenId]?.price?.usd || 0;
        const daily = isStaking ? extra[tokenId].newDailyAmount : extra[tokenId].dailyAmount;
        return acc + daily * price;
      }, 0);

      return gainExtra + gainBrrr;
    },
  );