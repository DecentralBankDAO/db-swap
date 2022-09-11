import { useState } from 'react'

import { Box } from '@mui/material';
import { columns as defaultColumns } from "../../tabledata";
import { IoCloseOutline } from "react-icons/io5";
import MicroModal from 'react-micro-modal';
import { TokenInfo } from './components';
import { useAccountId } from '../../hooks/useAccountId';
import { useAvailableAssets } from '../../hooks/useAvailableAssets';
import { useTableSorting } from '../../hooks/useTableSorting';
import { showModal } from '../../../../redux/slices/Burrow/appSlice';
import { useDispatch } from 'react-redux';
import Table from '../Table';

export const isMobile = () => {
    return window.screen.width < 1024;
};

export const SelectToken = ({ apy, asset }) => {
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false);
    const accountId = useAccountId();
    const rows = useAvailableAssets("supply");
    const { sorting, setSorting } = useTableSorting();

    const columns = !accountId
        ? [...defaultColumns.filter((col) => !["supplied", "deposited"].includes(col.dataKey))]
        : [...defaultColumns.filter((col) => col.dataKey !== "totalSupplyMoney")];

    const dialogWidth = isMobile() ? "75%" : "20%";
    const dialogMinwidth = isMobile() ? 340 : 380;
    const dialogHidth = isMobile() ? "70%" : "57%";

    const handleOnRowClick = ({ tokenId }) => {
        dispatch(showModal({ tokenId, amount: 0 }));
        setVisible(false);
    };

    const handleClose = () => {
        setVisible(false);
    };

    return (
        <MicroModal
            open={visible}
            handleClose={handleClose}
            trigger={() => (
                <Box onClick={() => setVisible(true)}>
                    <TokenInfo apy={apy} asset={asset} />
                </Box>
            )}
            overrides={{
                Overlay: {
                    style: {
                        zIndex: 110,
                        backgroundColor: "rgba(0, 19, 32, 0.65)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                    },
                },
                Dialog: {
                    style: {
                        width: dialogWidth,
                        minWidth: dialogMinwidth,
                        borderRadius: "0.75rem",
                        border: "1px solid #C1B582",
                        padding: "1.5rem 0",
                        background: "#1D2932",
                        height: dialogHidth,
                        zIndex: 100,
                    },
                },
            }}
        >
            {() => (
                <section className="text-white">
                    <div className="flex items-center justify-between pb-5 px-8 relative border-b-[1px] border-gray-400">
                        <h2 className="text-sm font-bold text-center text-white">
                            Select Token
                        </h2>
                        <IoCloseOutline
                            onClick={() => handleClose()}
                            className="absolute text-gray-400 text-2xl right-6 cursor-pointer"
                        />
                    </div>
                    <Table
                        rows={rows}
                        columns={columns}
                        onRowClick={handleOnRowClick}
                        sorting={{ name: "deposit", ...sorting.deposit, setSorting }}
                    />
                    {/* {tokensList.map((token) => (
                        <SingleToken
                            onClick={(token) => {
                                onSelectToken(token);
                                handleClose();
                            }}
                            token={token}
                            key={token?.onChainFTMetadata?.symbol}
                        />
                    ))} */}
                </section>
            )}
        </MicroModal>
    );
};