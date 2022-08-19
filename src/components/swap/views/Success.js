import React from 'react';

import FormButton from '../common/FormButton';
import { divNumbers, multiplyNumbers, subsctractNumbers } from '../formatToken';
import { exchangeRateTranslationFromHash } from '../helpers';
import ImageContainer from '../ImageContainer';
import TextInfoSuccess from '../TextInfoSuccess';

const Success = ({
    inputValueFrom,
    textInfo,
    handleBackToSwap,
    onClickGoToExplorer,
    errorFromHash,
    successValue
}) => {
    const fee = divNumbers(multiplyNumbers(inputValueFrom, 1), 10000);
    const valueTo = parseFloat(subsctractNumbers(inputValueFrom, fee));
  return (
    <>
        <TextInfoSuccess
            errorFromHash={errorFromHash}
            valueFrom={inputValueFrom}
            valueTo={valueTo}
            textInfo={textInfo}
        />
        <div className="buttons-bottom-buttons">
            <FormButton
                type="submit"
                color='dark-gold'
                data-test-id="sendMoneyPageSubmitAmountButton"
                onClick={handleBackToSwap}
            >
                {/* <Translate id="button.backToSwap" /> */}
                <>Back To Swap</>
            </FormButton>
            {!errorFromHash && 
                <FormButton
                onClick={onClickGoToExplorer}
                type="button"
                className="link"
                color='dark-gold'
            >
                <>View on Explorer</>
            </FormButton>
            }
        </div>
    </>      
  );
};

export default Success;