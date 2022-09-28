import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
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

const Tab = styled(NavLink)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    border-radius: 10px;
    background: "none";
    text-align: center;
    color: "gray";
    font-weight: 700;
    height: 100%;
    cursor: pointer;
    font-size: 18px;
    line-height: 18px;

    :hover {
        text-decoration: none;
    }

    &.active {
        background: #53565c;
        color: #c1b582;
    }
`;

const Tabs = () => {
    return (
        <TabsContainer>
            {["MINT", "BURROW"].map((el) => (
                <Tab
                    key={el}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    to={el === "MINT" ? "/" : "/burrow"}
                >
                    {el}
                </Tab>
            ))}
        </TabsContainer>
    );
};

export default Tabs;
