import Decimal from "decimal.js";
import { useSelector } from "react-redux";
import { getAssetDataUSN } from "../../../../redux/slices/Burrow/appSelectors";
import { getBorrowMaxAmount } from "../../../../redux/slices/Burrow/Selectors/getBorrowMaxAmount";
import { getHealthFactor } from "../../../../redux/slices/Burrow/Selectors/getHelthFactor";
import { getTotalAccountBalance } from "../../../../redux/slices/Burrow/Selectors/getTotalAccountBalance";
import { COMPACT_USD_FORMAT, m } from "../../../../store";
import { useFullDigits } from "../../hooks/useFullDigits";
import CollateralAssetsList from "./collateralAssetsList";
import Stats from "./stats";

export interface IData {
  text: string,
  value: string | number
}

const Preview = () => {
  const { fullDigits } = useFullDigits();
  const healthFactor = useSelector(getHealthFactor);
  const assetUSN = useSelector(getAssetDataUSN);
  const userDeposited = useSelector(getTotalAccountBalance("supplied"));
  const userBorrowed = useSelector(getTotalAccountBalance("borrowed"));

  const { availableLiquidity, available, tokenId } = assetUSN;

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

  const maxBorrowAmount = useSelector(getBorrowMaxAmount(tokenId));
  const availableToBorrow = Math.min(Math.max(0, maxBorrowAmount), Number(availableLiquidity));
  const total = new Decimal(availableToBorrow).plus(Number(m(userBorrowed)));
  const percentTotal = new Decimal(Number(m(userBorrowed))).div(total).mul(100);

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
      text: 'Borrow power used',
      value: `${percentTotal.toFixed(2)}%`
    }
  ]

  return (
    <>
      <Stats data={data} />
      <CollateralAssetsList />
    </>
  )
}

export default Preview