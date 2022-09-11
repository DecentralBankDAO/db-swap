import { useSelector } from "react-redux";
import { getAssetData, getSelectedValues } from "../../../../redux/slices/Burrow/appSelectors";
import { USD_FORMAT } from "../../../../store";
import { Available } from "./components"
import Controls from "./Controls"
import { SelectToken } from "./SelectToken"


const DepositAsset = () => {
    const asset = useSelector(getAssetData);
    const { amount } = useSelector(getSelectedValues);

    const { available, supplyApy, price } = asset;

    const available$ = (available! * price!).toLocaleString(undefined, USD_FORMAT);

    return (
        <>
            <Available label="Collateral assets" totalAvailable={available} available$={available$} />
            <SelectToken apy={supplyApy} asset={asset} />
            {/* {action === "Supply" && symbol === "USN" && <USNInfo />} */}
            <Controls amount={amount} available={available} />
        </>
    )
}

export default DepositAsset;