import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "../../../..";
import { INetTvlFarmReward } from "../../../../interfaces";
import { NEAR_LOGO_SVG, shrinkToken } from "../../../../store";

interface IProtocolReward {
  icon: string;
  name: string;
  symbol: string;
  tokenId: string;
  dailyAmount: number;
  remainingAmount: number;
  price: number;
}

export const getNetLiquidityRewards = createSelector(
    (state) => state.assets,
    (assets) => {
      const rewards = Object.entries(assets.netTvlFarm).map(
        ([tokenId, farm]) => {
          const asset = assets.data[tokenId];
          const { metadata, config, price } = asset;
          return {
            rewards: farm,
            metadata,
            config,
            price: price?.usd ?? 0,
          };
        },
      );
  
      return rewards;
    },
  );

  export const getProtocolRewards = createSelector(
    (state: RootState) => state.assets,
    (assets) => {
      const rewards = Object.entries(assets.netTvlFarm).map(
        ([tokenId, farm]: [string, INetTvlFarmReward]) => {
          const asset = assets.data[tokenId];
          const { name, symbol, icon } = asset.metadata;
          const assetDecimals = asset.metadata.decimals + asset.config.extra_decimals;
  
          const dailyAmount = Number(shrinkToken(farm.reward_per_day, assetDecimals));
          const remainingAmount = Number(shrinkToken(farm.remaining_rewards, assetDecimals));
          return {
            icon: icon || `data:image/svg+xml,${NEAR_LOGO_SVG}`,
            name,
            symbol,
            tokenId,
            dailyAmount,
            remainingAmount,
            price: asset.price?.usd || 0,
          } as IProtocolReward;
        },
      );
  
      return rewards;
    },
  );