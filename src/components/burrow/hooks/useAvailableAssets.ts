import { useSelector } from "react-redux";
import { getAvailableAssets } from "../../../redux/slices/Burrow/assetsSelectors";


export function useAvailableAssets(type: "supply" | "borrow") {
    return useSelector(getAvailableAssets(type));
  }