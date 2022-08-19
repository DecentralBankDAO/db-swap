import React from 'react'
import styled from 'styled-components';
import TokenIcon from './TokenIcon';

const SingleTokenContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 100px;
    cursor: pointer;
    padding: 5px;
    background-color: #53565c;
    height: 40px;
    border-radius: 50px;
    border: ${({ active}) => active ? '2px solid #fff' : 'none'};

    .symbolContainer {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        min-width: 90px;
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
            font-weight: 700;
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


const list = ["USDT", "USDC"];

const SingleToken = ({ token, onClick, active}) => {
    return (
        <SingleTokenContainer onClick={() => onClick(token)} active={active}>
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
            {/* <div className="token_balance">
                {formatTokenAmount(
                    token.balance,
                    token?.onChainFTMetadata?.decimals
                )}
            </div> */}
        </SingleTokenContainer>
    );
};

export function TokensList({ tokens, selectedTokenFrom, selectedTokenTo, onSelectToken }) {

    const tokensList = tokens.filter((item) => {
        const symbol = item.onChainFTMetadata?.symbol;
        // const selectedToken = token?.onChainFTMetadata?.symbol;
        return list.indexOf(symbol) > -1;
    });
  return (
    <div className='relative left-[calc(50%-110px)] flex w-[230px] justify-between mb-[35px]'>
        {
        tokensList.map((token) => (
                <SingleToken
                    active={token.onChainFTMetadata?.symbol === selectedTokenFrom || token.onChainFTMetadata?.symbol === selectedTokenTo}
                    onClick={(token) => {
                        onSelectToken(token);
                        handleClose();
                    }}
                    token={token}
                    key={token?.onChainFTMetadata?.symbol}
                />
        ))
        }
    </div>
  )
};

