import { IAccountDetailed, ViewMethodsLogic } from "../interfaces";
import { getBurrow } from "../utils/burrow";


const getPortfolio = async (account_id: string, wallet): Promise<IAccountDetailed> => {
  const { view, logicContract } = await getBurrow(wallet);

  const accountDetailed = (await view(
    logicContract,
    ViewMethodsLogic[ViewMethodsLogic.get_account],
    {
      account_id,
    },
  )) as IAccountDetailed;

  return accountDetailed;
};

export default getPortfolio;