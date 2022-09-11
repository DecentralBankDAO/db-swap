
import { IConfig } from "../interfaces/burrow";
import { ViewMethodsLogic } from "../interfaces/contract-methods";

import { getBurrow } from "../utils/burrow";

const getConfig = async (wallet): Promise<IConfig> => {
  const { view, logicContract } = await getBurrow(wallet);

  try {
    const config = (await view(
      logicContract,
      ViewMethodsLogic[ViewMethodsLogic.get_config],
    )) as IConfig;

    return config;
  } catch (e) {
    console.error(e);
    throw new Error("getConfig");
  }
};

export default getConfig;
