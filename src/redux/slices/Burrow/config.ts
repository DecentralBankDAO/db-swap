export const DUST_THRESHOLD = 0.001;

export const hiddenAssets = ["ref.fakes.testnet", "meta-token.near"];

export const hiddenAssetsSupplied = ["ref.fakes.testnet", "test_brrr.1638481328.burrow.testnet"];
const { REACT_APP_NEAR_ENV } = process.env;
export const defaultNetwork = REACT_APP_NEAR_ENV === "mainnet" ? "mainnet" : "testnet" as any;

export const LOGIC_CONTRACT_NAME = REACT_APP_NEAR_ENV === "mainnet" ? "usn" : "usdn.testnet" as string;

const META_TOKEN = { testnet: undefined, mainnet: "meta-token.near" };
const REF_TOKEN = { testnet: "ref.fakes.testnet", mainnet: "token.v2.ref-finance.near" };
const BRRR_TOKEN = { testnet: "test_brrr.1638481328.burrow.testnet", mainnet: "token.burrow.near" };

export const missingPriceTokens = [REF_TOKEN, META_TOKEN, BRRR_TOKEN];