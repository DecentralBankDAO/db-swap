import Decimal from "decimal.js";
import { Contract } from "near-api-js";
import { ChangeMethodsLogic, ChangeMethodsOracle, ViewMethodsLogic, ViewMethodsOracle } from "../interfaces";
import { IConfig } from "../interfaces/burrow";
import { LOGIC_CONTRACT_NAME } from "../redux/slices/Burrow/config";
import { getContract } from "../store/helpers";

export const getBurrow = async (wallet: any) => {

  const account = wallet.account();

  const view = async (
    contract: Contract,
    methodName: string,
    args: Record<string, unknown> = {},
    json = true,
  ): Promise<Record<string, any> | string> => {
    try {
      const viewAccount = wallet.account();
      return await viewAccount.viewFunction(contract.contractId, methodName, args, {
        // always parse to string, JSON parser will fail if its not a json
        parse: (data: Uint8Array) => {
          const result = Buffer.from(data).toString();
          return json ? JSON.parse(result) : result;
        },
      });
    } catch (err: any) {
      console.error(
        `view failed on ${contract.contractId} method: ${methodName}, ${JSON.stringify(args)}`,
      );
      throw err;
    }
  };


  const logicContract: Contract = await getContract(
    account,
    LOGIC_CONTRACT_NAME,
    ViewMethodsLogic,
    ChangeMethodsLogic,
  );

  // get oracle address from
  const config = (await view(
    logicContract,
    ViewMethodsLogic[ViewMethodsLogic.get_config],
  )) as IConfig;

  const oracleContract: Contract = await getContract(
    account,
    config.oracle_account_id,
    ViewMethodsOracle,
    ChangeMethodsOracle,
  );

  return {
    account,
    logicContract,
    oracleContract,
    view,
    config,
  };
};

export function decimalMin(a: string | number | Decimal, b: string | number | Decimal): Decimal {
  a = new Decimal(a);
  b = new Decimal(b);
  return a.lt(b) ? a : b;
}

export function decimalMax(a: string | number | Decimal, b: string | number | Decimal): Decimal {
  a = new Decimal(a);
  b = new Decimal(b);
  return a.gt(b) ? a : b;
}