import * as nearApiJs from 'near-api-js';
import { useEffect, useState } from 'react';
import { formatTokenAmount, parseTokenAmount } from '../components/swap/formatToken';

const { REACT_APP_NEAR_ENV } = process.env;
const IS_MAINNET = REACT_APP_NEAR_ENV === 'mainnet' ? true : false;


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

export const usePredict = (account, amount, multiplier, symbol, accountId) => {
    const [predict, setPredict] = useState('');
    

    useEffect(() => {
      let isActive = true;
      const getPredictPrice = async () => {
        const reseult = await getPredict(account, amount, multiplier, symbol, accountId)
        setPredict(reseult)
      }

      getPredictPrice()
      
      return () => { isActive = false };
    },[amount, symbol, multiplier])

    return predict
}

