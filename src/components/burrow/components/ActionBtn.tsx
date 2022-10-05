import { useState, useMemo } from "react";
import LoadingButton from "@mui/lab/LoadingButton";

import { useSelector } from "react-redux";
import { getAssetData, getAssetDataUSN, getGlobalAction, getSelectedValues } from "../../../redux/slices/Burrow/appSelectors";

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
  const asset = useSelector(getAssetData);
  const assetUSN = useSelector(getAssetDataUSN);
  const { tokenId, extraDecimals } = asset;
  const { tokenId: borrowTokenId, extraDecimals: borrowExtraDecimals } = assetUSN;



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
    if (globalAction === "Borrow" && !amount && !borrowAmount) return true;
    if (globalAction !== "Borrow" && !amount) return true;

    return false;
  }, [amount, borrowAmount, globalAction]);

  return (
    <>
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
    </>
  );
}
