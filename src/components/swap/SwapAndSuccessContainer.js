import styled from "styled-components";
import Container from "./common/Container";

import SwapPage from "./views/SwapPage";

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

const SwapAndSuccessContainer = ({
    fungibleTokensList,
    accountId,
    multipliers,
    nearAndUsn = false,
}) => {
    return (
        <>
            <StyledContainer className="small-centered">
                <SwapPage
                    nearAndUsn={nearAndUsn}
                    fungibleTokensList={fungibleTokensList}
                    multipliers={multipliers}
                    accountId={accountId}
                />
            </StyledContainer>
        </>

        // </>
    );
};

export default SwapAndSuccessContainer;
