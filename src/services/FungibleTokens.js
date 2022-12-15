import BN from 'bn.js';
import * as nearApiJs from 'near-api-js';
import {
    wallet
} from '../utils/wallet';

const {
    transactions: {
        functionCall
    },
    utils: {
        format: {
            parseNearAmount,
            formatNearAmount
        }
    }
} = nearApiJs;

// account creation costs 0.00125 NEAR for storage, 0.00000000003 NEAR for gas
// https://docs.near.org/docs/api/naj-cookbook#wrap-and-unwrap-near
const FT_MINIMUM_STORAGE_BALANCE = parseNearAmount('0.00125');
// FT_MINIMUM_STORAGE_BALANCE: nUSDC, nUSDT require minimum 0.0125 NEAR. Came to this conclusion using trial and error.
export const FT_MINIMUM_STORAGE_BALANCE_LARGE = parseNearAmount('0.0125');
const FT_STORAGE_DEPOSIT_GAS = parseNearAmount('0.00000000003');

// set this to the same value as we use for creating an account and the remainder is refunded
const FT_TRANSFER_GAS = parseNearAmount('0.00000000003');

// contract might require an attached depositof of at least 1 yoctoNear on transfer methods
// "This 1 yoctoNEAR is not enforced by this standard, but is encouraged to do. While ability to receive attached deposit is enforced by this token."
// from: https://github.com/near/NEPs/issues/141
const FT_TRANSFER_DEPOSIT = '1';

// Fungible Token Standard
// https://github.com/near/NEPs/tree/master/specs/Standards/FungibleToken


export default class FungibleTokens {
    // View functions are not signed, so do not require a real account!
    static viewFunctionAccount = wallet.getAccountBasic('dontcare')

    static async getMetadata({ contractName }) {
        return this.viewFunctionAccount.viewFunction(contractName, 'ft_metadata');
    }

    static async getBalanceOf({ contractName, accountId }) {
        return this.viewFunctionAccount.viewFunction(contractName, 'ft_balance_of', { account_id: accountId });
    }
}

export const fungibleTokensService = new FungibleTokens();
