// import { initialStaking } from "../redux/accountState";
import { initialStaking } from "../slices/Burrow/accountState";
import { omit } from "ramda";
import { transformAccountFarms } from "./farms";

const listToMap = (list) =>
  list
    .map((asset) => ({ [asset.token_id]: omit(["token_id"], asset) }))
    .reduce((a, b) => ({ ...a, ...b }), {});

export const hasZeroSharesFarmRewards = (farms): boolean => {
    return farms.some((farm) => farm["rewards"].some((reward) => reward["boosted_shares"] === "0"));
  };

export const transformPortfolio = (account) => {
  const { portfolio } = account;
  if (!portfolio) return undefined;

  const { booster_staking, supplied, borrowed, collateral, farms } = portfolio;

  return {
    supplied: listToMap(supplied),
    borrowed: listToMap(borrowed),
    collateral: listToMap(collateral),
    farms: transformAccountFarms(farms),
    staking: booster_staking || initialStaking,
    hasNonFarmedAssets:
      account.portfolio["has_non_farmed_assets"] || hasZeroSharesFarmRewards(farms),
  };
};

export const transformAccount = (account) => {
  if (!account) return undefined;

  const { accountId, accountBalance, tokenIds } = account;

  return {
    accountId,
    balances: {
      ...account.balances
        .map((b, i) => ({ [tokenIds[i]]: b }))
        .reduce((a, b) => ({ ...a, ...b }), {}),
      near: accountBalance,
    },
    portfolio: transformPortfolio(account),
  };
};
