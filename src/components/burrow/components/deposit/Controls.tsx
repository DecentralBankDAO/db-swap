import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateAmount, updateBorrowAmount } from "../../../../redux/slices/Burrow/appSlice";
import Slider from "./Slider";
import Input from "./Input";


export default function Controls({ amount, available, isUSN = false, icon, symbol }) {
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        if (Number(e.target.value) > available) return;
        if (isUSN) {
            dispatch(updateBorrowAmount({ isMaxBorrow: false, borrowAmount: e.target.value || 0 }))
        } else {
            dispatch(updateAmount({ isMax: false, amount: e.target.value || 0 }));
        }

    };

    const handleMaxClick = () => {
        if (isUSN) {
            dispatch(updateBorrowAmount({ isMaxBorrow: true, borrowAmount: Number(available) }))
        } else {
            dispatch(updateAmount({ isMax: true, amount: Number(available) }));
        }

    };

    const handleFocus = (e) => {
        e.target.select();
    };

    const handleSliderChange = (e) => {
        const { value: percent } = e.target;
        const value = (Number(available) * percent) / 100;

        if (isUSN) {
            dispatch(
                updateBorrowAmount({
                    isMaxBorrow: value === Number(available),
                    borrowAmount: value
                }))
        } else {
            dispatch(
                updateAmount({
                    isMax: value === Number(available),
                    amount: value,
                }),
            );
        }
    };

    const sliderValue = Math.round((amount * 100) / available) || 0;

    const inputAmount = `${amount}`
        .replace(/[^0-9.-]/g, "")
        .replace(/(\..*)\./g, "$1")
        .replace(/(?!^)-/g, "")
        .replace(/^0+(\d)/gm, "$1");

    return (
        <>
            <Input
                value={inputAmount}
                type="number"
                step="0.01"
                onClickMax={handleMaxClick}
                onChange={handleInputChange}
                onFocus={handleFocus}
                icon={icon}
                isUSN={isUSN}
                symbol={symbol}
            />
            <Box mx="1.5rem" my="1rem">
                <Slider value={sliderValue} onChange={handleSliderChange} />
            </Box>
        </>
    );
}
