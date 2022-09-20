import React, { useState } from "react";
import styled from "styled-components";
import MicroModal from "react-micro-modal";
import { IoCloseOutline } from "react-icons/io5";
import TokenIcon from "./TokenIcon";
import { formatTokenAmount } from "./formatToken";

const SingleTokenContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 100px;
    cursor: pointer;
    padding: 10px;
    height: 56px;

    .symbolContainer {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        min-width: 100px;
    }

    :hover {
        background: rgba(0, 0, 0, 0.15);
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-radius: 50%;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
        align-self: center;

        svg,
        img {
            width: 30px;
        }
    }

    .desc {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 5px;
        display: block;
        min-width: 0;
        .symbol {
            font-weight: 400;
            font-size: 14px;
            color: #ffffff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
            a {
                color: inherit;
                text-decoration: none;
            }
        }
    }

    .token_balance {
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export const isMobile = () => {
    return window.screen.width < 1024;
};

const list = ["USDT.e", "USDC"];

const SingleToken = ({ token, onClick }) => {
    return (
        <SingleTokenContainer onClick={() => onClick(token)}>
            <div className="symbolContainer">
                <div className="icon">
                    <TokenIcon
                        symbol={token?.onChainFTMetadata?.symbol}
                        icon={token?.onChainFTMetadata?.icon}
                    />
                </div>
                <div className="desc">
                    {token?.contractName ? (
                        <span className="symbol" title={token?.contractName}>
                            {token?.onChainFTMetadata?.symbol ||
                                token?.onChainFTMetadata?.name}
                        </span>
                    ) : (
                        <span className="symbol">
                            {token?.onChainFTMetadata?.symbol}
                        </span>
                    )}
                </div>
            </div>
            <div className="token_balance">
                {formatTokenAmount(
                    token.balance,
                    token?.onChainFTMetadata?.decimals
                )}
            </div>
        </SingleTokenContainer>
    );
};

export const SelectToken = ({ arrowTrigger, tokens, token, onSelectToken }) => {
    const tokensList = tokens.filter((item) => {
        const symbol = item.onChainFTMetadata?.symbol;
        const selectedToken = token?.onChainFTMetadata?.symbol;
        return list.indexOf(symbol) > -1 && selectedToken !== symbol;
    });
    const [visible, setVisible] = useState(false);

    const dialogWidth = isMobile() ? "75%" : "20%";
    const dialogMinwidth = isMobile() ? 340 : 380;
    const dialogHidth = isMobile() ? "70%" : "57%";

    const handleClose = () => {
        setVisible(false);
    };
    return (
        <MicroModal
            open={visible}
            handleClose={handleClose}
            trigger={() => (
                <div onClick={() => setVisible(true)}>{arrowTrigger}</div>
            )}
            overrides={{
                Overlay: {
                    style: {
                        zIndex: 110,
                        backgroundColor: "rgba(0, 19, 32, 0.65)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                    },
                },
                Dialog: {
                    style: {
                        width: dialogWidth,
                        minWidth: dialogMinwidth,
                        borderRadius: "0.75rem",
                        border: "1px solid #C1B582",
                        padding: "1.5rem 0",
                        background: "#1D2932",
                        height: dialogHidth,
                        zIndex: 100,
                    },
                },
            }}
        >
            {() => (
                <section className="text-white">
                    <div className="flex items-center justify-between pb-5 px-8 relative border-b-[1px] border-gray-400">
                        <h2 className="text-sm font-bold text-center text-white">
                            Select Token
                        </h2>
                        <IoCloseOutline
                            onClick={() => handleClose()}
                            className="absolute text-gray-400 text-2xl right-6 cursor-pointer"
                        />
                    </div>
                    {tokensList.map((token) => (
                        <SingleToken
                            onClick={(token) => {
                                onSelectToken(token);
                                handleClose();
                            }}
                            token={token}
                            key={token?.onChainFTMetadata?.symbol}
                        />
                    ))}
                </section>
            )}
        </MicroModal>
    );
};
