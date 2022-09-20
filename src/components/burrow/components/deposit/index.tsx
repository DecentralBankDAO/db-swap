import { Box, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAssetData, getAssetDataUSN, getGlobalAction, getSelectedValues } from "../../../../redux/slices/Burrow/appSelectors";

import {
    NotConnected,
    CloseButton,
    TokenInfo,
    Available,
    HealthFactor,
    Rates,
    Alerts,
    USNInfo,
} from "./components";

import { getBorrowMaxAmount } from "../../../../redux/slices/Burrow/Selectors/getBorrowMaxAmount";
import { getWithdrawMaxAmount } from "../../../../redux/slices/Burrow/Selectors/getWithdrowMaxAmount";
import { recomputeHealthFactor } from "../../../../redux/slices/Burrow/Selectors/recomputeHealthFactor";
import { recomputeHealthFactorAdjust } from "../../../../redux/slices/Burrow/Selectors/recomputeHealthFactorAdjust";
import { recomputeHealthFactorRepay } from "../../../../redux/slices/Burrow/Selectors/recomputeHealthFactorRepay";
import { recomputeHealthFactorRepayFromDeposits } from "../../../../redux/slices/Burrow/Selectors/recomputeHealthFactorRepayFromDeposits";
import { recomputeHealthFactorSupply } from "../../../../redux/slices/Burrow/Selectors/recomputeHealthFactorSupply";
import { recomputeHealthFactorWithdraw } from "../../../../redux/slices/Burrow/Selectors/recomputeHealthFactorWithdraw";
import { USD_FORMAT } from "../../../../store";
import { getAccountId } from "../../hooks/useAccountId";
import { useDegenMode } from "../../hooks/useDegenMode";
import { getModalData } from "./utils";
import Controls from "./Controls";
import { SelectToken } from "./SelectToken";
import DepositAsset from "./DepositAsset";
import BorrowAsset from "./BorrowAsset";
import { BorrowTabs } from "../Tabs";
import { usePortfolioAssets } from "../../hooks/usePortfolioAssets";

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
    const asset = useSelector(getAssetData);
    const globalAction = useSelector(getGlobalAction);
    const [suppliedRows, borrowedRows] = usePortfolioAssets();
    // const assetUSN = useSelector(getAssetDataUSN);

    // const { amount } = useSelector(getSelectedValues);
    // const dispatch = useDispatch();
    // const { isRepayFromDeposits } = useDegenMode();

    // const { action = "Supply", tokenId } = asset;

    // const healthFactor = useSelector(
    //     action === "Withdraw"
    //         ? recomputeHealthFactorWithdraw(tokenId, amount)
    //         : action === "Adjust"
    //             ? recomputeHealthFactorAdjust(tokenId, amount)
    //             : action === "Supply"
    //                 ? recomputeHealthFactorSupply(tokenId, amount)
    //                 : action === "Repay" && isRepayFromDeposits
    //                     ? recomputeHealthFactorRepayFromDeposits(tokenId, amount)
    //                     : action === "Repay"
    //                         ? recomputeHealthFactorRepay(tokenId, amount)
    //                         : recomputeHealthFactor(tokenId, amount),
    // );

    // const maxBorrowAmount = useSelector(getBorrowMaxAmount(tokenId));
    // const maxWithdrawAmount = useSelector(getWithdrawMaxAmount(tokenId));

    // const { symbol, apy, price, available, available$, totalTitle, rates, alerts } = getModalData({
    //     ...asset,
    //     // maxBorrowAmount,
    //     // maxWithdrawAmount,
    //     isRepayFromDeposits,
    //     healthFactor,
    //     amount,
    // });

    // const total = (price * amount).toLocaleString(undefined, USD_FORMAT);

    // console.log('assetUSN', assetUSN);

    return (
        <Box>
            {!accountId && <NotConnected />}
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
        </Box>
    )
}

export default Deposit