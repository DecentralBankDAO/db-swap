import { useDispatch, useSelector } from "react-redux";
import { getDegenMode } from "../../../redux/slices/Burrow/appSelectors";
import { setRepayFrom, toggleDegenMode } from "../../../redux/slices/Burrow/appSlice";

export function useDegenMode() {
    const degenMode = useSelector(getDegenMode);
    const dispatch = useDispatch();

    const setDegenMode = () => {
        dispatch(toggleDegenMode());
    };

    const setRepayFromDeposits = (repayFromDeposits: boolean) => {
        dispatch(setRepayFrom({ repayFromDeposits }));
    };

    const isRepayFromDeposits = degenMode.enabled && degenMode.repayFromDeposits;

    return { degenMode, setDegenMode, isRepayFromDeposits, setRepayFromDeposits };
}