import { Box, IconButton, InputAdornment } from "@mui/material";
import TokenIcon from "../../TokenIcon";
import { SelectToken } from "../SelectToken";

import { ReactComponent as MaxIcon } from "./max.svg";
import { Input } from "./style";


interface inputFieldProps {
    type?: string;
    value?: number | string;
    step?: string;
    readOnly?: boolean;
    isUSN?: boolean;
    symbol?: string;
    icon: string;
    onChange?: (e: React.SyntheticEvent) => void;
    onClickMax?: (e: React.SyntheticEvent) => void;
    onFocus?: (e: React.SyntheticEvent) => void;
}

const InputField = (props: inputFieldProps) => {
    const { value, type, onChange, onClickMax, step, readOnly = false, isUSN = false, icon, symbol, ...rest } = props;
    return (
        <Input
            type={type || "string"}
            value={value}
            inputProps={{ min: 0, step }}
            onChange={onChange}
            sx={{ textAlign: "right" }}
            readOnly={readOnly}
            {...rest}
            endAdornment={
                <InputAdornment position="start">
                    <IconButton aria-label="max value" onClick={onClickMax}>
                        <MaxIcon />
                    </IconButton>
                </InputAdornment>
            }
            startAdornment={
                isUSN ?
                    <InputAdornment position="start">
                        <IconButton aria-label="max value">
                            <Box color='white' fontWeight={600} fontSize="14px" p='6px' bgcolor='#2a2835' borderRadius="8px" display="flex" alignItems="center" gap="5px">
                                <TokenIcon icon={icon} />
                                {symbol}
                            </Box>
                        </IconButton>
                    </InputAdornment>
                    : <SelectToken icon={icon} symbol={symbol} />
            }
        />
    );
};

export default InputField;
