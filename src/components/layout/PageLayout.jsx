import styled from "styled-components";
import bg from "../../assets/svg/bg.svg";
import { Footer } from "../main/components/Footer";
import Tabs from "../swap/Tabs";
import AccountInfo from "./account/AccountInfo";

const Wrapper = styled.div`
    width: 100%;
    background-color: #fefdee;
    background-image: url(${bg});
    background-size: cover;

    main {
        margin-bottom: 30px;
    }

    @media (max-width: 1440px) {
        background-size: ${({ isUSA }) => (isUSA ? "cover" : "contain")};
    }

    @media (max-width: 768px) {
        background-size: contain;
        main {
            margin-top: 55px;
            padding-bottom: 30px;
            margin-bottom: 0;
        }
    }

    @media (max-width: 425px) {
        height: ${({ isUSA }) => (isUSA ? "100vh" : "")};
    }
`;

const PageLayout = ({ children }) => {
    return (
        <Wrapper>
            <div className="flex flex-col h-full">
                <main className="flex-1 h-max container p-2 mx-auto">
                    <Tabs />
                    <AccountInfo />
                    {children}
                </main>
                <Footer />
            </div>
        </Wrapper>
    );
};

export default PageLayout;
