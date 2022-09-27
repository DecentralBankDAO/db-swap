import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useFungibleTokensIncludingNEAR } from "../../hooks/fungibleTokensIncludingNEAR";
import {
    fetchMultiplier,
    fetchMultiplierTWAP,
    selectMultiplier,
} from "../../redux/slices/multiplier";
import { fetchNearBalance } from "../../redux/slices/near";
import { actions as tokensActions } from "../../redux/slices/tokens";
import SwapAndSuccessContainer from "./SwapAndSuccessContainer";
import AccountInfo from "../layout/account/AccountInfo";
import { BlockedCountry } from "./BlockedCountry";
import Loader from "../../App/Loader";
import Tabs from "./Tabs";
import { useLocation } from "react-router";
import {
    fetchAssets,
    fetchRefPrices,
} from "../../redux/slices/Burrow/assetsSlice";
import { useNearWallet } from "react-near";
import { fetchAccount } from "../../redux/slices/Burrow/accountSlice";
import { fetchConfig } from "../../redux/slices/Burrow/appSlice";
import Borrow from "../burrow";

const tabsList = ["USDT.e", "NEAR"];
const burrowTabsList = ["MINT", "BURROW"];
const tabs = {
    USDT: "USDT.e",
    NEAR: "NEAR",
};

const burrowTabs = {
    MINT: "MINT",
    BURROW: "BURROW",
};

const nearAndUsn = ["NEAR", "USN"];

const { fetchTokens } = tokensActions;

const SwapContainerWrapper = ({ accountId, isLoading, geoInfo }) => {
    const wallet = useNearWallet();
    const fungibleTokensList = useFungibleTokensIncludingNEAR(accountId);
    const multipliers = useSelector(selectMultiplier);
    const [tab, setTab] = useState(tabs.USDT);
    const [burrowTab, setBurrowTab] = useState(burrowTabs.MINT);
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const transactionHash = params.get("transactionHashes") || "";
    const dispatch = useDispatch();

    const nearAndUsnList = fungibleTokensList.filter((item) => {
        const symbol = item.onChainFTMetadata?.symbol;
        // const selectedToken = token?.onChainFTMetadata?.symbol;
        return nearAndUsn.indexOf(symbol) > -1;
    });

    useEffect(() => {
        if (!accountId) {
            dispatch(fetchMultiplier());
            dispatch(fetchMultiplierTWAP());
            return;
        }
        dispatch(fetchMultiplier());
        dispatch(fetchMultiplierTWAP());
        dispatch(fetchTokens({ accountId }));
        dispatch(fetchNearBalance(accountId));
    }, [accountId]);

    useEffect(() => {
        dispatch(fetchAssets(wallet)).then(() => dispatch(fetchRefPrices()));
        dispatch(fetchAccount(wallet));
        dispatch(fetchConfig(wallet));
    }, []);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : geoInfo ? (
                <BlockedCountry />
            ) : (
                <>
                        <Tabs
                            tab={burrowTab}
                            setTab={setBurrowTab}
                            tabsList={burrowTabsList}
                        />
                    <AccountInfo />
                    {burrowTab === burrowTabs.MINT ? (
                        <>
                            {/* {!transactionHash && (
                                <Tabs
                                    tab={tab}
                                    setTab={setTab}
                                    tabsList={tabsList}
                                />
                            )} */}
                            <SwapAndSuccessContainer
                                transactionHash={transactionHash}
                                fungibleTokensList={fungibleTokensList}
                                accountId={accountId}
                                multipliers={multipliers}
                            />
                            {/* {tab === "USDT.e" ? (
                                <SwapAndSuccessContainer
                                    transactionHash={transactionHash}
                                    fungibleTokensList={fungibleTokensList}
                                    accountId={accountId}
                                    multipliers={multipliers}
                                />
                            ) : (
                                <SwapAndSuccessContainer
                                    transactionHash={transactionHash}
                                    nearAndUsn={true}
                                    fungibleTokensList={nearAndUsnList}
                                    accountId={accountId}
                                    multipliers={multipliers}
                                />
                            )} */}
                        </>
                    ) : (
                        <Borrow />
                    )}
                </>
            )}
        </>
    );
};

export default SwapContainerWrapper;
