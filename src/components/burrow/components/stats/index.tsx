import Decimal from "decimal.js";
import { useSelector } from "react-redux";
import { getAssetData, getAssetDataUSN } from "../../../../redux/slices/Burrow/appSelectors";
import { getBorrowMaxAmount } from "../../../../redux/slices/Burrow/Selectors/getBorrowMaxAmount";
import { getHealthFactor } from "../../../../redux/slices/Burrow/Selectors/getHelthFactor";
import { getTotalAccountBalance } from "../../../../redux/slices/Burrow/Selectors/getTotalAccountBalance";
import { COMPACT_USD_FORMAT, m } from "../../../../store";
import { useAccountId } from "../../hooks/useAccountId";
import { useFullDigits } from "../../hooks/useFullDigits";
import CollateralAssetsList from "./collateralAssetsList";
import Stats from "./stats";

export interface IData {
  text: string,
  value: string | number
}

const Preview = () => {
  const { fullDigits } = useFullDigits();
  const accountId = useAccountId();
  const healthFactor = useSelector(getHealthFactor);
  const assetUSN = useSelector(getAssetDataUSN);
  const asset = useSelector(getAssetData)
  const userDeposited = useSelector(getTotalAccountBalance("supplied"));
  const userBorrowed = useSelector(getTotalAccountBalance("borrowed"));

  const { tokenId } = assetUSN;
  const { tokenId: assetTokenId } = asset;

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

  const maxBorrowAmount = useSelector(getBorrowMaxAmount(assetTokenId, tokenId));
  const availableToBorrow = maxBorrowAmount;
  const total = new Decimal(availableToBorrow).plus(Number(m(userBorrowed)));
  const percentTotal = new Decimal(Number(m(userBorrowed))).div(total).mul(100) || 0;

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
      value: `${!isNaN(percentTotal.toNumber()) ? percentTotal.toFixed(2) : 0}%`
    }
  ]

  return (
    <>
      <Stats data={data} />
      {accountId && <CollateralAssetsList />}
    </>
  )
}

export default Preview