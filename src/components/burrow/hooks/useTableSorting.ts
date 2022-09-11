
import { getTableSorting } from "../../../redux/slices/Burrow/appSelectors";
import { useDispatch, useSelector } from "react-redux";
import { IOrder, setTableSorting } from "../../../redux/slices/Burrow/appSlice";

export function useTableSorting() {
  const sorting = useSelector(getTableSorting);
  const dispatch = useDispatch();

  const setSorting = (name: string, property: string, order: IOrder) => {
    dispatch(setTableSorting({ name, property, order }));
  };

  return {
    sorting,
    setSorting,
  };
}