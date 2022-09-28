import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import FormButton from "../common/FormButton";
import SwapIconTwoArrows from "../../../assets/svg/SwapIconTwoArrows";
import AvailableToSwap from "../AvailableToSwap";
import {
    formatNearAmount,
    formatTokenAmount,
    divNumbers,
    multiplyNumbers,
    subsctractNumbers,
} from "../formatToken";
import { currentToken } from "../helpers";
import SwapInfoContainer from "../SwapInfoContainer";
import SwapTokenContainer from "../SwapTokenContainer";
import { useFetchByorSellUSN } from "../../../hooks/fetchByorSellUSN";
import { useNearWallet } from "react-near";
import { usePredict } from "../../../hooks/usePredict";
import { TokensList } from "../TokensList";
import { useValues } from "../../../hooks/useValues";

const { REACT_APP_NEAR_ENV } = process.env;
const contractId = REACT_APP_NEAR_ENV === "testnet" ? "usdn.testnet" : "usn";

const StyledWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
`;

const balanceForError = (from) => {
    return from?.onChainFTMetadata?.symbol === "NEAR"
        ? +formatNearAmount(from?.balance)
        : +formatTokenAmount(
              from?.balance,
              from?.onChainFTMetadata?.decimals,
              5
          );
};

const SwapPage = ({
    multiplier,
    accountId,
    fungibleTokensList,
    nearAndUsn,
}) => {
    const wallet = useNearWallet();
    const [from, setFrom] = useState({
        onChainFTMetadata: { symbol: nearAndUsn ? "NEAR" : "USDT.e" },
        balance: "0",
    });
    const [to, setTo] = useState({
        onChainFTMetadata: { symbol: "USN" },
        balance: "0",
    });
    const [fullAmount, setFullAmount] = useState("");
    const { inputValues, setInputValues, handleChange } = useValues({
        tokenIn: from,
        tokenOut: to,
        fullAmount,
        wallet,
    });
    const inputAmount = inputValues.fromAmount || 0;
    const tradingFee = divNumbers(multiplyNumbers(inputAmount, 1), 10000);
    const minReceivedAmount = subsctractNumbers(inputAmount, tradingFee);
    const { fetchByOrSell, isLoading, setIsLoading } = useFetchByorSellUSN();
    const predicts = usePredict({
        tokenIn: from,
        tokenOut: to,
        amount: inputValues.fromAmount,
        fullAmount,
        wallet,
    });

    const balance = balanceForError(from);
    const error =
        balance < +inputValues.fromAmount ||
        !inputValues.fromAmount ||
        inputValues.fromAmount == 0;

    useEffect(() => {
        if (accountId) {
            setFrom(
                currentToken(fungibleTokensList, nearAndUsn ? "NEAR" : "USDT.e")
            );
            setTo(currentToken(fungibleTokensList, "USN"));
        }
    }, [fungibleTokensList]);

    const onHandleSwapTokens = useCallback(
        async (from, to, accountId, inputValueFrom, symbol, fullAmount) => {
            try {
                setIsLoading(true);
                await fetchByOrSell(
                    from,
                    to,
                    accountId,
                    inputValueFrom,
                    symbol,
                    fullAmount,
                    wallet
                );
            } catch (e) {
                console.error(e || e.message);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const signIn = () => {
        wallet
            .requestSignIn({
                contractId: contractId,
            })
            .catch(console.error);
    };

    return (
        <>
            {!nearAndUsn && (
                <TokensList
                    tokens={fungibleTokensList}
                    selectedTokenFrom={from?.onChainFTMetadata?.symbol}
                    selectedTokenTo={to?.onChainFTMetadata?.symbol}
                    onSelectToken={(token) => {
                        if (from?.onChainFTMetadata?.symbol === "USN") {
                            setTo(token);
                        } else {
                            setFrom(token);
                        }
                    }}
                />
            )}
            <StyledWrapper>
                <SwapTokenContainer
                    selected={from?.onChainFTMetadata?.symbol !== "USN"}
                    tokens={fungibleTokensList}
                    fromToToken={from}
                    USDT={true}
                    value={inputValues.fromAmount}
                    setInputValues={handleChange}
                    onSelectToken={(token) => setFrom(token)}
                />
                <AvailableToSwap
                    isUSN={false}
                    onClick={(balance) => {
                        console.log("balance", balance);
                        setInputValues({
                            fromAmount: balance,
                            toAmount: parseFloat(
                                subsctractNumbers(
                                    balance,
                                    divNumbers(
                                        multiplyNumbers(balance, 1),
                                        10000
                                    )
                                )
                            ).toString(),
                        });
                        setFullAmount(from?.balance);
                    }}
                    balance={from?.balance}
                    symbol={from?.onChainFTMetadata?.symbol}
                    decimals={from?.onChainFTMetadata?.decimals}
                />
                <div className="iconSwapContainer">
                    <div
                        className="iconSwap"
                        onClick={() => {
                            setFrom(to);
                            setTo(from);
                        }}
                    >
                        <SwapIconTwoArrows
                            width="23"
                            height="23"
                            color="#FFF"
                        />
                    </div>
                    <div className="iconSwapDivider" />
                </div>
                <SwapTokenContainer
                    selected={to?.onChainFTMetadata?.symbol !== "USN"}
                    onSelectToken={(token) => setTo(token)}
                    tokens={fungibleTokensList}
                    fromToToken={to}
                    setInputValues={handleChange}
                    multiplier={multiplier}
                    value={inputValues.toAmount}
                    sum={minReceivedAmount}
                />
                <AvailableToSwap
                    isUSN={true}
                    balance={to?.balance}
                    symbol={to?.onChainFTMetadata?.symbol}
                    decimals={to?.onChainFTMetadata?.decimals}
                />
            </StyledWrapper>
            <SwapInfoContainer
                amount={inputValues.fromAmount}
                symbols={{
                    from: from?.onChainFTMetadata?.symbol,
                    to: to?.onChainFTMetadata?.symbol,
                }}
                predicts={predicts}
                nearAndUsn={nearAndUsn}
                min={inputValues.toAmount}
                tradingFee={tradingFee}
            />
            <div className="buttons-bottom-buttons">
                <FormButton
                    type="submit"
                    color="dark-gold"
                    disabled={!accountId ? false : error || isLoading}
                    data-test-id="sendMoneyPageSubmitAmountButton"
                    onClick={() =>
                        accountId
                            ? onHandleSwapTokens(
                                  from,
                                  to,
                                  accountId,
                                  inputValues.fromAmount,
                                  from?.onChainFTMetadata?.symbol,
                                  fullAmount
                              )
                            : signIn()
                    }
                    sending={isLoading}
                >
                    {accountId ? <>Continue</> : <>Connect to Wallet</>}
                </FormButton>
            </div>
        </>
    );
};

export default SwapPage;
