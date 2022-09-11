import { useState } from "react";
import { divNumbers, formatTokenAmount, multiplyNumbers, parseTokenAmount, plusNumbers, subsctractNumbers } from "../components/swap/formatToken";
import { replacedValue } from "../components/swap/helpers";
import { ftViewFunc } from "./fetchByorSellUSN";

const { REACT_APP_NEAR_ENV } = process.env;
const IS_MAINNET = REACT_APP_NEAR_ENV === 'mainnet' ? true : false;
const REFcontract = !IS_MAINNET ? 'ref-finance-101.testnet' : 'v2.ref-finance.near';
const wNEAR = !IS_MAINNET ? 'wrap.testnet' : 'wrap.near';

export const useValues = ({ tokenOut, tokenIn, fullAmount, wallet}) => {
    const [inputValues, setInputValues] = useState({
        fromAmount: "",
        toAmount: "",
    });

    const contractIn = tokenIn?.contractName ? tokenIn?.contractName : wNEAR;
    const contractOut = tokenOut?.contractName ? tokenOut?.contractName : wNEAR;
    const decimalsIn =  tokenIn?.onChainFTMetadata?.decimals;
    const decimalsOut = tokenOut?.onChainFTMetadata?.decimals;

    const handleChange = async (e) => {
        const { value } = e.target;
        const replaceValue = replacedValue(e.target.dataset.token, value);
        
        
        if(tokenIn?.onChainFTMetadata?.symbol === 'NEAR' || tokenOut?.onChainFTMetadata?.symbol === 'NEAR') {
                if(e.target.name === "FROM") {
                    const predict = await ftViewFunc(REFcontract, 'get_return', {
                        pool_id: 424,
                        token_in: contractIn,
                        token_out: contractOut,
                        amount_in: replaceValue === formatTokenAmount(fullAmount, decimalsIn, 5).toString() ? fullAmount : parseTokenAmount(replaceValue, decimalsIn),
                        },
                        wallet
                        );
                    setInputValues({
                        fromAmount: value ? replaceValue : "",
                        toAmount: formatTokenAmount(
                            predict, 
                            decimalsOut
                        ).toString(),
                    });
                } else {
                    const predict = await ftViewFunc(REFcontract, 'get_return', {
                        pool_id: 424,
                        token_in: contractOut,
                        token_out: contractIn,
                        amount_in: replaceValue === formatTokenAmount(fullAmount, decimalsOut, 5).toString() ? fullAmount : parseTokenAmount(replaceValue, decimalsOut),
                        },
                        wallet
                        );
                    setInputValues({
                        fromAmount: formatTokenAmount(
                            predict, 
                            decimalsIn
                        ).toString(),
                        toAmount: value ? replaceValue : "",
                    });
                }

                return;
        }

        if (e.target.name === "FROM") {
            setInputValues({
                fromAmount: value ? replaceValue : "",
                toAmount: parseFloat(
                    subsctractNumbers(
                        value ? replaceValue : 0,
                        divNumbers(
                            multiplyNumbers(value ? replaceValue : 0, 1),
                            10000
                        )
                    )
                ).toString(),
            });
        } else {
            const withPercent = plusNumbers(
                value ? replaceValue : 0,
                divNumbers(multiplyNumbers(value ? replaceValue : 0, 1), 10000)
            );
            const currentAmount = plusNumbers(
                value ? replaceValue : 0,
                divNumbers(multiplyNumbers(withPercent, 1), 10000)
            );
            setInputValues({
                fromAmount: parseFloat(
                    Number(currentAmount).toFixed(6)
                ).toString(),
                toAmount: value ? replaceValue : "",
            });
        }
    };

    return { inputValues, setInputValues, handleChange}
}