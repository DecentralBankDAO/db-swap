import React from 'react';
import styled from 'styled-components';
import { formatTokenAmount } from './formatToken';

import { MinimumReceived } from './helpers';
import SwapInfoItem from './SwapInfoItem';

const pairPrice = (isNear, exchangeRate) => {
    const price = isNear ? 1 * exchangeRate : 1 / exchangeRate;
    return price?.toFixed(5);
};

const StyledContainer = styled.div`
    width: 100%;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

function formatAmount({ amount, symbol, tradingFee, value }) {
    if (!amount && !tradingFee) {
        return `0 ${symbol}`;
    }

    if (!tradingFee) {
        return `0 ${symbol}`;
    }

    if (!amount) {
        return `0 ${symbol}`;
    }

    return `${value} ${symbol}`;
}

function SwapInfoContainer({
   amount,
   token,
   slippageValue,
   tradingFee,
   isLoading,
   min,
}) {
    const feePercent = 0.01;
    const isUsdt = token === 'USDT.e';
    const expectedAmount = +amount * 1;
    const symbol = !isUsdt ? 'USDT.e' : 'USN';
    const sliceAmount = amount.length > 10 ? amount.slice(0, 10) + '...' : amount
    
    return (
        <StyledContainer>
            <SwapInfoItem
                leftText={'Pair price'}
                rightText={`1 ${isUsdt ? 'USDT.e' : 'USN'} = 1 ${symbol}`}
            />
            <SwapInfoItem
                leftText={'Expected price'}
                title={amount}
                rightText={`${sliceAmount} ${token} = ${sliceAmount} ${symbol}`}
            />
            <SwapInfoItem
                leftText={'Trading fee'}
                rightText={'0%'}
            />
            <SwapInfoItem
                leftText={'Minimum received'}
                rightText={(amount || 0) + ' USDT.e'}
            />
        </StyledContainer>
    );
}

export default SwapInfoContainer;