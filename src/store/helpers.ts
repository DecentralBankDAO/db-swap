import Decimal from "decimal.js";
import { pick } from "ramda";

import { Account, Contract } from "near-api-js";
import { IAssetPrice, IPrices, UIAsset, ViewMethodsOracle } from "../interfaces";
import { AccountState } from "../redux/slices/Burrow/accountState";
import { AppState } from "../redux/slices/Burrow/appSlice";
import { Asset, Assets, AssetsState } from "../redux/slices/Burrow/assetState";
import { getBurrow } from "../utils/burrow";
import { TOKEN_FORMAT, USD_FORMAT } from "./constants";

const { REACT_APP_NEAR_ENV } = process.env;
const USNcontractId = REACT_APP_NEAR_ENV === 'testnet' ? 'usdn.testnet' : 'usn'

export const getPrices = async (wallet: any): Promise<IPrices | undefined> => {
  const { view, oracleContract } = await getBurrow(wallet);

  try {
    const priceResponse: IPrices = (await view(
      oracleContract,
      ViewMethodsOracle[ViewMethodsOracle.get_price_data],
    )) as IPrices;

    if (priceResponse) {
      priceResponse.prices = priceResponse?.prices.map((assetPrice: IAssetPrice) => ({
        ...assetPrice,
        price: assetPrice.price
          ? {
            ...assetPrice.price,
            usd: new Decimal(assetPrice.price?.multiplier || 0).div(10000).toNumber(),
          }
          : null,
      }))!;
    }

    return priceResponse;
  } catch (err: any) {
    console.error("Getting prices failed: ", err.message);
    return undefined;
  }
};

export const getContract = async (
  account: Account,
  contractAddress: string,
  viewMethods: any,
  changeMethods: any,
): Promise<Contract> => {
  const contract: Contract = new Contract(account, contractAddress, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: Object.values(viewMethods)
      .filter((m) => typeof m === "string")
      .map((m) => m as string),
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: Object.values(changeMethods)
      .filter((m) => typeof m === "string")
      .map((m) => m as string),
  });

  return contract;
};

export const shrinkToken = (
  value: string | number,
  decimals: string | number,
  fixed?: number,
): string => {
  return new Decimal(value).div(new Decimal(10).pow(decimals)).toFixed(fixed);
};

export const toUsd = (balance: string, asset: Asset) =>
  asset.price?.usd
    ? Number(shrinkToken(balance, asset.metadata.decimals + asset.config.extra_decimals)) *
    asset.price.usd
    : 0;
export const hasAssets = (assets: AssetsState) => Object.entries(assets.data).length > 0;

export const sumReducer = (sum: number, a: number) => sum + a;

export const expandTokenDecimal = (
  value: string | number | Decimal,
  decimals: string | number,
): Decimal => {
  return new Decimal(value).mul(new Decimal(10).pow(decimals));
};

export const expandToken = (
  value: string | number | Decimal,
  decimals: string | number,
  fixed?: number,
): string => {
  return expandTokenDecimal(value, decimals).toFixed(fixed);
};

export const transformAsset = (
  asset: Asset,
  account: AccountState,
  assets: Assets,
  app: AppState,
): UIAsset => {
  const tokenId = asset.token_id;
  const brrrTokenId = app.config.booster_token_id;
  const totalSupplyD = new Decimal(asset.supplied.balance)
    .plus(new Decimal(asset.reserved))
    .toFixed();

  const totalSupply = Number(
    shrinkToken(totalSupplyD, asset.metadata.decimals + asset.config.extra_decimals),
  );

  // TODO: refactor: remove temp vars using ramda
  const temp1 = new Decimal(asset.supplied.balance)
    .plus(new Decimal(asset.reserved))
    .minus(new Decimal(asset.borrowed.balance));
  const temp2 = temp1.minus(temp1.mul(0.001)).toFixed(0);
  const availableLiquidity = Number(
    shrinkToken(temp2, asset.metadata.decimals + asset.config.extra_decimals),
  );
  const availableLiquidity$ = toUsd(temp2, asset).toLocaleString(undefined, USD_FORMAT);

  let accountAttrs = {
    supplied: 0,
    collateral: 0,
    borrowed: 0,
    deposited: 0,
    availableNEAR: 0,
    available: 0,
    extraDecimals: 0,
  };

  // TODO: refactor this without conditional
  if (account.accountId) {
    const decimals = asset.metadata.decimals + asset.config.extra_decimals;

    const supplied = Number(
      shrinkToken(account.portfolio.supplied[tokenId]?.balance || 0, decimals),
    );
    const collateral = Number(
      shrinkToken(account.portfolio.collateral[tokenId]?.balance || 0, decimals),
    );
    const borrowed = account.portfolio.borrowed[tokenId]?.balance || 0;
    const available = account.balances[tokenId] || 0;
    const availableNEAR = account.balances["near"] || 0;

    accountAttrs = {
      supplied,
      collateral,
      deposited: supplied + collateral,
      borrowed: Number(shrinkToken(borrowed, decimals)),
      available: Number(shrinkToken(available, asset.metadata.decimals)),
      availableNEAR: Number(shrinkToken(availableNEAR, asset.metadata.decimals)),
      extraDecimals: asset.config.extra_decimals,
    };
  }

  return {
    tokenId,
    ...pick(["icon", "symbol", "name"], asset.metadata),
    price: tokenId === USNcontractId && !asset.price ? 1 : asset.price ? asset.price.usd : 0,
    supplyApy: Number(asset.supply_apr) * 100,
    totalSupply,
    totalSupply$: toUsd(totalSupplyD, asset).toLocaleString(undefined, USD_FORMAT),
    totalSupplyMoney: toUsd(totalSupplyD, asset),
    borrowApy: Number(asset.borrow_apr) * 100,
    availableLiquidity,
    availableLiquidity$,
    collateralFactor: `${Number(asset.config.volatility_ratio / 100)}%`,
    canUseAsCollateral: asset.config.can_use_as_collateral,
    ...accountAttrs,
    brrrBorrow: Number(
      shrinkToken(
        asset.farms.borrowed[brrrTokenId]?.["reward_per_day"] || "0",
        assets[brrrTokenId].metadata.decimals,
      ),
    ),
    brrrSupply: Number(
      shrinkToken(
        asset.farms.supplied[brrrTokenId]?.["reward_per_day"] || "0",
        assets[brrrTokenId].metadata.decimals,
      ),
    ),
    depositRewards: getRewards("supplied", asset, assets),
    borrowRewards: getRewards("borrowed", asset, assets),
  };
};

export const getRewards = (action: "supplied" | "borrowed", asset: Asset, assets: Assets) => {
  return Object.entries(asset.farms[action]).map(([tokenId, rewards]) => ({
    rewards,
    metadata: assets[tokenId].metadata,
    config: assets[tokenId].config,
    price: assets[tokenId].price?.usd ?? 0,
  }));
};


export const emptySuppliedAsset = (asset: { supplied: number; collateral: number }): boolean =>
  !(
    asset.supplied.toLocaleString(undefined, TOKEN_FORMAT) ===
    (0).toLocaleString(undefined, TOKEN_FORMAT) &&
    asset.collateral.toLocaleString(undefined, TOKEN_FORMAT) ===
    (0).toLocaleString(undefined, TOKEN_FORMAT)
  );

export const emptyBorrowedAsset = (asset: { borrowed: number }): boolean =>
  !(
    asset.borrowed.toLocaleString(undefined, TOKEN_FORMAT) ===
    (0).toLocaleString(undefined, TOKEN_FORMAT)
  );

