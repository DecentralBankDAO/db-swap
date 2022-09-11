import { useSelector } from "react-redux";
import { getNetLiquidityRewards } from "../../../redux/slices/Burrow/Selectors/getProtocolRewards";
import { getTokenLiquidity } from "../../../redux/slices/Burrow/Selectors/getTokenLiquidity";
import { useProtocolNetLiquidity } from "./useProtocolNetLiquidity";

export function useNetLiquidityRewards() {
    const rewards = useSelector(getNetLiquidityRewards);
    return rewards;
  }

export function useProRataNetLiquidityReward(tokenId, dailyAmount) {
    const { protocolNetLiquidity } = useProtocolNetLiquidity();
    const tokenLiquidity = useSelector(getTokenLiquidity(tokenId));
  
    if (!tokenId) return dailyAmount;
    const share = tokenLiquidity / protocolNetLiquidity;
    return dailyAmount * share;
  }