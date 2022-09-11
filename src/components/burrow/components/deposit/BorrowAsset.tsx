import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { getAssetDataUSN, getSelectedValues } from '../../../../redux/slices/Burrow/appSelectors'
import { getBorrowMaxAmount } from '../../../../redux/slices/Burrow/Selectors/getBorrowMaxAmount'
import { getWithdrawMaxAmount } from '../../../../redux/slices/Burrow/Selectors/getWithdrowMaxAmount'
import { recomputeHealthFactor } from '../../../../redux/slices/Burrow/Selectors/recomputeHealthFactor'
import { recomputeHealthFactorAdjust } from '../../../../redux/slices/Burrow/Selectors/recomputeHealthFactorAdjust'
import { recomputeHealthFactorRepay } from '../../../../redux/slices/Burrow/Selectors/recomputeHealthFactorRepay'
import { recomputeHealthFactorRepayFromDeposits } from '../../../../redux/slices/Burrow/Selectors/recomputeHealthFactorRepayFromDeposits'
import { recomputeHealthFactorSupply } from '../../../../redux/slices/Burrow/Selectors/recomputeHealthFactorSupply'
import { recomputeHealthFactorWithdraw } from '../../../../redux/slices/Burrow/Selectors/recomputeHealthFactorWithdraw'
import { USD_FORMAT } from '../../../../store'
import { useDegenMode } from '../../hooks/useDegenMode'
import { Alerts, Available, HealthFactor, Rates } from './components'
import Controls from './Controls'
import { getModalData } from './utils'

const BorrowAsset = () => {
    const assetUSN = useSelector(getAssetDataUSN);
    const { borrowAmount, amount } = useSelector(getSelectedValues);

    const { isRepayFromDeposits } = useDegenMode();

    const { action = "Supply", tokenId } = assetUSN;

    const healthFactor = useSelector(
        action === "Withdraw"
            ? recomputeHealthFactorWithdraw(tokenId, borrowAmount)
            : action === "Adjust"
                ? recomputeHealthFactorAdjust(tokenId, borrowAmount)
                : action === "Supply"
                    ? recomputeHealthFactorSupply(tokenId, borrowAmount)
                    : action === "Repay" && isRepayFromDeposits
                        ? recomputeHealthFactorRepayFromDeposits(tokenId, borrowAmount)
                        : action === "Repay"
                            ? recomputeHealthFactorRepay(tokenId, borrowAmount)
                            : recomputeHealthFactor(tokenId, borrowAmount),
    );


    const maxBorrowAmount = useSelector(getBorrowMaxAmount(tokenId));
    const maxWithdrawAmount = useSelector(getWithdrawMaxAmount(tokenId));

    const { price, available, totalTitle, rates, alerts } = getModalData({
        ...assetUSN,
        action: "Borrow",
        maxBorrowAmount,
        maxWithdrawAmount,
        isRepayFromDeposits,
        healthFactor,
        amount: borrowAmount,
    });

    const total = (price * borrowAmount).toLocaleString(undefined, USD_FORMAT);
    const totalAvailable = +amount + Number(available)
    const available$ = (+amount + Number(available)).toLocaleString(undefined, USD_FORMAT);

    return (
        <>
            <Available label="USN to Borrow" totalAvailable={totalAvailable} available$={available$} />
            <Controls amount={borrowAmount} available={totalAvailable} isUSN={true} />
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
            <Alerts data={alerts} />
        </>
    )
}

export default BorrowAsset