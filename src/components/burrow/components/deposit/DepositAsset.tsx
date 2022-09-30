import { useSelector } from "react-redux";
import { getAssetData, getGlobalAction, getSelectedValues } from "../../../../redux/slices/Burrow/appSelectors";
import { getWithdrawMaxAmount } from "../../../../redux/slices/Burrow/Selectors/getWithdrowMaxAmount";
import { USD_FORMAT } from "../../../../store";
import { Available } from "./components"
import Controls from "./Controls"
import { SelectToken } from "./SelectToken"
import { getModalData } from "./utils";


const DepositAsset = () => {
    const globalAction = useSelector(getGlobalAction);
    const asset = useSelector(getAssetData);
    const { amount } = useSelector(getSelectedValues);

    const { tokenId, icon, symbol } = asset;

    const maxWithdrawAmount = useSelector(getWithdrawMaxAmount(tokenId));

    const { apy, available, available$ } = getModalData({
        ...asset,
        action: globalAction === "Borrow" ? "Supply" : globalAction,
        maxWithdrawAmount,
        amount
    });

    const label = globalAction === "Borrow"
        ? "Collateral assets"
        : globalAction === "Repay"
            ? "Repay assets"
            : "Withdrow assets"

    return (
        <>
            <Available label={label} totalAvailable={available} available$={available$} />
            <Controls amount={amount} available={available} icon={icon} symbol={symbol} />
        </>
    )
}

export default DepositAsset;