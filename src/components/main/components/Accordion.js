import React, { useState } from 'react'
import styled from 'styled-components'
import { AccordionItem } from './AccordionItem'

const accordionData = [
    {
        title: 'What is $USN?',
        content: `
            <p>$USN is a NEAR-native stablecoin that can adapt to both bull and bear market conditions, with different mechanisms depending on its phase. Currently we are at phase I and $USN is 1:1 collateralized by $USDT, although other battle-tested stablecoins such as $USDC or $DAI will be added in the future. As the market recovers $USN might transition to phase II, and it will be also backed by non-stable assets such as $NEAR, $BTC or $ETH.</p>
            <br/>
            <p>Besides, $USN generates a sustainable yield that comes from native NEAR staking rewards. Combining the security of $USDT, the decentralization of $FRAX and the yield opportunities, $USN is positioned to be one of the most effective ways to bootstrap liquidity in the NEAR ecosystem; all while adding a new layer of composability to $NEAR. $USN’s smart contracts and Reserve Fund are managed by the Decentral Bank DAO.</>
        `
    },
    {
        title: 'What is Decentral Bank?',
        content: `
            <p>Decentral Bank is the DAO developing and supporting $USN, the NEAR-native stablecoins. Decentral Bank DAO manages the smart contracts of $USN and its Reserve Fund. The DAO votes on the different aspects and decisions around $USN, such as, but not limited to:</p>
            <br/>
            <ul>
                <li>&nbsp;<b>•</b> The addition of new stablecoins to the Reserve Fund, such as $USDC or $DAI</li>
                <li>&nbsp;<b>•</b> The transition from <i>Phase I</i> to <i>Phase II</i> or vice versa</li>
                <li>&nbsp;<b>•</b> How the $NEAR staking rewards are distributed</li>
                <li>&nbsp;<b>•</b> The development of new products</li>
                <li>&nbsp;<b>•</b> Any other governance decision</li>
            </ul>
        `
    },
    {
        title: 'How can I enjoy the yield from $USN?',
        content: `$USN will be used in all major $NEAR and $AURORA dApps and each of them will offer their own yield opportunities. However, given the importance of building liquidity, at the beginning $USN rewards will be distributed to liquidity pools in AMMs such as Ref Finance and Trisolaris. Later, you could also enjoy $USN rewards on Money Market protocols such as Burrow, Bastion or Aurigamy, and in orderbooks such as Orderly, Spin or Tonic. Finally, $USN will be integrated across the whole NEAR ecosystem.
        `
    },
    {
        content: `
            <p>$USN’s peg to the US Dollar is secured through a 1:1 backing with $USDT. The main on-chain contract mechanism always allows users to mint 1 $USN for 1 $USDT and redeem 1 $USN for 1 $USDT.</p>
            </br>
            <p>The peg can be controlled via arbitrage opportunities. $USN is freely traded on the open market in decentralized protocols such as Ref Finance and Trisolaris and soon in CEXes. Therefore:</p>
            </br>
            <ul>
                <li>&nbsp;<b>•</b> If $USN trades below $1.00, then users can buy 1 $USN in the market for $0.99 and redeem it for 1 $USDT via the main on-chain mechanism, profiting 0.01 $USDT.</li>
                <li>&nbsp;<b>•</b> If $USN trades above $1.00, then users can mint 1 $USN via the on-chain mechanism with 1 $USDT and then sell it in the open market for 1.01 $USDT, profiting 0.01 $USDT.</li>
            </ul>
            </br>
            <p>In the future, $USN can be supported by a tri- or quadri-pool of stablecoins as new assets are added to the Reserves.</p>
        `,
        title: 'How does $USN maintain its peg?'
    },
    {
        title: 'How can I get, exchange or trade $USN?',
        content: `
            1. $USN can be minted through the main on-chain contract mechanism that mints / redeems $USN with $USDT via:
            <br/>
            &nbsp;&nbsp;&nbsp;a. Decentral Bank’s swap tool (coming soon!)
            <br/>
            &nbsp;&nbsp;&nbsp;b. Ref Finance minting feature (coming soon!)
            <br/>
            &nbsp;&nbsp;&nbsp;c. Sender Wallet (coming soon!)
            <br/>
            2. $USN can be freely traded on DEXes:
            <br/>
            &nbsp;&nbsp;&nbsp;a. Ref Finance on $NEAR [<a href="https://app.ref.finance/">https://app.ref.finance/</a>]
            <br/>
            &nbsp;&nbsp;&nbsp;b. Trisolaris on $AURORA [<a href="https://www.trisolaris.io/">https://www.trisolaris.io/</a>]
            <br/>
            3. Soon, $USN will be available on CEXes as well
            <br/>
            4. $USN will also be available to make payments on off-chain applications and real-world commerce. Please see roadmap for more details
            `
    },
    {
        title: 'What does $USN v2.0 compare to $USN v1.0 and what is the difference between Phase I and Phase II?',
        p1: `
            Please see the informative table below:
        `,
        p2: '*Other battle-tested stablecoins such as USDC or DAI might be included in the near future apart from USDT'
    },
    {
        title: 'How Does $USN compare to other stablecoins?',
        content: `<p>
            The main difference between $USN and the rest of stablecoins is that its design is flexible and not fixed, allowing $USN to adapt to different market conditions. Decentral Bank’s goal has been to create a stablecoin that is the closest to being truly stable; one that can thrive in a bull run and withstand a prolonged bear market.
        </p>
        </br>
        <p>
            Under the current design, $USN offers a truly reliable solution since it is 1:1 backed with $USDT while generating rewards via $NEAR staking. The combination of security and yield opportunity makes it a very attractive option for a bear market.
        </p>
        </br>
        <p>
            Also, no other stablecoin has seen a whole ecosystem built around itself. $USN will be integrated in all major $NEAR and $AURORA dApps and the users will enjoy a seamless experience that hasn’t been yet possible in other blockchains. $NEAR sharding technology makes $USN fast, secure, truly interoperable and composable between shards/chains. $USN will also unlock the potential that exists between connecting the on-chain with the off-chain world.
        </p>
        `
    },
    {
        title: 'Who will integrate $USN?',
        content: 'Every major dApp in the $NEAR and $AURORA ecosystem will integrate $USN to seize the yield opportunities it generates and its easy and fast transaction settlements: DEXes, Money markets, Orderbooks, fiat on/off-ramps and new applications that will be built specifically around $USN.'
    },
    {
        title: 'What makes $USN interesting?',
        content: `
            $USN stands out for several reasons:
            </br>
            </br>
            <ul>
                <li>&nbsp;&nbsp;<b>•</b> Safe and design, as it is 1:1 backed by a basket of battle-tested stablecoins, making $USN thrive at stability</li>
                <li>&nbsp;&nbsp;<b>•</b> The generation of a native yield thanks to NEAR staking rewards</li>
                <li>&nbsp;&nbsp;<b>•</b> Extra yield due to third party DeFi protocols: protocol incentives, added revenue due to borrowing costs, etc</li>
                <li>&nbsp;&nbsp;<b>•</b> Seamless integration of $USN across the whole $NEAR and $AURORA ecosystems, which makes $USN a comfortable method of exchange and use of any major DeFi or infrastructure protocol</li>
                <li>&nbsp;&nbsp;<b>•</b> $USN is the only stablecoin that offers a truly composable cross-chain interoperability between different chains thanks to the sharding design of $NEAR. This means that $USN transactions can be executed on L2 solutions such as Aurora or any other shard without the user directly interacting with these other shards.</li>
                <li>&nbsp;&nbsp;<b>•</b> $USN will become backbone of transitions in $NEAR</li>
                <li>&nbsp;&nbsp;<b>•</b> Cheap and fast cross-border transactions leveraging NEAR Protocol’s infrastructure</li>
                <li>&nbsp;&nbsp;<b>•</b> Ease of access: directly mint $USN through the web wallets using $USDT</li>
            </ul>
        `
    },
    {
        title: 'What is the roadmap for $USN?',
        content: `
            <ul>
                <li>&nbsp;&nbsp;<b>•</b> Public dashboard</li>
                <li>&nbsp;&nbsp;<b>•</b> v2.0 Whitepaper</li>
                <li>&nbsp;&nbsp;<b>•</b> $USN integration on all major NEAR and Aurora dApps</li>
                <li>&nbsp;&nbsp;<b>•</b> $USN integration on CEXes</li>
                <li>&nbsp;&nbsp;<b>•</b> Fiat on/off ramps</li>
                <li>&nbsp;&nbsp;<b>•</b> Off-chain loans</li>
                <li>&nbsp;&nbsp;<b>•</b> Micro loans, financing, and credit lines</li>
                <li>&nbsp;&nbsp;<b>•</b> Payment in real-world commerces including subscription models</li>
                <li>&nbsp;&nbsp;<b>•</b> Protocol level integration: option to pay for gas on NEAR with $USN for $USN transactions</li>
                <li>&nbsp;&nbsp;<b>•</b> Multichain expansion</li>
            </ul>
        `
    }
    // {
    //     title: 'Where can I learn more about $USN and Decentral Bank?',
    //     content: `<a href="https://drive.google.com/file/d/1RbpAYx7K7CsinQKbD9a1I3r9d5zwivm3/view?usp=sharing" target="_blank">Whitepaper</a>
    //     <a href="https://github.com/orgs/DecentralBankDAO" target="_blank">Github</a>
    //     <a href="https://medium.com/@dcntrlbank" target="_blank">Medium</a>
    //     <a href="https://twitter.com/DcntrlBank" target="_blank">Twitter</a>
    //     <a href="https://discord.gg/TNtCNTDr" target="_blank">Discord</a>
    //     `
    // }
]

const AccordionWrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: #FEFDEE;
    padding: 90px 196px 90px 140px;
    z-index: 2;

    @media (max-width: 769px) {
        padding: 20px;
    }

    h1 {
        position: relative;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 500;
        line-height: 60px;
        font-size: 80px;
        color: rgba(42, 43, 53, 1);
        text-align: center;
        margin-bottom: 70px;
    }

    .accordion_item {
        width: 100%;  
        border-top: 1px solid #999;
        box-sizing: border-box;
        /* max-height: 75px; */
        overflow: hidden;
        transition: all 0.3s ease-out;
        position: relative;

        /* &.active {
            border-bottom: 1px solid #999;
            max-height: 1000px;
        } */
        
        p {
            font-family: 'Open Sans';
            font-size: 21px;
            line-height: 1.45;
            color: black;

            @media (max-width: 769px) {
                font-size: 16px;
            }
        }
        .accordion_title {
            position: relative;
            padding: 12px 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'Open Sans';
            cursor: pointer;
            font-size: 34px;
            color: black;

            @media (max-width: 769px) {
                font-size: 20px;
            }
        }
        
        .accordion_content {
            position: relative;
            padding: 0;
            transition: all 0.2s ease-in-out;
            font-family: 'Open Sans';
            font-size: 21px;
            line-height: 1.45;
            color: black;
            height: 0;
            overflow: hidden;
            border-bottom: 1px solid #999;

            @media (max-width: 769px) {
                font-size: 16px;
               
            }
        }

        .accordion_content.open {
            height: auto;
            padding: 12px 8px;
        }
    }
`



export function Accordion() {
    const [isActive, setIsActive] = useState('0')

    const onToggle = (index) => {
        if(isActive === index) {
            return setIsActive('0')
        } 
        setIsActive(index)
    }
  return (
      <AccordionWrapper>
        <h1>FAQ</h1>
        {accordionData.map(({ title, content, p1, p2}, i) => (
            <AccordionItem key={title} title={title} content={content} p1={p1} p2={p2} isActive={isActive === i} onToggle={() => onToggle(i)} />
        ))}
      </AccordionWrapper>
  )
}
