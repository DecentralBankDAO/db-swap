import { Cell } from "./components/tableCommon/cell";
import Label from "./components/tableCommon/label";
import TokenCell from "./components/tableCommon/token-cell";

export const columns = [
  {
    label: "Name",
    dataKey: "name",
    Cell: TokenCell,
    align: "center"
  },
];
