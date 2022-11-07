import * as nearApiJs from 'near-api-js';

const { REACT_APP_NEAR_ENV } = process.env;
const NODE_URL = REACT_APP_NEAR_ENV === 'testnet' ? 'https://rpc.testnet.near.org' : 'https://rpc.mainnet.near.org'
const KEY_ACTIVE_ACCOUNT_ID = 'null_wallet_auth_key'
const NETWORK_ID = REACT_APP_NEAR_ENV === 'testnet' ? 'testnet' : 'mainnet'
const contractId  = REACT_APP_NEAR_ENV === 'testnet' ? 'usdn.testnet' : 'usn'

const { connect, WalletConnection, keyStores } = nearApiJs

const config = process.env.REACT_APP_NEAR_ENV === 'mainnet'
    ? {
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.mainnet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
    }
    : {
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
    }
  




class Wallet {
    constructor() {
        this.keyStore = new nearApiJs.keyStores.BrowserLocalStorageKeyStore(window.localStorage, 'near-api-js:keystore:');

        this.inMemorySigner = new nearApiJs.InMemorySigner(this.keyStore);

        const inMemorySigner = this.inMemorySigner;
        this.signer = {
            async getPublicKey(accountId, networkId) {
                return (await inMemorySigner.getPublicKey(accountId, networkId));
            },
            async signMessage(message, accountId, networkId) {
                return inMemorySigner.signMessage(message, accountId, networkId);
            }
        };
        
        this.accountId = JSON.parse(localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID))?.accountId || '';
        this.connection = nearApiJs.Connection.fromConfig({
            ...config,
            networkId: NETWORK_ID,
            keyStore: this.keyStore,
            provider: { type: 'JsonRpcProvider', args: { url: NODE_URL + '/' } },
            // type: 'InMemorySigner',
            signer: this.signer
        });
    }


    getAccountBasic(accountId) {
        return new nearApiJs.Account(this.connection, accountId);
    }

    async getAccount(accountId) {
        accountId = accountId || this.accountId;
        if (!accountId) {
            return false;
        }
        const  account = new nearApiJs.Account(this.connection, accountId);

        return account;
    }

    async getBalance(accountId, limitedAccountData = false) {
        accountId = accountId || this.accountId;
        if (!accountId) {
            return false;
        }

        const account = await this.getAccount(accountId);
        return await account.getAccountBalance(limitedAccountData);
    }

    async requestSignInWallet() {
        console.log('requestSignInWallet');
        const config = process.env.REACT_APP_NEAR_ENV === 'mainnet'
             ? {
                networkId: 'mainnet',
                nodeUrl: 'https://rpc.mainnet.near.org',
                keyStore: new keyStores.BrowserLocalStorageKeyStore(),
                walletUrl: 'https://wallet.mainnet.near.org',
                helperUrl: 'https://helper.mainnet.near.org',
            }
            : {
                networkId: 'testnet',
                nodeUrl: 'https://rpc.testnet.near.org',
                keyStore: new keyStores.BrowserLocalStorageKeyStore(),
                walletUrl: 'https://wallet.testnet.near.org',
                helperUrl: 'https://helper.testnet.near.org',
            };
        const near = await connect(config)
        const wallet = new WalletConnection(near)
        wallet.requestSignIn({
            contractId: contractId
        })
    }
}

export const wallet = new Wallet();
