import { useEffect, useState } from 'react'

import { Box, IconButton, InputAdornment } from '@mui/material';
import { columns as defaultColumns } from "../../tabledata";
import { IoCloseOutline } from "react-icons/io5";
import MicroModal from 'react-micro-modal';
import { TokenInfo } from './components';
import { useAccountId } from '../../hooks/useAccountId';
import { useAvailableAssets } from '../../hooks/useAvailableAssets';
import { useTableSorting } from '../../hooks/useTableSorting';
import { showModal } from '../../../../redux/slices/Burrow/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../Table';
import { usePortfolioAssets } from '../../hooks/usePortfolioAssets';
import { getGlobalAction } from '../../../../redux/slices/Burrow/appSelectors';
import TokenIcon from '../TokenIcon';

export const isMobile = () => {
    return window.screen.width < 1024;
};

export const SelectToken = ({ icon, symbol }) => {
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false);
    const accountId = useAccountId();
    const globalAction = useSelector(getGlobalAction);
    const rows = useAvailableAssets("supply");
    const [suppliedRows, borrowedRows] = usePortfolioAssets();
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
                <InputAdornment position="start">
                    <IconButton aria-label="max value" onClick={() => setVisible(true)}>
                        <Box color='white' fontWeight={600} fontSize="14px" p='6px' bgcolor='#2a2835' borderRadius="8px" display="flex" alignItems="center" gap="5px">
                            <TokenIcon icon={icon} />
                            {symbol}
                        </Box>
                    </IconButton>
                </InputAdornment>
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
                    {globalAction === "Borrow" ?
                        <Table
                            rows={rows}
                            columns={columns}
                            onRowClick={handleOnRowClick}
                            sorting={{ name: "deposit", ...sorting.deposit, setSorting }}
                        /> : globalAction === "Withdraw" && suppliedRows.length ?
                            <Table
                                rows={suppliedRows}
                                columns={columns}
                                onRowClick={handleOnRowClick}
                                sx={{ maxWidth: "800px", width: "none" }}
                                sorting={{ name: "portfolioDeposited", ...sorting.portfolioDeposited, setSorting }}
                            /> : <Table
                                rows={borrowedRows}
                                columns={columns}
                                onRowClick={handleOnRowClick}
                                sx={{ maxWidth: "800px", width: "none" }}
                                sorting={{ name: "portfolioBorrowed", ...sorting.portfolioBorrowed, setSorting }}
                            />
                    }
                </section>
            )}
        </MicroModal>
    );
};