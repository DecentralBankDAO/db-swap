import { Box, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAssetData, getAssetDataUSN, getSelectedValues } from "../../../../redux/slices/Burrow/appSelectors";

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


const Deposit = () => {
    const accountId = useSelector(getAccountId);
    const asset = useSelector(getAssetData);
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
        <Box sx={{ overflowY: "auto" }}>
            {!accountId && <NotConnected />}
            {/* <Available label="Collateral assets" totalAvailable={available} available$={available$} />
            <SelectToken apy={apy} asset={asset} /> */}
            {/* {action === "Supply" && symbol === "USN" && <USNInfo />} */}
            {/* <Controls amount={amount} available={available} action={action} tokenId={tokenId} /> */}
            <DepositAsset />
            <Box height="1.5px" bgcolor="gray" width="100%" mb="25px" sx={{ opacity: 0.5 }}></Box>
            <BorrowAsset />
            {/* <Available label="USN to Borrow" totalAvailable={available} available$={available$} />
            <Controls amount={0} available={available} isUSN={true} />
            <Stack
                boxShadow="0px 5px 15px rgba(0, 0, 0, 0.1)"
                borderRadius={1}
                mt="2rem"
                p={2}
                gap={0.5}
                bgcolor="rgba(129,126,166,.2)"
            >
                <Typography fontWeight="400" mb="1rem" color="#bdbdbd">
                    Details
                </Typography>
                <HealthFactor value={healthFactor} />
                <Box display="flex" justifyContent="space-between">
                    <Typography fontSize="0.85rem" color="#bdbdbd">
                        <span>{totalTitle}</span>
                    </Typography>
                    <Typography fontSize="0.85rem" fontWeight="500" color="#bdbdbd">
                        {total}
                    </Typography>
                </Box>
                <Rates rates={rates} />
            </Stack>
            <Alerts data={alerts} /> */}
            {/* <Action maxBorrowAmount={maxBorrowAmount} healthFactor={healthFactor} /> */}
        </Box>
    )
}

export default Deposit