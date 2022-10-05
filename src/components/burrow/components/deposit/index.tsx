import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { getGlobalAction } from "../../../../redux/slices/Burrow/appSelectors";

import {
    NotConnected,
    WaitingForData,
    DataError,
} from "./components";
import { getAccountId } from "../../hooks/useAccountId";
import DepositAsset from "./DepositAsset";
import BorrowAsset from "./BorrowAsset";
import { BorrowTabs } from "../Tabs";
import { usePortfolioAssets } from "../../hooks/usePortfolioAssets";
import { useNearWallet } from "react-near";
import { isAssetsFetching, isHasAssets } from "../../../../redux/slices/Burrow/assetsSelectors";
import { getAccountStatus } from "../../../../redux/slices/Burrow/accountSelectors";

const NoAssets = ({ text }: { text: string }) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="rgba(129,126,166,.2)"
            py="10px"
            borderRadius="8px"
            mb="10px"
            color="#bdbdbd"
            minHeight="520px"
            fontWeight={600}
        >
            {text}
        </Box>
    )
}


const Deposit = () => {
    const accountId = useSelector(getAccountId);
    const wallet = useNearWallet();
    const walletAccountId = wallet?.account().accountId;
    const isFetching = useSelector(isAssetsFetching);
    const isFetchingAccount = useSelector(getAccountStatus)
    const globalAction = useSelector(getGlobalAction);
    const hasAssets = useSelector(isHasAssets);

    const [suppliedRows, borrowedRows] = usePortfolioAssets();


    return (
        <Box>
            {!accountId && !walletAccountId
                ? <NotConnected />
                : isFetching && !hasAssets
                    ? <WaitingForData />
                    : !isFetchingAccount && !accountId ? <DataError />
                        : <>
                            <BorrowTabs suppliedRows={suppliedRows} borrowedRows={borrowedRows} />
                            {globalAction === "Repay" && !borrowedRows.length
                                ? <NoAssets text="No assets for Repay yet" />
                                : globalAction === "Withdraw" && !suppliedRows.length
                                    ? <NoAssets text="No assets for Withdraw yet" />
                                    : <>
                                        <DepositAsset />
                                        <Box height="1.5px" bgcolor="gray" width="100%" mb="25px" sx={{ opacity: 0.5 }}></Box>
                                        <BorrowAsset />
                                    </>
                            }
                        </>
            }
        </Box>
    )
}

export default Deposit