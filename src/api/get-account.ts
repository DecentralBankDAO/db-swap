import { getAssetsDetailed } from "../store";
import { getBurrow } from "../utils/burrow";

import getBalance from "./get-balance";
import getPortfolio from "./get-portfolio";


const getAccount = async (wallet) => {
  const { account } = await getBurrow(wallet);
  const { accountId } = account;

  if (accountId) {
    const assets = await getAssetsDetailed(wallet);
    const tokenIds = assets.map((asset) => asset.token_id);
    const accountBalance = (await account.getAccountBalance()).available;
    const balances = await Promise.all(tokenIds.map((id) => getBalance(id, accountId, wallet)));
    const portfolio = await getPortfolio(accountId, wallet);
    return { accountId, accountBalance, balances, portfolio, tokenIds };
  }

  return undefined;
};

export default getAccount;