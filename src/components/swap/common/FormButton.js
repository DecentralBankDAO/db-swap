import React from 'react';
// import { Translate } from 'react-localize-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import classNames  from '../utils/classNames';

const CustomButton = styled.button`
    &&& {
        color: #fff;
        margin: ${({ swapButton }) => (swapButton ? 0 : '24px 0 0 0')};
        border: 2px solid;
        font-weight: 600;
        height: 56px;
        border-radius: 30px;
        transition: 100ms;
        font-size: 14px;
        word-break: keep-all;
        position: relative;
        z-index: 2;

        :disabled {
            cursor: not-allowed;
        }

        svg {
            width: 16px;
            height: 16px;
            margin: 0 0 -4px 8px;
        }

        &.small {
            width: 110px;
            height: 36px;
            border-radius: 20px;
            padding: 0px 0px;

            font-size: 14px;
        }

        &.black {
            background-color: black;

            :hover {
                background-color: #1f1f1f;
            }
        }

        &.dark-gray {
            background-color: #272729;
            border-color: #272729;

            :hover {
                background-color: black;
            }

            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
                color: #A2A2A8;
            }
        }

        &.dark-gray-light-blue {
            background-color: #37383C;
            border-color: #37383C;
            color: #8EBAF0;

            :hover {
                background-color: black;
            }

            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
                color: #A2A2A8;
            }
        }

        &.gray-gray {
            background-color: #F0F0F1;
            border-color: #F0F0F1;
            color: #3F4045;

            :hover {
                background-color: #ececec;
            }

            :disabled {
                opacity: 0.8;
            }
        }
        &.dark-gold {
            max-width: 490px;
            background-color: #2A2A34;
            border: 2px solid #C1B582;
            color: #C1B583;
            border-radius: 0px;
            margin: 0 auto;
            
            :hover {
                background-color: #C1B583;
                color: black;
            }
        }

        &.dark-gold2 {
            max-width: 500px;
            width: 100%;
            height: 70px;
            background-color: #2A2A34;
            border: 2px solid #C1B582;
            color: #C1B583;
            margin-top: 5px;
            border-radius: 0px;
            margin-left: auto;
            font-family: 'Open Sans', sans-serif;
            font-size: 19px;
            
            :hover {
                background-color: #C1B583;
                color: black;
            }

            @media (max-width: 1025px) {
                height: 40px;
                font-size: 14px;
                margin: 50px auto;
                max-width: ${({ man }) => (man ? '400px' : '500px')};
            }

            @media (max-width: 769px) {
                max-width: ${({ man }) => (man ? '100%' : '500px')};
            }

            @media (max-width:320px) {
                margin: ${({ man }) => (man ? '30px auto' : '50px auto')};
            }
        }

        &.dark-gold-small {
            max-width: 400px;
            width: 100%;
            height: 70px;
            background-color: #2A2A34;
            border: 2px solid #C1B582;
            color: #C1B583;
            margin-top: 5px;
            border-radius: 0px;
            margin-left: auto;
            font-family: 'Open Sans', sans-serif;
            font-size: 19px;
            
            :hover {
                background-color: #C1B583;
                color: black;
            }

            @media (max-width: 1025px) {
                height: 40px;
                font-size: 14px;
                margin: 30px auto;
                max-width: ${({ man }) => (man ? '400px' : '500px')};
            }

            @media (max-width: 769px) {
                max-width: ${({ man }) => (man ? '100%' : '500px')};
            }

            @media (max-width:320px) {
                margin: ${({ man }) => (man ? '30px auto' : '50px auto')};
            }
        }

        &.light-blue {
            background-color: #C1B583;
            border: 0;
            color: #0072CE;
            border-radius: 4px;

            &.small {
                padding: 6px 12px;
                height: auto;
                font-weight: 400 !important;
                font-size: 12px;
            }

            &.rounded {
                border-radius: 50px;
                padding: ${({ swapButton }) => (swapButton ? '6px 12px' : '12px 15px')};
                width: auto;
            }

            :hover {
                color: black;
                background-color: #FEFDEE;
            }

            :disabled {
                background-color: #F0F0F1;
                color: #A2A2A8;
            }
        }

        &.red {
            border-color: #E5484D;
            background: #E5484D;

            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                border-color: #E5484D;
                background: #fff;
                color: #E5484D;
            }
            &.dots {
                color: #fff;
            }
        }
        &.blue {
            border-color: #0072ce;
            background: #0072ce;

            :active,
            :hover,
            :focus {
                border-color: #007fe6;
                background: #007fe6;
            }
            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
                color: #A2A2A8;
            }
        }
        &.seafoam-blue {
            border-color: #6ad1e3;
            background: #6ad1e3;

            :disabled {
                background: #e6e6e6;
                border-color: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
              opacity: 0.8;
            }
        }
        &.seafoam-blue-white {
            border-color: #6ad1e3;
            background: #fff;
            color: #6ad1e3;

            :disabled {
                background: #fff;
                border-color: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
              opacity: 0.8;
            }
        }
        &.green {
            border-color: #5ace84;
            background: #5ace84;


            :disabled {
                border-color: #e6e6e6;
                background: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                border-color: #61de8d;
                background: #61de8d;
            }
        }
        &.green-dark {
            background-color: #00C08B;
            color: #00261C;
            border: 0;
            font-weight: 600 !important;

            :disabled {
                opacity: 0.5;
            }

            &.border {
                color: #008D6A !important;
                background-color: #C8F6E0 !important;
                border: 2px solid #56BC8F !important;
            }
        }
        &.green-white-arrow {
            color: #5ace84;
            border-color: #5ace84;
            background-color: #fff;
            background-repeat: no-repeat;
            background-position: 90% center;
            background-size: 14px 20px;

            :disabled {
                color: e6e6e6;
                border-color: #e6e6e6;
                background: #fff;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                color: #fff;
                border-color: #61de8d;
                background-color: #61de8d;
            }
        }
        &.green-pastel {
            background-color: #4DD5A6;
            color: #00261C;
            border: 0;

            :hover {
                background-color: #49cc9f;
            }
        }
        &.gray-white {
            color: #cccccc;
            border-color: #cccccc;
            background: #fff;

            :disabled {
                border-color: #e6e6e6;
                background: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                color: #fff;
                border-color: #cccccc;
                background: #cccccc;
            }
        }
        &.gray-red {
            color: #FF585D;
            border: none;
            background-color: #F0F0F1;

            :hover,
            :active,
            :focus {
                color: #fff;
                background-color: #FF585D;
            }
        }
        &.gray-blue {
            color: #0072ce;
            border-color: #F0F0F1;
            background: #F0F0F1;

            :disabled {
                border-color: #e6e6e6;
                background: #e6e6e6;
                opacity: 1 !important;
            }
            :active,
            :hover,
            :focus {
                color: #0072ce;
                border-color: #F0F0F1;
                background: #fff;
            }

            &.dark {
                border-color: #EFEFEF;
                background: #EFEFEF;
            }

            &.border {
                background: none;
                border-color: #E6E5E3;
                :hover {
                    border-color: #0072ce;
                }
            }
        }
        &.white-blue {
            background-color: white;
            border: 0;
            color: #0072ce;

            :active,
            :hover,
            :focus {
                color: white;
                background: #0072ce;
            }
        }
        &.link {
            width: auto !important;
            height: auto;
            padding: 0;
            margin: 0;
            border-radius: 0px;
            background: none;
            border: none;
            display: inline;
            color: #C1B583;

            :hover,
            :focus {
                color: #C1B583;
                background-color: transparent;
                text-decoration: underline;
            }

            &.gray {
                color: #72727A;

                :hover,
                :focus {
                    color: #72727A;
                }
            }

            &.light-gray {
                color: #A2A2A8;

                :hover,
                :focus {
                    color: #A2A2A8;
                }
            }

            &.red {
                color: #ff585d;

                :disabled {
                    opacity: 0.8;
                    background: transparent !important;
                }
            }

            &.normal {
                font-weight: 400;
                font-size: 16px;
            }

            &.underline {
                font-weight: 400;
                text-decoration: underline;

                :hover {
                    text-decoration: none;
                }
            }

        }

        &.dots {
            color: #fff;
            border-color: #cccccc;
            background-color: #cccccc;
            cursor: default;

            :active,
            :hover,
            :focus,
            :disabled {
                background: #cccccc;
                border-color: #cccccc;
            }
            :after {
                content: '.';
                animation: dots 1s steps(5, end) infinite;

                @keyframes dots {
                    0%, 20% {
                        color: rgba(0,0,0,0);
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    40% {
                        color: white;
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    60% {
                        text-shadow:
                            .3em 0 0 white,
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    80%, 100% {
                        text-shadow:
                            .3em 0 0 white,
                            .6em 0 0 white;
                    }
                }
            }
        }

        &.link.dots {
            color: #24272a;
            border: 0;
            background-color: transparent;
            text-transform: lowercase;
            text-decoration: none;

            :active,
            :hover,
            :focus,
            :disabled {
                background: transparent;
                border: 0;
            }
            :after {
                content: '.';
                animation: link 1s steps(5, end) infinite;

                @keyframes link {
                    0%, 20% {
                        color: rgba(0,0,0,0);
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    40% {
                        color: #24272a;
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    60% {
                        text-shadow:
                            .3em 0 0 #24272a,
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    80%, 100% {
                        text-shadow:
                            .3em 0 0 #24272a,
                            .6em 0 0 #24272a;
                    }
                }
            }
        }
        &.bold {
            font-weight: 500;
        }
        @media screen and (max-width: 767px) {
            width: 100%;
        }
    }
`;

const FormButton = ({
    children,
    type,
    color = 'blue',
    disabled = false,
    onClick,
    sending = false,
    sendingString,
    size,
    linkTo,
    className,
    id,
    trackingId,
    swapButton,
    man,
    'data-test-id': testId
}) => {
    const navigate = useNavigate()
    return (
    <CustomButton
        swapButton={swapButton}
        man={man}
        type={type}
        id={id}
        className={classNames([color, size, className, {'dots': sending}])}
        disabled={disabled}
        onClick={(e) => {
            onClick && onClick(e);
            linkTo && (linkTo.toLowerCase().startsWith('http') ? window.open(linkTo, '_blank') : navigate(linkTo));
        }}
        tabIndex='3'
        data-test-id={testId}
    >
        {sending
            ? <> {sendingString ? sendingString : 'sending'} </>
            : children
        }
    </CustomButton>
    )
}

;

export default FormButton;
