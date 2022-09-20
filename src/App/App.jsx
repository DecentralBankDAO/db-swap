import React, { FC } from "react";
import { useNearWallet } from "react-near";

import Router from "./Router";
import Loader from "./Loader";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyle from "../styles/GlobalStyle";
import { Navbar } from "../components/navigation/NavBar";

function App() {
    // wait wallet for initialization
    const wallet = useNearWallet();
    if (!wallet) {
        return <Loader />;
    }

    const WithWallet = ({ children }) => {
        // useWhitelisted(true);

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
