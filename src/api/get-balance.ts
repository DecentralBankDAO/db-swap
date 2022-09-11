import { Contract } from "near-api-js";

import { getContract } from "../store";
import { ChangeMethodsToken, ViewMethodsToken } from "../interfaces";
import { getBurrow } from "../utils/burrow";

export const getTokenContract = async (tokenContractAddress: string, account): Promise<Contract> => {
  return getContract(account, tokenContractAddress, ViewMethodsToken, ChangeMethodsToken);
};

const getBalance = async (tokenId: string, accountId: string, wallet): Promise<string> => {
  const { view, account } = await getBurrow(wallet);

  try {
    const tokenContract: Contract = await getTokenContract(tokenId, account);

    const balanceInYocto: string = (await view(
      tokenContract,
      ViewMethodsToken[ViewMethodsToken.ft_balance_of],
      {
        account_id: accountId,
      },
    )) as string;

    return balanceInYocto;
  } catch (err: any) {
    console.error(`Failed to get balance for ${accountId} on ${tokenId} ${err.message}`);
    return "0";
  }
};

export default getBalance;