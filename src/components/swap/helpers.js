import * as nearApiJs from 'near-api-js';
import { useEffect, useState } from 'react';

import { wallet } from '../../utils/wallet';
import { parseTokenAmount } from './formatToken';

const { REACT_APP_NEAR_ENV } = process.env;
const IS_MAINNET = REACT_APP_NEAR_ENV === 'testnet' ? false : true;

export const replacedValue = (flag, value) => {
    return flag !== 'USN'
        ? value.replace(',', '.').replace(/^\d{13,13}/, '$1').replace(/(\.\d{6})\d+/g, '$1')
        : value.replace(',', '.').replace(/^\d{13,13}/, '$1').replace(/(\.\d{18})\d+/g, '$1');
}

export const currentToken = (tokens, value) => {
    return tokens.find((el) => el.onChainFTMetadata.symbol === value);
};

export const exchangeRateTranslation = ({ token, balance, exchangeRate }) => {
    return token?.onChainFTMetadata?.symbol === 'NEAR'
        ? balance / exchangeRate
        : balance * exchangeRate;
};

export const exchangeRateTranslationFromHash = ({ method, balance, exchangeRate }) => {
    return method === 'withdraw'
        ? balance * exchangeRate
        : balance / exchangeRate;
};

export const MinimumReceived = ({ token, balance, exchangeRate }) => {
    return token === 'NEAR' ? balance / exchangeRate : balance * exchangeRate;
};

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value]);

    return debouncedValue;
};

const roundUSNExchange = (amount, exchangeRate) => {
    const currentExchangeRate = +exchangeRate;

    return amount * currentExchangeRate;
};

async function fetchCommission({ accountId, amount, exchangeRate, token }) {
    const contractName = !IS_MAINNET ? 'usdn.testnet' : 'usn';
    const currentToken = token?.onChainFTMetadata?.symbol === 'NEAR';
    const currentExchangeRate = +exchangeRate;
    const usnMethods = {
        viewMethods: ['version', 'name', 'symbol', 'decimals', 'ft_balance_of', 'spread'],
        changeMethods: ['buy', 'sell'],
    };
    // const account = await wallet.getAccount(accountId);
    const usnContract = new nearApiJs.Contract(
        accountId,
        contractName,
        usnMethods
    );
    const usnAmount = (currentToken
        ? parseTokenAmount(roundUSNExchange(amount, exchangeRate) * 10 ** 24, 0)
        : parseTokenAmount(amount * 10 ** 18, 0)).toString();
    const result = await usnContract.spread({ amount: usnAmount }) / 1000000;

    return {
        result: currentToken ? (currentExchangeRate * amount) * result : (amount / currentExchangeRate) * result,
        percent: Number(result * 100)?.toFixed(2)
    };
}

export const commission = ({ accountId, amount, delay, exchangeRate, token, isSwapped }) => {
    const [commissionFee, setCommissionFee] = useState('');
    const [isLoadingCommission, setIsLoadingCommission] = useState(false);
    const debounceValue = useDebounce(amount, delay);

    useEffect(() => {
        const getCommission = async () => {
            if (debounceValue) {
                setIsLoadingCommission(true);
                const commission = await fetchCommission({
                    accountId,
                    amount: debounceValue,
                    exchangeRate,
                    token,
                });
                setCommissionFee(commission);
                setIsLoadingCommission(false);
            }
        };

        getCommission();
    }, [debounceValue, exchangeRate, isSwapped]);

    return { commissionFee, isLoadingCommission };
};
