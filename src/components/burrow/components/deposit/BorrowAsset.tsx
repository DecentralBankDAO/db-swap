import { Box, Stack, Typography } from '@mui/material'
import Decimal from 'decimal.js'
import { useSelector } from 'react-redux'
import { getAssetData, getAssetDataUSN, getGlobalAction, getSelectedValues } from '../../../../redux/slices/Burrow/appSelectors'
import { getBorrowMaxAmount } from '../../../../redux/slices/Burrow/Selectors/getBorrowMaxAmount'
import { getTotalAccountBalance } from '../../../../redux/slices/Burrow/Selectors/getTotalAccountBalance'
import { getWithdrawMaxAmount } from '../../../../redux/slices/Burrow/Selectors/getWithdrowMaxAmount'
import { recomputeHealthFactor } from '../../../../redux/slices/Burrow/Selectors/recomputeHealthFactor'
import { recomputeHealthFactorAdjust } from '../../../../redux/slices/Burrow/Selectors/recomputeHealthFactorAdjust'
import { recomputeHealthFactorRepay } from '../../../../redux/slices/Burrow/Selectors/recomputeHealthFactorRepay'
import { recomputeHealthFactorRepayFromDeposits } from '../../../../redux/slices/Burrow/Selectors/recomputeHealthFactorRepayFromDeposits'
import { recomputeHealthFactorSupply } from '../../../../redux/slices/Burrow/Selectors/recomputeHealthFactorSupply'
import { recomputeHealthFactorWithdraw } from '../../../../redux/slices/Burrow/Selectors/recomputeHealthFactorWithdraw'
import { USD_FORMAT } from '../../../../store'
import { useDegenMode } from '../../hooks/useDegenMode'
import ActionBtn from '../ActionBtn'
import { Alerts, Available, HealthFactor, Rates } from './components'
import Controls from './Controls'
import { getModalData } from './utils'

const BorrowAsset = () => {
    const assetUSN = useSelector(getAssetDataUSN);
    const asset = useSelector(getAssetData);
    const globalAction = useSelector(getGlobalAction);
    const { borrowAmount, amount } = useSelector(getSelectedValues);
    const userBorrowed = useSelector(getTotalAccountBalance("borrowed"));

    const { isRepayFromDeposits } = useDegenMode();
    const { tokenId: asssetTokenId } = asset;
    const { tokenId } = assetUSN;

    const healthFactor = useSelector(
        globalAction === "Withdraw"
            ? recomputeHealthFactorWithdraw(asssetTokenId, amount)
            : globalAction === "Adjust"
                ? recomputeHealthFactorAdjust(tokenId, borrowAmount)
                : globalAction === "Supply"
                    ? recomputeHealthFactorSupply(tokenId, borrowAmount)
                    : globalAction === "Repay" && isRepayFromDeposits
                        ? recomputeHealthFactorRepayFromDeposits(tokenId, borrowAmount)
                        : globalAction === "Repay"
                            ? recomputeHealthFactorRepay(asssetTokenId, amount)
                            : recomputeHealthFactor(tokenId, borrowAmount),
    );


    const maxBorrowAmount = useSelector(getBorrowMaxAmount(asssetTokenId, tokenId));
    const maxWithdrawAmount = useSelector(getWithdrawMaxAmount(tokenId));


    const currentAsset = globalAction === "Borrow" ? assetUSN : asset;

    const { price, totalTitle, rates, alerts } = getModalData({
        ...currentAsset,
        action: globalAction,
        maxBorrowAmount,
        maxWithdrawAmount,
        isRepayFromDeposits,
        healthFactor,
        amount: globalAction === "Borrow" ? borrowAmount : amount,
    });

    const total = (price * (globalAction === "Borrow"
        ? borrowAmount
        : amount) + userBorrowed).toLocaleString(undefined, USD_FORMAT);


    const available$ = Number(maxBorrowAmount).toLocaleString(undefined, USD_FORMAT);

    return (
        <>
            {globalAction === "Borrow" &&
                <>
                    <Available label="USN to Borrow" totalAvailable={maxBorrowAmount} available$={available$} />
                    <Controls amount={borrowAmount} available={maxBorrowAmount} isUSN={true} />
                </>
            }
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
            <ActionBtn maxBorrowAmount={maxBorrowAmount} healthFactor={healthFactor} />
        </>
    )
}

export default BorrowAsset