import React from "react";
import styled from "styled-components";
import { formatTokenAmount } from "./formatToken";

import { MinimumReceived } from "./helpers";
import SwapInfoItem from "./SwapInfoItem";

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

function SwapInfoContainer({ amount, symbols, tradingFee, min }) {
    const feePercent = 0.01;
    // const isUsdt = token === "USDT";
    const expectedAmount = +amount * 1;
    // const symbol = !isUsdt ? "USDT" : "USN";
    const sliceAmount =
        amount.length > 10 ? amount.slice(0, 10) + "..." : amount;

    return (
        <StyledContainer>
            {/* <SwapInfoItem
                leftText="Slippage tolerance"
                slippageError={slippageError}
                slippageValue={slippageValue}
                setSlippageValue={setSlippageValue}
            /> */}
            <SwapInfoItem
                leftText={"Pair price"}
                rightText={`1 ${symbols.from} = 1 ${symbols.to}`}
                // rightText={`1 ${isNear ? 'NEAR' : 'USN'} = ${rate}`}
            />
            <SwapInfoItem
                leftText={"Expected price"}
                rightText={`${sliceAmount} ${symbols.from} = ${expectedAmount} ${symbols.to}`}
            />
            <SwapInfoItem
                leftText={"Trading fee"}
                rightText={formatAmount({
                    amount,
                    symbol: symbols.to,
                    tradingFee,
                    value: `${feePercent}% / ${tradingFee}`,
                })}
            />
            <SwapInfoItem
                // isDots={isLoading}
                leftText={"Minimum received"}
                // rightText={formatAmount({
                //     amount,
                //     symbol,
                //     tradingFee,
                //     value: MinimumReceived({ token: symbol, balance: amount, exchangeRate }) - tradingFee,
                // })}
                rightText={amount ? `${min} ${symbols.to}` : `0 ${symbols.to}`}
            />
        </StyledContainer>
    );
}

export default SwapInfoContainer;
