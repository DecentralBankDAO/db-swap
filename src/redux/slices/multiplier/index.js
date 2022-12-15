import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import merge from 'lodash.merge';
import { createSelector } from 'reselect';

import { wallet } from '../../../utils/wallet';
import initialStatusState from '../../reducerStatus/initialState/initialStatusState';

const { REACT_APP_NEAR_ENV } = process.env;
const ACCOUNT_ID_SUFFIX = REACT_APP_NEAR_ENV === 'testnet' ? 'testnet': 'near';


const SLICE_NAME = 'multiplier';

const initialState = {
    ...initialStatusState,
    prices: {},
};

export const fetchMultiplier = createAsyncThunk(
    `${SLICE_NAME}/fetchMultiplier`,
    async function () {
        try {
            const response = await wallet.connection.provider.sendJsonRpc(
                'query',
                {
                    request_type: 'call_function',
                    account_id: `priceoracle.${ACCOUNT_ID_SUFFIX}`,
                    method_name: 'get_price_data',
                    args_base64: btoa(`{"asset_ids": ["wrap.${ACCOUNT_ID_SUFFIX}"]}`),
                    finality: 'final',
                }
            );

            const res = JSON.parse(
                response.result.map((x) => String.fromCharCode(x)).join('')
            );

            return { spot: res.prices[0].price.multiplier / 10000, spotFull:  res.prices[0].price.multiplier, spotDecimals: res.prices[0].price.decimals}
        } catch (error) {
            console.warn('Failed to load ', error);
        }
    }
);

export const fetchMultiplierTWAP = createAsyncThunk(
    `${SLICE_NAME}/fetchMultiplierTWAP`,
    async function () {
        try {
            const response = await wallet.connection.provider.sendJsonRpc(
                'query',
                {
                    request_type: 'call_function',
                    account_id: `priceoracle.${ACCOUNT_ID_SUFFIX}`,
                    method_name: 'get_price_data',
                    args_base64: btoa(`{"asset_ids": ["wrap.${ACCOUNT_ID_SUFFIX}#3600"]}`),
                    finality: 'final',
                }
            );

            const res = JSON.parse(
                response.result.map((x) => String.fromCharCode(x)).join('')
            );
            return { twap: res.prices[0].price.multiplier / 100000000, twapFull:  res.prices[0].price.multiplier, twapDecimals: res.prices[0].price.decimals}
        } catch (error) {
            console.warn('Failed to load ', error);
        }
    }
);

const multiplierSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchMultiplier.fulfilled, (state, action) => {
            merge(state.prices, action.payload);
        })
        .addCase(fetchMultiplierTWAP.fulfilled, (state, action) => {
            merge(state.prices, action.payload);
        });
    },
});

export default multiplierSlice;

export const actions = {
    fetchMultiplier,
    fetchMultiplierTWAP,
    ...fetchMultiplierTWAP.actions,
    ...fetchMultiplier.actions,
};

export const reducer = multiplierSlice.reducer;

const selectmultiplierSlice = (state) => state[SLICE_NAME];

export const selectMultiplier = createSelector(
    selectmultiplierSlice,
    ({ prices }) => prices || {}
);

