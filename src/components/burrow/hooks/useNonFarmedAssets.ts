import { useSelector } from "react-redux";
import { getHasNonFarmedAssets } from "../../../redux/slices/Burrow/accountSelectors";
import { getWeightedAssets, getWeightedNetLiquidity } from "../../../redux/slices/Burrow/Selectors/getAccountRewards";

export function useNonFarmedAssets() {
    const weightedNetLiquidity = useSelector(getWeightedNetLiquidity);
    const hasNonFarmedAssets = useSelector(getHasNonFarmedAssets);
    const hasNegativeNetLiquidity = weightedNetLiquidity < 0;
    const assets = useSelector(getWeightedAssets);
  
    return { hasNonFarmedAssets, weightedNetLiquidity, hasNegativeNetLiquidity, assets };
  }