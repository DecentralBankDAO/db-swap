import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useFungibleTokensIncludingNEAR } from '../../hooks/fungibleTokensIncludingNEAR';
import { fetchMultiplier, fetchMultiplierTWAP, selectMultiplier } from '../../redux/slices/multiplier';
import { fetchNearBalance } from '../../redux/slices/near';
import { actions as tokensActions } from '../../redux/slices/tokens';
import { userCountry } from './utils/isBlocedCountry'
import SwapAndSuccessContainer from './SwapAndSuccessContainer';
import AccountInfo from '../layout/account/AccountInfo';
import { BlockedCountry } from './BlockedCountry';

const { fetchTokens } = tokensActions;

const SwapContainerWrapper = ({ accountId }) => {
    const fungibleTokensList = useFungibleTokensIncludingNEAR(accountId);
    const multipliers = useSelector(selectMultiplier);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!accountId) {
            dispatch(fetchMultiplier());
            dispatch(fetchMultiplierTWAP());
            return;
        }
        dispatch(fetchMultiplier());
        dispatch(fetchMultiplierTWAP());
        dispatch(fetchTokens({ accountId }));
        dispatch(fetchNearBalance(accountId))

    }, [accountId]);

    return (
        <>
          {userCountry() 
            ? <BlockedCountry/> 
            : <>
                <AccountInfo/>
                <SwapAndSuccessContainer
                fungibleTokensList={fungibleTokensList}
                accountId={accountId}
                multipliers={multipliers}
                />
            </>
            } 
        </>
    );
};

export default SwapContainerWrapper;
