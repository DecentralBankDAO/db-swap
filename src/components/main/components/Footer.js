import React from 'react'
import styled from 'styled-components'
import { Discord } from '../../../assets/svg/Discord'
import { Email } from '../../../assets/svg/Email'
import { Git } from '../../../assets/svg/Git'
import { Medium } from '../../../assets/svg/Medium'
import { Twitter } from '../../../assets/svg/Twitter'
import { Wrapper } from './mainText'

const FooterWrapper = styled(Wrapper)`
    background-color: #EEF1EC;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0;

    @media (max-width: 1025px) {
        flex-direction: column;
        /* padding: 150px 196px 90px 140px; */
    }

    span {
        color: rgba(42, 43, 53, 1);
        font-family: 'Inter';
        font-weight: 400;
        font-style: normal;
        font-size: 24px;
        line-height: 26px;

        @media (max-width: 1440px) {
          font-size: 20px;
        }
    }

    a {
        color: rgba(42, 43, 53, 1);
        font-family: 'Inter';
        font-weight: 400;
        font-style: normal;
        font-size: 24px;
        line-height: 26px;
        text-decoration: underline;

        @media (max-width: 1440px) {
          font-size: 20px;
        }

        @media (max-width: 1025px) {
          margin: 50px 0px;
        }
    }

    .icons2 {
        max-width: 770px;
        width: 100%;
        display: flex;
        /* margin-top: 50px; */
        align-items: center;

        @media (max-width: 1025px) {
            flex-direction: column-reverse;
        }

        .first_group {
            max-width: 100%;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
              color: rgba(42, 43, 53, 1);
              font-family: 'Inter';
              font-weight: 400;
              font-style: normal;
              font-size: 24px;
              line-height: 26px;   

              @media (max-width: 1440px) {
                font-size: 20px;
              }
              
              @media (max-width: 1025px) {
                  display: none;
              }
            }

            @media (max-width: 1025px) {
                max-width: 100%;
            }
        }

        .second_group {
            margin-right: 41px;
            max-width: 221px;
            width: 100%;
            display: flex;
            justify-content: space-between;

            @media (max-width: 1440px) {
                max-width: 200px;
            }

            @media (max-width: 1025px) {
                max-width: 100%;
                justify-content: space-around;
                margin-top: 20px;
                margin: 30px auto 20px auto;
            }
        }
    }
` 

export function Footer() {
  return (
    <FooterWrapper>
        <span>© 2022 Decentral Bank.</span>
        <a target="_blank" href="https://docs.google.com/document/d/1PHN73Y3ejtTCaHHjNJhm2DBqsslBr1XYW5SIRtB9jsw/edit">Terms and Conditions</a>
        <div className='icons2'>
                <div className='second_group'>
                    <Twitter onClick={() => window.open('https://twitter.com/DcntrlBank', '_blank')}/>
                    <Git onClick={() => window.open('https://github.com/orgs/DecentralBankDAO', '_blank')}/>
                </div>
                <div className='first_group'>
                    <Discord onClick={() => window.open('https://discord.gg/decentralbank', '_blank')}/> 
                    <Medium onClick={() => window.open('https://medium.com/@dcntrlbank', '_blank')}/> 
                    <span>Contact  us</span>
                    <Email  onClick={() => window.location.href = 'mailto:dcntrlbankdao@gmail.com'}/>
                </div>
        </div>
    </FooterWrapper>
  )
}

