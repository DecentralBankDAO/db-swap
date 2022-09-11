import { Contract } from "near-api-js";
import Decimal from "decimal.js";

import { DEFAULT_PRECISION } from "./constants";
import { getContract } from "./helpers";
import {
  ChangeMethodsToken,
  ViewMethodsToken,
  IMetadata,
} from "../interfaces";
import { getBurrow } from "../utils/burrow";


Decimal.set({ precision: DEFAULT_PRECISION });

export const getTokenContract = async (tokenContractAddress: string, account: any): Promise<Contract> => {
    return getContract(account, tokenContractAddress, ViewMethodsToken, ChangeMethodsToken);
  };
  
  export const getMetadata = async (token_id: string, wallet: any): Promise<IMetadata | undefined> => {
    try {
      const { account, view } = await getBurrow(wallet);
      const tokenContract: Contract = await getTokenContract(token_id, account);
  
      const metadata: IMetadata = (await view(
        tokenContract,
        ViewMethodsToken[ViewMethodsToken.ft_metadata],
      )) as IMetadata;
  
      metadata.token_id = token_id;
      return metadata;
    } catch (err: any) {
      console.error(`Failed to get metadata for ${token_id} ${err.message}`);
      return undefined;
    }
  };
  
  export const getAllMetadata = async (token_ids: string[], wallet: any): Promise<IMetadata[]> => {
    try {
      const metadata: IMetadata[] = (
        await Promise.all(token_ids.map((token_id) => getMetadata(token_id, wallet)))
      ).filter((m): m is IMetadata => !!m);
  
      return metadata;
    } catch (err) {
      console.error(err);
      throw new Error("getAllMetadata");
    }
  };