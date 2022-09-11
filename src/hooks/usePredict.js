import * as nearApiJs from 'near-api-js';
import { useEffect, useState } from 'react';
import { formatTokenAmount, parseTokenAmount } from '../components/swap/formatToken';
import { ftViewFunc } from './fetchByorSellUSN';

const { REACT_APP_NEAR_ENV } = process.env;
const IS_MAINNET = REACT_APP_NEAR_ENV === 'mainnet' ? true : false;
const REFcontract = !IS_MAINNET ? 'ref-finance-101.testnet' : 'v2.ref-finance.near';
const wNEAR = !IS_MAINNET ? 'wrap.testnet' : 'wrap.near';



const getPredict = async (account, amount, multiplier, symbol, accountId) => {
  
  if(!multiplier.spotFull || !multiplier.twapFull) return


  const contractName = !IS_MAINNET ? 'usdn.testnet' : 'usn';
  const currentToken = symbol === 'NEAR';
  const usnMethods = {
      viewMethods: ['predict_buy', 'predict_sell',],
  };

  const usnContract = new nearApiJs.Contract(
      account,
      contractName,
      usnMethods
  );
  
    let result;
    // console.log('parse', currentToken ? parseTokenAmount(amount * (10 ** 24), 0) : parseTokenAmount(amount * (10 ** 18), 0));
    // console.log('accountId', accountId);

    if(symbol === 'NEAR') {
         result = await usnContract.predict_buy({
            account: accountId ? accountId : 'dontcare',
            amount: currentToken ? parseTokenAmount(amount * (10 ** 24), 0).toString() : parseTokenAmount(amount * (10 ** 18), 0).toString(),
            rates: [
                {
                  multiplier: multiplier.spotFull,
                  decimals: multiplier.spotDecimals
                },
                {
                  multiplier: multiplier.twapFull,
                  decimals: multiplier.twapDecimals,
                },
              ],
        })
    } else {
        result = await usnContract.predict_sell({
            account: accountId ? accountId : 'dontcare',
            amount: currentToken ? parseTokenAmount(amount * (10 ** 24), 0) : parseTokenAmount(amount * (10 ** 18), 0),
            rates: [
                {
                  multiplier: multiplier.spotFull,
                  decimals: multiplier.spotDecimals,
                },
                {
                  multiplier: multiplier.twapFull,
                  decimals: multiplier.twapDecimals,
                },
              ],
        })
    }
    return {
      amount: currentToken ? formatTokenAmount(result.amount, 18, 5) : formatTokenAmount(result.amount, 24, 5),
      commission: currentToken ? formatTokenAmount(result.commission.usn, 18, 5) : formatTokenAmount(result.commission.near, 24, 5),
      sum: currentToken 
            ? +formatTokenAmount(result.amount, 18, 5) + +formatTokenAmount(result.commission.usn, 18, 5) 
            : +formatTokenAmount(result.amount, 24, 5) + +formatTokenAmount(result.commission.near, 24, 5),
      rate: result.rate.multiplier / 10000, 
      rateFull: result.rate.multiplier
    }
}

export const usePredict = ({ tokenOut, tokenIn, amount, fullAmount, wallet}) => {
    const [predict, setPredict] = useState('');
    const [predictForOne, setPredictForOne] = useState('');

    const getPredictPrice = async (amount = '1') => {
      const contractIn = tokenIn.contractName ? tokenIn.contractName : wNEAR;
      const contractOut = tokenOut.contractName ? tokenOut.contractName : wNEAR;
      const decimalsIn =  tokenIn.onChainFTMetadata?.decimals;
      const decimalsOut = tokenOut.onChainFTMetadata?.decimals;
      // const isInputTargetTO = target && target === 'TO';
      // const curDecimals = isInputTargetTO ? decimalsOut : decimalsIn;
      // console.log('isInputTargetTO', isInputTargetTO);
      // console.log('target', target);
      // console.log('token_in', isInputTargetTO ? contractOut : contractIn);
      // console.log('token_out', isInputTargetTO ? contractIn : contractOut);
      // console.log('curDecimals', curDecimals);




      const swapAmount = await ftViewFunc(REFcontract, 'get_return', {
        pool_id: 424,
        token_in: contractIn,
        token_out: contractOut,
        amount_in: amount === formatTokenAmount(fullAmount, decimalsIn, 5).toString() ? fullAmount : parseTokenAmount(amount, decimalsIn),
        },
        wallet
        );
        // console.log('result', formatTokenAmount(swapAmount, isInputTargetTO ? decimalsIn : decimalsOut, 5));
        return formatTokenAmount(swapAmount, decimalsOut, 5);
    }
    
    useEffect(async () => {
      if(tokenIn?.onChainFTMetadata?.symbol === 'NEAR' || tokenOut?.onChainFTMetadata?.symbol === 'NEAR') {
        const swapAmount = await getPredictPrice('1')
        setPredictForOne(swapAmount)
      }

    },[tokenOut, tokenIn])

    useEffect(async () => {
      if(tokenIn?.onChainFTMetadata?.symbol === 'NEAR' || tokenOut?.onChainFTMetadata?.symbol === 'NEAR') {
       const swapAmount = await getPredictPrice(amount)
       setPredict(swapAmount)
      }

    },[amount, tokenOut, tokenIn])

    return { predict, predictForOne}
}

