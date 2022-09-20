import { Box, Stack } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { getGlobalAction } from "../../../redux/slices/Burrow/appSelectors"
import { setGlobalAction, showModal } from "../../../redux/slices/Burrow/appSlice";
import { useAvailableAssets } from "../hooks/useAvailableAssets";

const tabsList = ["Borrow", "Repay", "Withdraw"]

export const BorrowTabs = ({ suppliedRows, borrowedRows }) => {

    const globalAction = useSelector(getGlobalAction);
    const rows = useAvailableAssets("supply");
    const dispatch = useDispatch();

    const onChangeAction = (action) => {
        dispatch(setGlobalAction({ action }))
        if (action === "Withdraw" && suppliedRows?.length) {
            dispatch(showModal({ tokenId: suppliedRows[0].tokenId, amount: 0 }))
        } else if (action === "Repay" && borrowedRows?.length) {
            dispatch(showModal({ tokenId: borrowedRows[0].tokenId, amount: 0 }))
        } else {
            dispatch(showModal({ tokenId: rows[0].tokenId, amount: 0 }))
        }
    }

    return (
        <Stack direction="row" justifyContent="space-between" gap="10px" alignItems="center" mb="10px">
            {tabsList.map((action) => (
                <Box
                    key={action}
                    p={["15px 15px", "15px 30px"]}
                    flex={1}
                    color="white"
                    fontWeight={600}
                    borderRadius="20px"
                    bgcolor={globalAction === action ? "black" : "gray"}
                    onClick={() => onChangeAction(action)}
                    sx={{
                        cursor: "pointer"
                    }}
                >
                    {action}
                </Box>
            ))}
        </Stack>
    )
};