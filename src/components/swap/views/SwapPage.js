import React, { useCallback, useState } from 'react';
import styled from 'styled-components'
import { useDispatch } from 'react-redux';

import { fetchMultiplier, fetchMultiplierTWAP } from '../../../redux/slices/multiplier';
import FormButton from '../common/FormButton';
import SwapIconTwoArrows from '../../../assets/svg/SwapIconTwoArrows';
import AvailableToSwap from '../AvailableToSwap';
import {
    formatNearAmount,
    formatTokenAmount,
    divNumbers,
    multiplyNumbers,
    subsctractNumbers
} from '../formatToken';
import { commission } from '../helpers';
import Loader from '../Loader';
import SwapInfoContainer from '../SwapInfoContainer';
import SwapTokenContainer from '../SwapTokenContainer';
import { useFetchByorSellUSN } from '../../../hooks/fetchByorSellUSN';
import { useNearWallet } from 'react-near';
import { usePredict } from '../../../hooks/usePredict';

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
  inputValueFrom,
  setInputValueFrom,
  multiplier,
  accountId,
  onSwap,
  setActiveView,
  setErrorFromHash,
  multipliers
}) => {
    const wallet = useNearWallet();
    const [isSwapped, setIsSwapped] = useState(false);
    const [slippageValue, setSlippageValue] = useState('1');
    const [usnAmount, setUSNAmount] = useState('');
    const { commissionFee, isLoadingCommission } = commission({
        accountId: wallet.account(),
        amount: inputValueFrom,
        delay: 500,
        exchangeRate: + multiplier,
        token: from,
        isSwapped,
    });
    const inputAmount = inputValueFrom || 0;
    const tradingFee = divNumbers(multiplyNumbers(inputAmount, 1), 10000);
    const minReceivedAmount = subsctractNumbers(inputAmount, tradingFee);
    const { fetchByOrSell, isLoading, setIsLoading } = useFetchByorSellUSN(wallet.account());
    const predict = usePredict(wallet.account(), inputValueFrom ? inputValueFrom : '1', multipliers, from?.onChainFTMetadata?.symbol, accountId)
    const balance = balanceForError(from);
    const error = balance < +inputValueFrom || !inputValueFrom;
    const slippageError = slippageValue < 0.01 || slippageValue > 99.99;
    // const currentMultiplier = predict?.rate * 10000
    const dispatch = useDispatch()

    const onHandleSwapTokens = useCallback(async (accountId, multiplier, slippageValue, inputValueFrom, symbol, usnAmount) => {
        try {
            setIsLoading(true);
            await fetchByOrSell(accountId, inputValueFrom, symbol, usnAmount);
            setActiveView('success');
        } catch (e) {
            setErrorFromHash(e.message);
            setActiveView('success');
            // dispatch(showCustomAlert({
            //     errorMessage: e.message,
            //     success: false,
            //     messageCodeHeader: 'error',
            // }));
        } finally {
            setIsLoading(false);
            // dispatch(checkAndHideLedgerModal());
        }
    }, []);

    const signIn = () => {
        wallet.requestSignIn({
            contractId: contractId
        })
        .catch(console.error);
    }
    

    return (
        <>
            <div className='wrap'>
               <Loader onRefreshMultiplier={() => {
                    dispatch(fetchMultiplier());
                    dispatch(fetchMultiplierTWAP());
               }}/>
            </div>
            <StyledWrapper>
                <SwapTokenContainer
                fromToToken={from}
                value={inputValueFrom}
                setInputValueFrom={setInputValueFrom}
            />
                <AvailableToSwap
                    isUSN={false}
                    onClick={(balance) => {
                        setInputValueFrom(balance);
                        from?.onChainFTMetadata?.symbol === 'USN' && setUSNAmount(from?.balance);
                    }}
                    balance={from?.balance}
                    symbol={from?.onChainFTMetadata?.symbol}
                    decimals={from?.onChainFTMetadata?.decimals}
                />
                <div
                    className="iconSwapContainer"
                >
                    <div
                        className="iconSwap"
                        onClick={() => {
                            onSwap();
                            setIsSwapped((prev) => !prev);
                        }}
                    >
                        <SwapIconTwoArrows
                            width="23"
                            height="23"
                            color="#FFF"
                        />
                    </div>
                    <div className="iconSwapDivider"/>
                </div>
                <SwapTokenContainer
                fromToToken={to}
                multiplier={multiplier}
                value={inputValueFrom}
                sum={inputValueFrom}
                />
                <AvailableToSwap
                    isUSN={true}
                    onClick={(balance) => {
                        setInputValueFrom(balance);
                        from?.onChainFTMetadata?.symbol === 'USN' && setUSNAmount(from?.balance);
                    }}
                    balance={to?.balance}
                    symbol={to?.onChainFTMetadata?.symbol}
                    decimals={to?.onChainFTMetadata?.decimals}
                />
            </StyledWrapper>
            <SwapInfoContainer
                slippageError={slippageError}
                slippageValue={slippageValue}
                setSlippageValue={setSlippageValue}
                token={from?.onChainFTMetadata?.symbol}
                amount={inputValueFrom}
                // tradingFee={commissionFee?.result}
                // expected={inputValueFrom? predict?.sum : '0'}
                // rate={predict?.rate}
                min={minReceivedAmount}
                tradingFee={tradingFee}
                isLoading={isLoadingCommission}
            />
            <div className="buttons-bottom-buttons">
                <FormButton
                    type="submit"
                    color='dark-gold'
                    disabled={!accountId ? false : error || slippageError || isLoading}
                    data-test-id="sendMoneyPageSubmitAmountButton"
                    onClick={() => accountId
                        ? onHandleSwapTokens(accountId, predict.rateFull, slippageValue, inputValueFrom, from?.onChainFTMetadata?.symbol, usnAmount)
                        : signIn()}
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
