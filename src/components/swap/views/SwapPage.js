import React, { useCallback, useState } from 'react';
import styled from 'styled-components'
import { useDispatch } from 'react-redux';

import FormButton from '../common/FormButton';
import AvailableToSwap from '../AvailableToSwap';
import {
    formatNearAmount,
    formatTokenAmount,
    divNumbers,
    multiplyNumbers,
    subsctractNumbers,
    plusNumbers,
} from '../formatToken';
import { replacedValue } from '../helpers';
import SwapInfoContainer from '../SwapInfoContainer';
import SwapTokenContainer from '../SwapTokenContainer';
import { useFetchByorSellUSN } from '../../../hooks/fetchByorSellUSN';
import { useNearWallet } from 'react-near';
import { getBalanceFromPool } from '../utils/getBalanceFromPool';
import { Alert } from '../Alert';

const { REACT_APP_NEAR_ENV } = process.env;
const contractId  = REACT_APP_NEAR_ENV === 'testnet' ? 'usdn.testnet' : 'usn'

const StyledWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
`

const balanceForError = (from) => {
    return from?.onChainFTMetadata?.symbol === 'NEAR'
        ? +formatNearAmount(from?.balance)
        : +formatTokenAmount(from?.balance, from?.onChainFTMetadata?.decimals, 5);
};

const SwapPage = ({
  from,
  to,
  multiplier,
  accountId,
  setErrorFromHash,
}) => {
    const wallet = useNearWallet();

    const [fullAmount, setFullAmount] = useState("");
    const [inputValues, setInputValues] = useState({
        fromAmount: "",
        toAmount: "",
    });
    const inputAmount = inputValues.fromAmount || 0;
    const tradingFee = divNumbers(multiplyNumbers(inputAmount, 1), 10000);
    const minReceivedAmount = subsctractNumbers(inputAmount, tradingFee);
    const { fetchByOrSell, isLoading, setIsLoading } = useFetchByorSellUSN(
        wallet.account()
    );
    const { message, usdtBalance} = getBalanceFromPool({
        amount: inputValues.fromAmount,
        wallet
    })
    const balance = balanceForError(from);
    const error =
        balance < +inputValues.fromAmount ||
        !inputValues.fromAmount ||
        inputValues.fromAmount == 0;

    const onHandleSwapTokens = useCallback(async (accountId, inputValueFrom, symbol, fullAmount) => {
        try {
            setIsLoading(true);
            await fetchByOrSell(accountId, inputValueFrom, symbol, fullAmount, wallet);
        } catch (e) {
            setErrorFromHash(e.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signIn = () => {
        wallet.requestSignIn({
            contractId: contractId
        })
        .catch(console.error);
    }

    const handleChange = (e) => {
        const { value } = e.target;
        const replaceValue = replacedValue(e.target.dataset.token, value);

        if(e.target.name === 'FROM') {
            setInputValues({
                fromAmount: value ? replaceValue : '',
                toAmount: value ? replaceValue : ''
            });
        } else {
            const withPercent = plusNumbers(value ? replaceValue : 0, divNumbers(multiplyNumbers(value ? replaceValue : 0, 1), 10000));
            const currentAmount = plusNumbers(value ? replaceValue : 0, divNumbers(multiplyNumbers(withPercent, 1), 10000));
            setInputValues({
                fromAmount: value ? replaceValue : '',
                toAmount: value ? replaceValue : ''
            }); 
        }
        
    };

    return (
        <>
            <StyledWrapper>
                <SwapTokenContainer
                fromToToken={from}
                USDT={true}
                value={inputValues.fromAmount}
                setInputValues={handleChange}
            />
                <AvailableToSwap
                    isUSN={false}
                    onClick={(balance) => {
                        console.log('balance', balance);
                        setInputValues({fromAmount: balance, toAmount: parseFloat(subsctractNumbers(balance, divNumbers(multiplyNumbers(balance, 1), 10000))).toString()});
                        setFullAmount(from?.balance);
                    }}
                    balance={from?.balance}
                    symbol={from?.onChainFTMetadata?.symbol}
                    decimals={from?.onChainFTMetadata?.decimals}
                />
                <div className="iconSwapContainer">
                    <div className="iconSwap"></div>
                    <div className="iconSwapDivider"/>
                 </div>
                <SwapTokenContainer
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
                token={from?.onChainFTMetadata?.symbol}
                amount={inputValues.fromAmount}
                min={inputValues.toAmount}
                tradingFee={tradingFee}
            />
            <div className="buttons-bottom-buttons">
                <FormButton
                    type="submit"
                    color='dark-gold'
                    disabled={!accountId ? false : error || isLoading || message}
                    data-test-id="sendMoneyPageSubmitAmountButton"
                    onClick={() => accountId
                        ? onHandleSwapTokens(accountId, inputValues.fromAmount, from?.onChainFTMetadata?.symbol, fullAmount)
                        : signIn()}
                    sending={isLoading}
                >
                  {accountId ? <>Redeem USN</> : <>Connect to Wallet</>}
                </FormButton>
                {message && <Alert usdtBalance={usdtBalance}/>}
            </div>
        </>
    );
};

export default SwapPage;