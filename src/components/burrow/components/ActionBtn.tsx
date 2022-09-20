import { useState, useMemo } from "react";
// import { Box, Typography, Switch, Tooltip, Alert } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";


import { useDispatch, useSelector } from "react-redux";


import { getAssetData, getAssetDataUSN, getGlobalAction, getSelectedValues } from "../../../redux/slices/Burrow/appSelectors";
import { useDegenMode } from "../hooks/useDegenMode";
import depositAndBorrow from "../../../store/actions/depositAndBorrow";
import { useNearWallet } from "react-near";
import { withdraw } from "../../../store/actions/withdraw";
import { repay } from "../../../store/actions/repay";

const renderTextBtn = (globalAction, amount, borrowAmount) => {
  if (globalAction === "Borrow") {
    if (amount && borrowAmount) return "Deposit and Borrow";
    if (amount) return "Deposit";
    if (borrowAmount) return "Borrow"
  }

  if (globalAction === "Withdraw" && amount) return "Withdraw";
  if (globalAction === "Repay" && amount) return "Repay";

  return "Confirm"
}


export default function ActionBtn({ maxBorrowAmount, healthFactor }) {
  const wallet = useNearWallet()
  const [loading, setLoading] = useState(false);
  const { amount, isMax, borrowAmount } = useSelector(getSelectedValues);
  const globalAction = useSelector(getGlobalAction);
  const dispatch = useDispatch();
  const asset = useSelector(getAssetData);
  const assetUSN = useSelector(getAssetDataUSN);
  const { tokenId, extraDecimals } = asset;
  const { tokenId: borrowTokenId, extraDecimals: borrowExtraDecimals } = assetUSN;
  const { isRepayFromDeposits } = useDegenMode();


  const handleActionButtonClick = async () => {
    setLoading(true);

    switch (globalAction) {
      case "Borrow":
        await depositAndBorrow({
          tokenId,
          extraDecimals: Number(extraDecimals),
          amount,
          isMax,
          borrowTokenId,
          borrowAmount,
          borrowExtraDecimals: Number(borrowExtraDecimals),
          wallet
        })
        break;
      case "Withdraw":
        await withdraw({
          tokenId,
          extraDecimals: Number(extraDecimals),
          amount,
          isMax,
          wallet
        });
        break;
      case "Repay":
        await repay({
          tokenId,
          amount,
          extraDecimals: Number(extraDecimals),
          isMax,
          wallet
        })
        break;
      default:
        break;
    }
  };

  const actionDisabled = useMemo(() => {
    if (!amount && !borrowAmount) return true;
    // if (action === "Supply" && amount > 0) return false;
    // if (action !== "Adjust" && !amount) return true;
    // if (
    //   action !== "Repay" &&
    //   parseFloat(healthFactor?.toFixed(2)) >= 0 &&
    //   parseFloat(healthFactor?.toFixed(2)) <= 100
    // )
    //   return true;
    return false;
  }, [amount, borrowAmount, healthFactor]);

  //   const showToggle = action === "Supply";

  return (
    <>
      {/* {showToggle && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb="0.5rem">
          <Typography variant="body1" fontSize="0.85rem">
            Use as Collateral
          </Typography>
          {!canUseAsCollateral && (
            <Tooltip
              sx={{ ml: "auto" }}
              placement="top"
              title="This asset can't be used as collateral yet"
            >
              <Box alignItems="center" display="flex">
                <FcInfo />
              </Box>
            </Tooltip>
          )}
          <Switch
            onChange={handleSwitchToggle}
            checked={useAsCollateral}
            disabled={!canUseAsCollateral}
          />
        </Box>
      )} */}
      <LoadingButton
        disabled={actionDisabled}
        variant="contained"
        onClick={handleActionButtonClick}
        loading={loading}
        sx={{
          width: "100%",
          mb: "1rem",
          fontWeight: 600,
          "&.Mui-disabled": {
            background: "rgba(129,126,166,.2)",
            color: "black"
          }
        }}
      >
        {renderTextBtn(globalAction, amount, borrowAmount)}
      </LoadingButton>
      {/* {action === "Repay" && isRepayFromDeposits && (
        <Alert severity="warning">
          This is an advanced feature. Please Do Your Own Research before using it.
        </Alert>
      )} */}
    </>
  );
}
