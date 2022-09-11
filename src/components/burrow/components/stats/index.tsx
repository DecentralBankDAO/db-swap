import { useSelector } from "react-redux";
import { getHealthFactor } from "../../../../redux/slices/Burrow/Selectors/getHelthFactor";
import { getTotalAccountBalance } from "../../../../redux/slices/Burrow/Selectors/getTotalAccountBalance";
import { COMPACT_USD_FORMAT, m } from "../../../../store";
import { useFullDigits } from "../../hooks/useFullDigits";
import Stats from "./stats";

export interface IData {
  text: string,
  value: string | number
}

const Preview = () => {
  const { fullDigits } = useFullDigits();
  const healthFactor = useSelector(getHealthFactor);
  const userDeposited = useSelector(getTotalAccountBalance("supplied"));
  const userBorrowed = useSelector(getTotalAccountBalance("borrowed"));

  const amountHealthFactor =
    healthFactor === -1 || healthFactor === null
      ? "N/A"
      : `${healthFactor?.toLocaleString(undefined, {
        maximumFractionDigits: healthFactor <= 105 ? 2 : 0,
      })}%`;


  const userDepositedValue = fullDigits?.user
    ? userDeposited.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(userDeposited)}`;

  const userBorrowedValue = fullDigits?.user
    ? userBorrowed.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(userBorrowed)}`;

  const data: IData[] = [
    {
      text: 'Health Factor',
      value: amountHealthFactor
    },
    {
      text: 'Collateral Value',
      value: userDepositedValue
    },
    {
      text: 'Borrowed',
      value: userBorrowedValue
    },
    {
      text: 'APY',
      value: '0 $'
    }
  ]

  return (
    <Stats data={data} />
  )
}

export default Preview