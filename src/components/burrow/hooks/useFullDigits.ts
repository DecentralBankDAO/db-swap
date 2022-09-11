
import { useDispatch, useSelector } from "react-redux";
import { getFullDigits } from "../../../redux/slices/Burrow/appSelectors";
import { setFullDigits } from "../../../redux/slices/Burrow/appSlice";

export function useFullDigits() {
  const dispatch = useDispatch();
  const fullDigits = useSelector(getFullDigits);

  const setDigits = (value) => dispatch(setFullDigits(value));

  return { fullDigits, setDigits };
}