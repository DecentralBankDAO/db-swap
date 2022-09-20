import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import {
    fetchMultiplier,
    fetchMultiplierTWAP,
} from "../../../redux/slices/multiplier";
import FormButton from "../common/FormButton";
import SwapIconTwoArrows from "../../../assets/svg/SwapIconTwoArrows";
import AvailableToSwap from "../AvailableToSwap";
import {
    formatNearAmount,
    formatTokenAmount,
    divNumbers,
    multiplyNumbers,
    subsctractNumbers,
    plusNumbers,
    parseTokenAmount,
} from "../formatToken";
import { commission, currentToken, replacedValue } from "../helpers";
import Loader from "../Loader";
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
    setActiveView,
    setErrorFromHash,
    multipliers,
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
    // const { commissionFee, isLoadingCommission } = commission({
    //     accountId: wallet.account(),
    //     amount: inputValues.fromAmount,
    //     delay: 500,
    //     exchangeRate: + multiplier,
    //     token: from,
    //     isSwapped,
    // });
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
    // const currentMultiplier = predict?.rate * 10000
    console.log("fungibleTokensList", fungibleTokensList);
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
                // setActiveView('success');
            } catch (e) {
                setErrorFromHash(e.message);
                // setActiveView('success');
                // dispatch(showCustomAlert({
                //     errorMessage: e.message,
                //     success: false,
                //     messageCodeHeader: 'error',
                // }));
            } finally {
                setIsLoading(false);
                // dispatch(checkAndHideLedgerModal());
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

    // const handleChange = (e) => {
    //     const { value } = e.target;
    //     // const isUSDT = from?.onChainFTMetadata?.symbol === "USDT";
    //     setTarget(e.target.name)
    //     const replaceValue = replacedValue(e.target.dataset.token, value);

    //     if (e.target.name === "FROM") {
    //         setInputValues({
    //             fromAmount: value ? replaceValue : "",
    //             toAmount: parseFloat(
    //                 subsctractNumbers(
    //                     value ? replaceValue : 0,
    //                     divNumbers(
    //                         multiplyNumbers(value ? replaceValue : 0, 1),
    //                         10000
    //                     )
    //                 )
    //             ).toString(),
    //         });
    //     } else {
    //         const withPercent = plusNumbers(
    //             value ? replaceValue : 0,
    //             divNumbers(multiplyNumbers(value ? replaceValue : 0, 1), 10000)
    //         );
    //         const currentAmount = plusNumbers(
    //             value ? replaceValue : 0,
    //             divNumbers(multiplyNumbers(withPercent, 1), 10000)
    //         );
    //         setInputValues({
    //             fromAmount: parseFloat(
    //                 Number(currentAmount).toFixed(6)
    //             ).toString(),
    //             toAmount: value ? replaceValue : "",
    //         });
    //     }
    // };

    return (
        <>
            {/* <div className="wrap">
                <Loader
                    onRefreshMultiplier={() => {
                        dispatch(fetchMultiplier());
                        dispatch(fetchMultiplierTWAP());
                    }}
                />
            </div> */}
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
                    // onClick={(balance) => {
                    //     setInputValueFrom(balance);
                    //     from?.onChainFTMetadata?.symbol === 'USN' && setUSNAmount(from?.balance);
                    // }}
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
                // tradingFee={commissionFee?.result}
                // expected={inputValueFrom? predict?.sum : '0'}
                // rate={predict?.rate}
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
                {/* <FormButton
                    type="button"
                    className="link"
                    color="gray"
                    linkTo="/"
                >
                    <>Cancel</>
                </FormButton> */}
            </div>
        </>
    );
};

export default SwapPage;
