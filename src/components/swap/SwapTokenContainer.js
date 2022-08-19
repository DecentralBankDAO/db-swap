import React, { useRef, useState } from "react";
import styled from "styled-components";

import TokenIcon from "./TokenIcon";
import { formatNearAmount, formatTokenAmount } from "./formatToken";
import { maxLength } from "./helpers";
import { ArrowDownGold, ArrowDownWhite } from "../../assets/svg/ArrowsDown";
import { SelectToken } from "./SelectToken";

const { REACT_APP_NEAR_ENV } = process.env;
const EXPLORER_URL =
    REACT_APP_NEAR_ENV === "testnet"
        ? "https://near-contract-helper.onrender.com"
        : "https://helper.mainnet.near.org";

const SwapContainer = styled.div`
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    input {
        text-align: right;
        padding-right: 3px;
        height: auto;
        border: 0;
        background-color: #fefdee;
        width: 100%;
        margin-left: auto;
        font-weight: 500;
        font-size: 18px;
        line-height: 22px;
        color: #252729;
        margin-bottom: 10px;
    }
    .exchange {
        text-align: right;
        padding: 0;
        height: auto;
        border: 0;
        background-color: #fefdee;
        width: fit-content;
        margin-left: auto;
        font-weight: 500;
        font-size: 18px;
        line-height: 22px;
        color: #252729;
    }
    .inputError {
        color: #ec6563;
    }
    .symbolFlex {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
    }
    .symbolContainer {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        min-width: 100px;
    }
    .inputContainer {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 350px;
        height: 60px;
        padding-right: 20px;
        background-color: #fefdee;
    }
    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-radius: 50%;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
        align-self: center;
    }
    .desc {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 5px;
        display: block;
        min-width: 0;
        .symbol {
            font-weight: 700;
            font-size: 16px;
            color: #ffffff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
            a {
                color: inherit;
            }
        }
    }
`;

const SwapTokenContainer = ({
    USDT = false,
    fromToToken,
    value,
    setInputValues,
    tokens,
    onSelectToken,
    selected,
}) => {
    const [hover, setHover] = useState(false);
    const inputRef = useRef(null);
    const balance = +formatTokenAmount(
        fromToToken?.balance,
        fromToToken?.onChainFTMetadata?.decimals,
        5
    );

    const error = balance < +value;

    // const onFocus = () => {
    //     if (USDT) {
    //         inputRef.current.focus();
    //     }
    // };

    return (
        <SwapContainer className={error ? "error" : ""}>
            <div className="symbolFlex">
                <div className="symbolContainer">
                    <div className="icon">
                        <TokenIcon
                            symbol={fromToToken?.onChainFTMetadata?.symbol}
                            icon={fromToToken?.onChainFTMetadata?.icon}
                        />
                    </div>
                    <div className="desc">
                        {fromToToken?.contractName ? (
                            <span
                                className="symbol"
                                title={fromToToken?.contractName}
                            >
                                <a
                                    href={`${EXPLORER_URL}/accounts/${fromToToken?.contractName}`}
                                    onClick={(e) => e.stopPropagation()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {fromToToken?.onChainFTMetadata?.symbol ||
                                        fromToToken?.onChainFTMetadata?.name}
                                </a>
                            </span>
                        ) : (
                            <span className="symbol">
                                {fromToToken?.onChainFTMetadata?.symbol}
                            </span>
                        )}
                    </div>
                    {/* {selected && (
                        <SelectToken
                            token={fromToToken}
                            onSelectToken={onSelectToken}
                            tokens={tokens}
                            arrowTrigger={
                                <div
                                    className="ml-[2px] p-[5px] cursor-pointer rounded-full hover:bg-black bg-opacity-30"
                                    onMouseEnter={() => setHover(true)}
                                    onMouseLeave={() => setHover(false)}
                                >
                                    {!hover ? (
                                        <ArrowDownWhite />
                                    ) : (
                                        <ArrowDownGold />
                                    )}
                                </div>
                            }
                        />
                    )} */}
                </div>
                <div className="inputContainer">
                    <input
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        name={USDT ? "FROM" : "TO"}
                        data-token={fromToToken?.onChainFTMetadata?.symbol}
                        // maxLength={maxLength(value, fromToToken?.onChainFTMetadata?.symbol)}
                        autoFocus={USDT}
                        placeholder="0"
                        value={value.replace(",", ".")}
                        onChange={(e) => setInputValues(e)}
                        className={USDT && error ? "inputError" : ""}
                    />
                </div>
            </div>
        </SwapContainer>
    );
};

export default SwapTokenContainer;
