import { Box, Typography } from "@mui/material";
import { useAccountId } from "./hooks/useAccountId";
import { DepositBlock, InfoBlock, Wrapper } from "./style/styles";
import Preview from "./components/stats";
import Deposit from "./components/deposit";
import { NotConnected } from "./components/deposit/components";
import Loader from "../../App/Loader";
import { BlockedCountry } from "../swap/BlockedCountry";

const Borrow = () => {
  const accountId = useAccountId();

  return (
    <>
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
          <Deposit />
        </DepositBlock>
      </Wrapper>
    </>
  )
};

export default Borrow;