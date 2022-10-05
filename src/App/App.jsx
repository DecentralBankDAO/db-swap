import { useEffect } from "react";
import { useNearWallet } from "react-near";

import Router from "./Router";
import Loader from "./Loader";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyle from "../styles/GlobalStyle";
import { useIdle, useInterval } from "react-use";
import { Navbar } from "../components/navigation/NavBar";
import {
    fetchAssets,
    fetchRefPrices,
} from "../redux/slices/Burrow/assetsSlice";
import { useDispatch } from "react-redux";
import { actions as tokensActions } from "../redux/slices/tokens";
import { fetchAccount } from "../redux/slices/Burrow/accountSlice";
import { fetchConfig } from "../redux/slices/Burrow/appSlice";
import { useCountryAPI } from "../components/swap/utils/isBlocedCountry";
import { BlockedCountry } from "../components/swap/BlockedCountry";
import { fetchNearBalance } from "../redux/slices/near";

const { fetchTokens } = tokensActions;
const IDLE_INTERVAL = 5e3;
const REFETCH_INTERVAL = 30e3;

function App() {
    // wait wallet for initialization
    const wallet = useNearWallet();
    const { isLoading, geoInfo } = useCountryAPI();
    if (!wallet || isLoading) {
        return <Loader />;
    }

    if (geoInfo) {
        return <BlockedCountry />;
    }

    const WithWallet = ({ children }) => {
        const dispatch = useDispatch();
        const { accountId } = wallet.account();
        const isIdle = useIdle(IDLE_INTERVAL);

        const fetchData = () => {
            dispatch(fetchAssets(wallet)).then(() =>
                dispatch(fetchRefPrices())
            );
            dispatch(fetchAccount(wallet));
        };

        useEffect(() => {
            dispatch(fetchTokens({ accountId }));
            dispatch(fetchNearBalance(accountId));
            dispatch(fetchConfig(wallet));
        }, []);

        useEffect(fetchData, []);
        useInterval(fetchData, isIdle ? REFETCH_INTERVAL : null);

        return <>{children}</>;
    };

    return (
        <WithWallet>
            <GlobalStyle />
            {/* <Navbar /> */}
            <Router />
            <ToastContainer />
        </WithWallet>
    );
}

export default App;
