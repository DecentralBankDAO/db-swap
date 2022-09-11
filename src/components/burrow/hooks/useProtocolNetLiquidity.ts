// import { useSelector } from "../redux/hooks";

import { useSelector } from "react-redux";
import { getTotalBalance } from "../../../redux/slices/Burrow/Selectors/getTotalBalance";

export function useProtocolNetLiquidity() {
  const protocolDeposited = useSelector(getTotalBalance("supplied"));
  const protocolBorrowed = useSelector(getTotalBalance("borrowed"));
  const protocolNetLiquidity = protocolDeposited - protocolBorrowed;
  return { protocolDeposited, protocolBorrowed, protocolNetLiquidity };
}