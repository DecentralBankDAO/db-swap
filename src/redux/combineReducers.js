import { combineReducers } from 'redux';

import tokensSlice from './slices/tokens';
import nearBalanceSlice from './slices/near'
import multiplierSlice from './slices/multiplier'
import assetsSlice from './slices/Burrow/assetsSlice';
import accountSlice from './slices/Burrow/accountSlice';
import appSlice from './slices/Burrow/appSlice';



export default () => combineReducers({
    [tokensSlice.name]: tokensSlice.reducer,
    [nearBalanceSlice.name]: nearBalanceSlice.reducer,
    [multiplierSlice.name]: multiplierSlice.reducer,
    [assetsSlice.name]: assetsSlice.reducer,
    [accountSlice.name]: accountSlice.reducer,
    [appSlice.name]: appSlice.reducer
});
