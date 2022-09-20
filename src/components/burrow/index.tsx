import { Box, Typography } from "@mui/material";


import { columns as defaultColumns } from "./tabledata";
// import { useAccountId, useAvailableAssets } from "../../hooks/hooks";
import OnboardingBRRR from "./components/OnboardingBRRR";
import PageTitle from "./components/PageTitle";
import Table from "./components/Table";
import { useDispatch } from "react-redux";
import { showModal } from "../../redux/slices/Burrow/appSlice";
import { useTableSorting } from "./hooks/useTableSorting";
import { useAvailableAssets } from "./hooks/useAvailableAssets";
import { useAccountId } from "./hooks/useAccountId";
import { DepositBlock, InfoBlock, Wrapper } from "./style/styles";
import Preview from "./components/stats";
import Deposit from "./components/deposit";
import { NotConnected } from "./components/deposit/components";

const Borrow = () => {
  const dispatch = useDispatch();
  const accountId = useAccountId();
  const rows = useAvailableAssets("borrow");
  const { sorting, setSorting } = useTableSorting();

  const columns = !accountId
    ? [...defaultColumns.filter((col) => col.dataKey !== "borrowed")]
    : defaultColumns;

  const handleOnRowClick = ({ tokenId }) => {
    dispatch(showModal({ action: "Borrow", tokenId, amount: 0 }));
  };

  return (
    <Wrapper >
      <InfoBlock>
        <Typography
          component="h1"
          color="white"
          fontSize='24px'
          fontWeight={600}
          fontFamily="Inter"
          marginBottom='30px'
        >
          BORROW USN
        </Typography>
        <Box
          bgcolor='rgba(35,33,45,.3)'
          border='1px solid hsla(0,0%,100%,.06)'
          borderRadius='30px'
          pt='40px'
        >
          <Preview />
        </Box>
      </InfoBlock>
      <DepositBlock>
        {!accountId ? <NotConnected /> : <Deposit />}

      </DepositBlock>

      {/* <BetaInfo /> */}
      {/* <Table
        rows={rows}
        columns={columns}
        onRowClick={handleOnRowClick}
        sorting={{ name: "borrow", ...sorting.borrow, setSorting }}
      /> */}
    </Wrapper>
  );
};

export default Borrow;