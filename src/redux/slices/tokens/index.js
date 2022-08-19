import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import BN from 'bn.js';
import set from 'lodash.set';
import { createSelector } from 'reselect';

import FungibleTokens from '../../../services/FungibleTokens';
import handleAsyncThunkStatus from '../../reducerStatus/handleAsyncThunkStatus';
import initialStatusState from '../../reducerStatus/initialState/initialStatusState';
import createParameterSelector from '../createParameterSelector';


const { REACT_APP_NEAR_ENV } = process.env;
const currentContractName = REACT_APP_NEAR_ENV === 'testnet' ? 'usdn.testnet': 'usn';
const usdtContractName = REACT_APP_NEAR_ENV === 'testnet' ? 'usdt.fakes.testnet' : 'dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near';
const usdcContractName = REACT_APP_NEAR_ENV === 'testnet' ? 'usdc.fakes.testnet' : 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near';

const SLICE_NAME = 'tokens';

const initialState = {
    ownedTokens: {
        byAccountId: {},
    },
    metadata: {
        byContractName: {},
    },
};

const initialOwnedTokenState = {
    ...initialStatusState,
    balance: '',
};

async function getCachedContractMetadataOrFetch(contractName, state) {
    let contractMetadata = selectOneContractMetadata(state, { contractName });
    if (contractMetadata) {
        return contractMetadata;
    }
    return FungibleTokens.getMetadata({ contractName });
}

const fetchOwnedTokensForContract = createAsyncThunk(
    `${SLICE_NAME}/fetchOwnedTokensForContract`,
    async ({ accountId, contractName }, thunkAPI) => {
        const {
            actions: { addTokensMetadata },
        } = tokensSlice;
        const { dispatch } = thunkAPI;

        const balance = await FungibleTokens.getBalanceOf({
            contractName,
            accountId,
        });

        dispatch(addTokensMetadata({ accountId, contractName, balance }));
    },
    {
        condition: ({ accountId, contractName }, thunkAPI) => {
            const { getState } = thunkAPI;
            if (
                selectOneTokenLoading(getState(), { accountId, contractName })
            ) {
                return false;
            }
        },
    }
);

const fetchTokens = createAsyncThunk(
    `${SLICE_NAME}/fetchTokens`,
    async ({ accountId }, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;

        const likelyContracts = [currentContractName, usdtContractName, usdcContractName]

        await Promise.all(
            likelyContracts.map(async (contractName) => {
                const {
                    actions: { setContractMetadata },
                } = tokensSlice;
                try {
                    const contractMetadata =
                        await getCachedContractMetadataOrFetch(
                            contractName,
                            getState()
                        );
                    if (
                        !selectOneContractMetadata(getState(), {
                            contractName,
                        })
                    ) {
                        dispatch(
                            setContractMetadata({
                                contractName,
                                metadata: contractMetadata,
                            })
                        );
                    }
                    await dispatch(
                        fetchOwnedTokensForContract({
                            accountId,
                            contractName,
                        })
                    );
                } catch (e) {
                    // Continue loading other likely contracts on failures
                    console.warn(`Failed to load FT for ${contractName}`, e);
                }
            })
        );
    }
);

// const fetchToken = createAsyncThunk(
//     `${SLICE_NAME}/fetchToken`,
//     async ({ contractName, accountId }, thunkAPI) => {
//         const { dispatch, getState } = thunkAPI;
//         const {
//             actions: { setContractMetadata },
//         } = tokensSlice;
//         try {
//             const contractMetadata = await getCachedContractMetadataOrFetch(
//                 contractName,
//                 getState()
//             );
//             if (!selectOneContractMetadata(getState(), { contractName })) {
//                 dispatch(
//                     setContractMetadata({
//                         contractName,
//                         metadata: contractMetadata,
//                     })
//                 );
//             }
//             if (accountId) {
//                 await dispatch(
//                     fetchOwnedTokensForContract({ accountId, contractName })
//                 );
//             }
//         } catch (e) {
//             // Continue loading other likely contracts on failures
//             console.warn(`Failed to load FT for ${contractName}`, e);
//         }
//     }
// );

const tokensSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setContractMetadata(state, { payload }) {
            const { metadata, contractName } = payload;
            set(state, ['metadata', 'byContractName', contractName], metadata);
        },
        addTokensMetadata(state, { payload }) {
            const { contractName, balance, accountId } = payload;
            set(
                state,
                [
                    'ownedTokens',
                    'byAccountId',
                    accountId,
                    contractName,
                    'balance',
                ],
                balance
            );
        },
    },
    extraReducers: (builder) => {
        handleAsyncThunkStatus({
            asyncThunk: fetchOwnedTokensForContract,
            buildStatusPath: ({
                meta: {
                    arg: { accountId, contractName },
                },
            }) => ['ownedTokens', 'byAccountId', accountId, contractName],
            builder,
        });
    }
});

export default tokensSlice;

export const actions = {
    fetchTokens,
    ...tokensSlice.actions,
};
export const reducer = tokensSlice.reducer;

const getAccountIdParam = createParameterSelector((params) => params.accountId);

// Top level selectors
const selectTokensSlice = (state) => state[tokensSlice.name];
const selectMetadataSlice = createSelector(
    selectTokensSlice,
    ({ metadata }) => metadata || {}
);
const selectOwnedTokensSlice = createSelector(
    selectTokensSlice,
    ({ ownedTokens }) => ownedTokens
);

// Contract metadata selectors
// Returns contract metadata for every contract in the store, in an object keyed by contractName
export const selectAllContractMetadata = createSelector(
    selectMetadataSlice,
    (metadata) => metadata.byContractName || {}
);

const getContractNameParam = createParameterSelector(
    (params) => params.contractName
);

export const selectOneContractMetadata = createSelector(
    [selectAllContractMetadata, getContractNameParam],
    (metadataByContractName, contractName) =>
        metadataByContractName[contractName]
);

const selectOwnedTokensForAccount = createSelector(
    [selectOwnedTokensSlice, getAccountIdParam],
    (ownedTokens, accountId) => ownedTokens.byAccountId[accountId] || {}
);

export const selectOneTokenFromOwnedTokens = createSelector(
    [selectOwnedTokensForAccount, getContractNameParam],
    (ownedTokensForAccount, contractName) =>
        ownedTokensForAccount[contractName] || initialOwnedTokenState
);

export const selectTokensWithMetadataForAccountId = createSelector(
    [
        selectAllContractMetadata,
        selectOwnedTokensForAccount,
    ],
    (allContractMetadata, ownedTokensForAccount) =>
        Object.entries(ownedTokensForAccount)
            .filter(([contractName, { balance }]) => {
                // We need to see our contract even with zero balance
                if (contractName === currentContractName || contractName === usdtContractName || contractName === usdcContractName) {
                     return true;
                }
                return !new BN(balance).isZero();
            })
            .sort(([a], [b]) =>
                allContractMetadata[a].name.localeCompare(
                    allContractMetadata[b].name
                )
            )
            .map(([contractName, { balance }]) => ({
                ...initialOwnedTokenState,
                contractName,
                balance,
                onChainFTMetadata: allContractMetadata[contractName] || {},
                fiatValueMetadata:
                    contractName === currentContractName ? { usd: 1 } : {},
            }))
);

export const selectTokensLoading = createSelector(
    [selectOwnedTokensSlice, getAccountIdParam],
    (ownedTokens, accountId) =>
        Object.entries(ownedTokens.byAccountId[accountId] || {}).some(
            ([
                _,
                {
                    status: { loading },
                },
            ]) => loading
        )
);

const selectOneTokenLoading = createSelector(
    [selectOneTokenFromOwnedTokens],
    (token) => token.status.loading
);
