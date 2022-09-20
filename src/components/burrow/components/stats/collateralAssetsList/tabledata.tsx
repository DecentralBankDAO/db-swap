
import { Cell } from "../../tableCommon/cell";
import Label from "../../tableCommon/label";
import TokenCell from "../../tableCommon/token-cell";

export const suppliedColumns = [
    {
        label: "Name",
        dataKey: "symbol",
        align: "left",
        Cell: ({ rowData }) => <TokenCell rowData={rowData} isCollateralList={true} />,
    },
    {
        label: <Label name="Collateral" title="Collateral" />,
        dataKey: "collateral",
        align: "center",
        Cell: ({ rowData }) => (
            <Cell
                value={rowData.collateral}
                rowData={rowData}
                format="amount"
                tooltip={`${((rowData.collateral / rowData.supplied) * 100).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                })}%`}
            />
        ),
    },
    {
        label: <Label name="Collateral in $" title="Your collateral in $" />,
        dataKey: "supplied",
        align: "center",
        Cell: ({ rowData }) => <Cell value={(rowData.collateral * rowData.price)} rowData={rowData} format="usd" />,
    },
];