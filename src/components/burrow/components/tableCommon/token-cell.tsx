import { Box, Skeleton } from "@mui/material";

import { USD_FORMAT } from "../../../../store";
import { useIsBurrowToken } from "../../hooks/useIsBurrowToken";
import BRRRPrice from "../BRRRPrice";
import TokenIcon from "../TokenIcon";

const TokenCell = ({ rowData }) => {
  const isBurrowToken = useIsBurrowToken(rowData.tokenId);

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" flexDirection="row" alignItems="center">
        {rowData ? (
          <>
            <TokenIcon icon={rowData?.icon} />
            <Box marginLeft="5px" color="gray">{rowData.symbol}</Box>
          </>
        ) : (
          <Skeleton sx={{ bgcolor: "gray" }} width={35} height={35} variant="circular" />
        )}
      </Box>
      <Box px="1rem">
        {rowData ? (
          <>

            {isBurrowToken && !rowData.price ? (
              <BRRRPrice />
            ) : (
              <Box color="gray">
                {rowData.price ? rowData.price.toLocaleString(undefined, USD_FORMAT) : "$-.-"}
              </Box>
            )}
          </>
        ) : (
          <>
            <Skeleton sx={{ bgcolor: "gray" }} width={40} height={20} />
            <Skeleton sx={{ bgcolor: "gray" }} width={50} height={20} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default TokenCell;
