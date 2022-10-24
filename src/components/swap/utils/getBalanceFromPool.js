import { useState } from "react";
import { formatTokenAmount } from "../formatToken";

const { REACT_APP_NEAR_ENV } = process.env;
const IS_MAINNET = REACT_APP_NEAR_ENV === "mainnet" ? true : false;
const usnContractName = !IS_MAINNET ? "usdn.testnet" : "usn";
const usdtContractName = !IS_MAINNET
    ? "usdt.fakes.testnet"
    : "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near";

export const getBalanceFromPool = ({ amount, wallet }) => {
    const [usdtBalance, setUsdtBalance] = useState(0);

    wallet
        .account()
        .viewFunction(usdtContractName, "ft_balance_of", {
            account_id: usnContractName,
        })
        .then((balance) => setUsdtBalance(formatTokenAmount(balance, 6)));
        
    if (Number(amount) > usdtBalance)
        return "All good! Please do not worry! Currently you are not able to withdraw USDT due to DCB toping up the reserves. You will be able to withdraw USDT soon. Thank you.";

    return "";
};