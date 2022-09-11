import { useSelector } from "react-redux";
import { getConfig } from "../../../redux/slices/Burrow/appSelectors";

export function useIsBurrowToken(tokenId) {
    const config = useSelector(getConfig);
    return config.booster_token_id === tokenId;
}