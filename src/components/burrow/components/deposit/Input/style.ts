import { styled } from "@mui/material/styles";
import { OutlinedInput } from "@mui/material";

export const Input = styled(OutlinedInput)(({ theme }) => ({
    width: "100%",
    color: theme.palette.secondary.main,
    fontWeight: "bold",
    background: "rgba(129,126,166,.2)",
    borderRadius: "8px",
    "&.MuiOutlinedInput-root": {
        "& > fieldset": {
            borderWidth: 1,
        },
    },
}));
