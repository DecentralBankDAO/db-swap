import { ViewMethodsLogic } from "../interfaces/contract-methods";
import { NetTvlFarm } from "../interfaces";
import { getBurrow } from "../utils/burrow";

const getFarm = async (farmId: "NetTvl", wallet): Promise<NetTvlFarm> => {
  const { view, logicContract } = await getBurrow(wallet);

  try {
    const farms = (await view(logicContract, ViewMethodsLogic[ViewMethodsLogic.get_asset_farm], {
      farm_id: farmId,
    })) as NetTvlFarm;

    return farms;
  } catch (e) {
    console.error(e);
    throw new Error("getFarm");
  }
};

export default getFarm;
