import { IAccountDetailed, ViewMethodsLogic } from "../interfaces";
import { getBurrow } from "../utils/burrow";

export const getAccountDetailed = async (account_id: string, wallet: any): Promise<IAccountDetailed | null> => {
    if (!account_id) return null;

    const { view, logicContract } = await getBurrow(wallet);

    const accountDetailed: IAccountDetailed = (await view(
        logicContract,
        ViewMethodsLogic[ViewMethodsLogic.get_account],
        {
            account_id,
        },
    )) as IAccountDetailed;

    return accountDetailed;
};