import { useSelector } from "react-redux";
import { getPortfolioAssets } from "../../../redux/slices/Burrow/Selectors/getPortfoliaAssets";

export function usePortfolioAssets() {
    return useSelector(getPortfolioAssets);
}