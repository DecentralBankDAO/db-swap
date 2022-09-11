import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Container from "./common/Container";
import { currentToken } from "./helpers";
import Success from "./views/Success";
import SwapPage from "./views/SwapPage";

import { actions } from "../../redux/slices/tokens";
import { fetchNearBalance } from "../../redux/slices/near";
import { useNearWallet } from "react-near";
import { useLocation, useNavigate } from "react-router";
import { formatNearAmount, formatTokenAmount } from "./formatToken";
import Loader from "../../App/Loader";

const { REACT_APP_NEAR_ENV } = process.env;

const explorerUrl =
    REACT_APP_NEAR_ENV === "testnet"
        ? "https://explorer.testnet.near.org"
        : "https://explorer.mainnet.near.org";

const { fetchTokens } = actions;

export const VIEWS_SWAP = {
    MAIN: "main",
    SUCCESS: "success",
};

const StyledContainer = styled(Container)`
    position: relative;
    .wrap {
        position: absolute;
        height: 60px;
        right: 15px;
        top: -5px;
        @media (max-width: 425px) {
            top: -10px;
        }
    }
    h1 {
        text-align: center;
        margin-bottom: 30px;
    }
    .text {
        margin-bottom: 11px;
        text-align: left;
    }
    .iconSwapContainer {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 50%;
        margin: 20px 0;
        .iconSwap {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            z-index: 1;
            :hover {
                box-shadow: 0px 0px 1px 2px #ffffff;
            }
        }
        .iconSwapDivider {
            width: 100%;
            top: -25px;
            border-bottom: solid 1px #fff;
            position: relative;
            z-index: 0;
        }
        svg {
            /* margin: 2px 0px 2px 10px; */
            z-index: 10;
            cursor: pointer;
            :hover {
                path {
                    fill: #c1b583;
                }
            }
            #left {
                position: absolute;
                z-index: 10;
            }
        }
    }
    .buttons-bottom-buttons {
        margin-top: 30px;
        > button {
            display: block;
            width: 100%;
        }
        .link {
            display: block !important;
            margin: 20px auto !important;
        }
    }
    .text_info_success {
        width: fit-content;
        font-style: normal;
        font-weight: 700;
        font-size: 20px;
        line-height: 28px;
        text-align: center;
        color: #fff;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
        > div {
            width: 100%;
            background: #efefef;
            padding: 5px;
            color: gray;
            font-weight: 400;
        }
    }
`;

const formatDeposit = (method, res) => {
    const amount =
        JSON.parse(atob(res.transaction.actions[0].FunctionCall.args)).amount ||
        0;
    return method === "withdraw"
        ? formatTokenAmount(amount, 18)
        : formatTokenAmount(amount, 6);
};

const formatError = (value) => {
    return JSON.stringify(value);
};

const SwapAndSuccessContainer = ({
    fungibleTokensList,
    accountId,
    multipliers,
    nearAndUsn = false,
    transactionHash
}) => {
    // const [from, setFrom] = useState({ onChainFTMetadata: {symbol: 'USDT'}, balance: '0'});
    // const [to, setTo] = useState({ onChainFTMetadata: {symbol: 'USN'}, balance: '0'});
    const [activeView, setActiveView] = useState(VIEWS_SWAP.MAIN);
    const [textInfo, setTextInfo] = useState({
        receiver: "",
        sender: "",
    });
    const [errorFromHash, setErrorFromHash] = useState("");
    const [deposit, setDeposit] = useState("0");
    const [successValue, setSuccessValue] = useState(0);
    const [loadHash, setLoadHash] = useState(false);
    const wallet = useNearWallet();
    const dispatch = useDispatch();
    const { search } = useLocation();
    // const params = new URLSearchParams(search);
    // const transactionHash = params.get("transactionHashes") || "";
    const navigate = useNavigate();

    const multiplier = 1;
    // useEffect(() => {

    //     if(accountId) {
    //         setFrom(currentToken(fungibleTokensList, from?.onChainFTMetadata?.symbol || 'USDT'));
    //         setTo(currentToken(fungibleTokensList, to?.onChainFTMetadata?.symbol || 'USN'));
    //     }
    // }, [fungibleTokensList]);
  
    useEffect(() => {
        const getHash = async (hash) => {
            try {
                setLoadHash(true);
                const res = await wallet._near.connection.provider.txStatus(
                    hash,
                    wallet.getAccountId()
                );
                setTextInfo({
                    sender: res.transaction.receiver_id,
                    receiver:
                        JSON.parse(
                            atob(res.transaction.actions[0].FunctionCall.args)
                        ).asset_id ||
                        JSON.parse(
                            atob(res.transaction.actions[0].FunctionCall.args)
                        ).receiver_id,
                });
                setDeposit(
                    formatDeposit(
                        res.transaction.actions[0].FunctionCall.method_name,
                        res
                    )
                );
                setLoadHash(false);
                setActiveView("success");
                if (res.status.Failure) {
                    setErrorFromHash(
                        formatError(res.status.Failure?.ActionError)
                    );
                    setActiveView("success");
                }
            } catch (e) {
                console.log("error", e);
                setErrorFromHash(formatError(e.message));
                setActiveView("success");
            } finally {
                setLoadHash(false);
            }
        };

        if (wallet && transactionHash) {
            let hash;
            if (transactionHash.includes(",")) {
                hash = transactionHash.split(",")[1];
            } else {
                hash = transactionHash;
            }
            getHash(hash);
        }
    }, [transactionHash, wallet]);

    const onHandleBackToSwap = useCallback(async () => {
        await dispatch(fetchTokens({ accountId }));
        await dispatch(fetchNearBalance(accountId));
        navigate("/swap");
        setActiveView("main");
    }, []);
    return (
        <>
            {loadHash ? (
                <div style={{ width: 400, height: 400 }} />
            ) : (
                <>
                    <StyledContainer className="small-centered">
                        {activeView === VIEWS_SWAP.MAIN && !transactionHash && (
                            <SwapPage
                                nearAndUsn={nearAndUsn}
                                fungibleTokensList={fungibleTokensList}
                                multipliers={multipliers}
                                setActiveView={setActiveView}
                                setErrorFromHash={setErrorFromHash}
                                accountId={accountId}
                                // from={from}
                                multiplier={multiplier}
                                // to={to}
                                // onSwap={() => {
                                //     setFrom(to);
                                //     setTo(from);
                                //     if (from?.onChainFTMetadata?.symbol === 'USDT') {
                                //         setFrom(accountId
                                //             ? currentToken(fungibleTokensList, 'USN')
                                //             : { onChainFTMetadata: {symbol: 'USN'}, balance: '0'});
                                //         setTo(accountId ? fungibleTokensList[1] : { onChainFTMetadata: {symbol: 'USDT'}, balance: '0'});
                                //     } else {
                                //         setFrom(accountId ? fungibleTokensList[1] : { onChainFTMetadata: {symbol: 'USDT'}, balance: '0'});
                                //         setTo(accountId
                                //             ? currentToken(fungibleTokensList, 'USN')
                                //             : { onChainFTMetadata: {symbol: 'USN'}, balance: '0'});
                                //     }
                                // }}
                            />
                        )}
                        {activeView === VIEWS_SWAP.SUCCESS && !loadHash && (
                            <Success
                                successValue={successValue}
                                errorFromHash={errorFromHash}
                                onClickGoToExplorer={() =>
                                    window.open(
                                        `${explorerUrl}/transactions/${transactionHash.includes(",")? transactionHash.split(",")[1] : transactionHash}`,
                                        "_blank"
                                    )
                                }
                                inputValueFrom={deposit}
                                textInfo={textInfo}
                                handleBackToSwap={async () => {
                                    // setInputValueFrom('');
                                    await onHandleBackToSwap();
                                }}
                            />
                        )}
                    </StyledContainer>
                </>
            )}
        </>
    );
};

export default SwapAndSuccessContainer;
