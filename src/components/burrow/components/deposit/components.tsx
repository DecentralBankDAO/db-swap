import { Box, Typography, Stack, Alert, Link, ButtonGroup, Button, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import TokenIcon from "../TokenIcon";
import { actionMapTitle } from "./utils";
import APYCell from "../tableCommon/apy-cell";
import { TOKEN_FORMAT, USD_FORMAT } from "../../../../store";
import { useDegenMode } from "../../hooks/useDegenMode";

export const USNInfo = () => (
  <Box mt="1rem">
    <Alert severity="info">
      <Stack>
        <Box>
          To swap NEAR for USN, use &nbsp;
          <Link
            href="https://swap.decentral-bank.finance/"
            title="DecentralBank SWAP"
            target="blank"
          >
            DecentralBank SWAP
          </Link>
        </Box>
      </Stack>
    </Alert>
  </Box>
);

export const NotConnected = () => (
  <Box
    position="absolute"
    display="flex"
    justifyContent="center"
    alignItems="center"
    top="0"
    left="0"
    right="0"
    bottom="0"
    bgcolor="#2a2835"
    zIndex="1"
  >
    <Box color="white" fontWeight={600}>
      Please connect your wallet
    </Box>
  </Box>
);

export const WaitingForData = () => (
  <Box
    position="absolute"
    display="flex"
    justifyContent="center"
    alignItems="center"
    top="0"
    left="0"
    right="0"
    bottom="0"
    bgcolor="#2a2835"
    zIndex="1"
  >
    <Box color="white" fontWeight={600}>
      Waiting for data...
    </Box>
  </Box>
)

export const DataError = () => (
  <Box
    position="absolute"
    display="flex"
    justifyContent="center"
    alignItems="center"
    top="0"
    left="0"
    right="0"
    bottom="0"
    bgcolor="#2a2835"
    zIndex="1"
  >
    <Box color="white" fontWeight={600}>
      Ouch. Something went wrong, please try refreshing the page.
    </Box>
  </Box>
)

export const CloseButton = ({ onClose, ...props }) => (
  <Box
    onClick={onClose}
    position="absolute"
    right="2rem"
    zIndex="2"
    sx={{ cursor: "pointer" }}
    {...props}
  >
    <CloseIcon fontSize="small" />
  </Box>
);

export const TokenInfo = ({ apy, asset }) => {
  const { action, symbol, tokenId, icon, depositRewards, borrowRewards, price } = asset;
  const page = ["Withdraw", "Adjust", "Supply"].includes(action) ? "deposit" : "borrow";
  const apyRewards = page === "deposit" ? depositRewards : borrowRewards;
  const isRepay = action === "Repay";
  const { degenMode, isRepayFromDeposits, setRepayFromDeposits } = useDegenMode();
  const theme = useTheme();

  return (
    <>
      <Typography textAlign="left" fontWeight="500" fontSize="1.3rem" mb="1rem">
        {actionMapTitle[action]}
      </Typography>
      {isRepay && degenMode.enabled && (
        <ButtonGroup size="small" aria-label="small button group" sx={{ mb: "0.2rem" }}>
          <Button
            key="wallet"
            color={isRepayFromDeposits ? "info" : "primary"}
            onClick={() => setRepayFromDeposits(false)}
          >
            From Wallet
          </Button>
          <Button
            key="deposits"
            color={isRepayFromDeposits ? "primary" : "info"}
            onClick={() => setRepayFromDeposits(true)}
          >
            From Deposits
          </Button>
        </ButtonGroup>
      )}
      <Box boxShadow="0px 5px 15px rgba(0, 0, 0, 0.1)" borderRadius={1} p={2} display="flex" sx={{
        background: "rgba(129,126,166,.2)",
        cursor: "pointer",
        mb: "1rem"
      }}>
        <TokenIcon icon={icon} />
        <Box ml="12px">
          <Typography fontSize="0.85rem" fontWeight="500" color="white">
            {symbol}
          </Typography>
          <Typography fontSize="0.7rem" color="grey.400">
            {Number(price).toLocaleString(undefined, USD_FORMAT)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            height: "24px",
            bgcolor: theme.palette.background.default,
            alignItems: "center",
            borderRadius: "4px",
            px: "8px",
            ml: "auto",
            alignSelf: "center",
          }}
        >
          <APYCell
            rewards={apyRewards}
            baseAPY={apy}
            page={page}
            tokenId={tokenId}
            showIcons={false}
            justifyContent="center"
            sx={{
              fontSize: "0.75rem",
              color: theme.palette.secondary.main,
              minWidth: "auto",
              mr: "4px",
            }}
          />
          <Typography
            sx={{ fontSize: "0.75rem", color: theme.palette.secondary.main, fontWeight: "bold" }}
          >
            APY
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export const Available = ({ label, totalAvailable, available$ }) => (
  <Box mb="0.5rem" display="flex" justifyContent="space-between" alignItems="center">
    <Typography fontSize="1rem" color="white" fontWeight={600}>
      {label}
    </Typography>
    <Typography fontSize="0.75rem" color="grey.500">
      Available: {Number(totalAvailable).toLocaleString(undefined, TOKEN_FORMAT)} ({available$})
    </Typography>
  </Box>
);

export const HealthFactor = ({ value }) => {
  const healthFactorColor =
    value === -1 ? "black" : value < 180 ? "red" : value < 200 ? "orange" : "green";
  const healthFactorDisplayValue = value === -1 ? "N/A" : `${value?.toFixed(2)}%`;

  return (
    <Box display="flex" justifyContent="space-between">
      <Typography fontSize="0.85rem" color="#bdbdbd">
        Health Factor
      </Typography>
      <Typography fontSize="0.85rem" color={healthFactorColor}>
        {healthFactorDisplayValue}
      </Typography>
    </Box>
  );
};

export const Rates = ({ rates }) => {
  if (!rates) return null;
  return rates.map(({ label, value }) => (
    <Box key={label} display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body1" fontSize="0.85rem" color="#bdbdbd">
        {label}
      </Typography>
      <Typography variant="body1" fontSize="0.85rem" fontWeight="500" color="#bdbdbd">
        {value}
      </Typography>
    </Box>
  ));
};

export const Alerts = ({ data }) => (
  <Stack my="1rem" spacing="1rem">
    {Object.keys(data).map((alert) => (
      <Alert key={alert} severity={data[alert].severity}>
        {data[alert].title}
      </Alert>
    ))}
  </Stack>
);
