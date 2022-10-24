import { Big } from 'big.js/big';
import { utils } from 'near-api-js';

const NEAR_FRACTIONAL_DIGITS = 5;

export const divNumbers = (firstValue, secondValue) =>
    Big(firstValue).div(secondValue).toString();
export const multiplyNumbers = (firstValue, secondValue) =>
    Big(firstValue).times(secondValue).toString();
export const subsctractNumbers = (firstValue, secondValue) =>
    Big(firstValue).sub(Big(secondValue)).toFixed(5);
export const plusNumbers = (firstValue, secondValue) =>
    Big(firstValue).plus(Big(secondValue)).toString();
export const formatTokenAmount = (value, decimals = 18, precision = 5) => value && typeof value !== 'object' 
? parseFloat(Big(value).div(Big(10).pow(decimals)).toFixed(precision)) 
: 0;
export const parseTokenAmount = (value, decimals = 18) => value && Big(value).times(Big(10).pow(decimals)).toFixed();

export const formatNearAmount = (amount) => {
    if (typeof amount === "object") {
        return "0";
    }
    amount = amount?.toString();

    if (amount === '0') {
        return amount;
    }
    let formattedAmount = utils.format.formatNearAmount(amount, NEAR_FRACTIONAL_DIGITS);
    if (formattedAmount === '0') {
        return `< ${!NEAR_FRACTIONAL_DIGITS ? '0' : `0.${'0'.repeat((NEAR_FRACTIONAL_DIGITS || 1) - 1)}1`}`;
    }
    return formattedAmount;
};