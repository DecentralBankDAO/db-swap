import { Box, IconButton, InputAdornment } from "@mui/material";

import { ReactComponent as MaxIcon } from "./max.svg";
import { Input } from "./style";


interface inputFieldProps {
    type?: string;
    value?: number | string;
    step?: string;
    readOnly?: boolean;
    isUSN?: boolean;
    onChange?: (e: React.SyntheticEvent) => void;
    onClickMax?: (e: React.SyntheticEvent) => void;
    onFocus?: (e: React.SyntheticEvent) => void;
}

const InputField = (props: inputFieldProps) => {
    const { value, type, onChange, onClickMax, step, readOnly = false, isUSN = false, ...rest } = props;
    return (
        <Input
            type={type || "string"}
            value={value}
            inputProps={{ min: 0, step }}
            onChange={onChange}
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
                        <IconButton aria-label="max value" onClick={onClickMax}>
                            <Box color='white' fontWeight={600} p='10px' bgcolor='#2a2835' borderRadius="8px">USN</Box>
                        </IconButton>
                    </InputAdornment>
                    : null
            }
        />
    );
};

export default InputField;
