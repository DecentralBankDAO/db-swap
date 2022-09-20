import React from "react";
import styled from "styled-components";
import Container from "./common/Container";

const TabsContainer = styled(Container)`
    padding: 5px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px auto 0 auto;
    border-radius: 16px;
`;

const Tab = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    border-radius: 10px;
    background: ${({ active }) => (active ? "#53565c" : "none")};
    text-align: center;
    color: ${({ active }) => (active ? "#C1B582" : "gray")};
    font-weight: 700;
    height: 100%;
    cursor: pointer;
    font-size: 18px;
    line-height: 18px;
`;

const Tabs = ({ tab, setTab, tabsList, tabs }) => {
    return (
        <TabsContainer>
            {tabsList.map((el) => (
                <Tab key={el} active={tab === el} onClick={() => setTab(el)}>
                    {el}
                </Tab>
            ))}
        </TabsContainer>
    );
};

export default Tabs;
