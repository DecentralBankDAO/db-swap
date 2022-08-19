import React from 'react';
// import { Translate } from 'react-localize-redux';

const { REACT_APP_NEAR_ENV } = process.env;
const IS_MAINNET = REACT_APP_NEAR_ENV === 'mainnet' ? true : false;
const usnContractName = !IS_MAINNET ? 'usdn.testnet' : 'usn';
const usdtContractName = !IS_MAINNET ? 'usdt.fakes.testnet' : 'dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near';
const usdcContractName = !IS_MAINNET ? 'usdc.fakes.testnet' : 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near';

const tokensSymbol = {
    [usdtContractName]: 'USDT',
    [usdcContractName]: 'USDC',
    [usnContractName]: 'USN'
}

const TextInfoSuccess = ({ valueFrom, valueTo, textInfo, errorFromHash }) => {

    return !errorFromHash 
       ? <div className="text_info_success">
            <>
               <>Transaction complete!</>
            </>
            <br />
            <>
                <>You swap</> {valueFrom}{' '}
                {tokensSymbol[textInfo.sender]}
            </>
            <br />
            <>
                <>To</>  {valueTo} {tokensSymbol[textInfo.receiver]}
            </>
        </div>
        : <div className="text_info_success">
        <>
           <>Oops! Something went wrong.</>
        </>
        <br />
        <br />
        <>
            <div>{errorFromHash}</div>
        </>
    </div>
    
};

// const comparisonFn = (prev, next) => prev.valueTo !== next.valueTo;

export default TextInfoSuccess;