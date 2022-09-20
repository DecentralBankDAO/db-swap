import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import getConfig from "../../../api/get-config";
import { IConfig } from "../../../interfaces/burrow";



type TokenAction = "Supply" | "Borrow" | "Repay" | "Adjust" | "Withdraw";

export type IOrder = "asc" | "desc";

export interface ITableSorting {
  property: string;
  order: IOrder;
}
export interface AppState {
  degenMode: {
    enabled: boolean;
    repayFromDeposits: boolean;
  };
  showModal: boolean;
  globalAction: TokenAction;
  showInfo: boolean;
  protocolStats: boolean;
  displayAsTokenValue: boolean;
  showTicker: boolean;
  showDust: boolean;
  slimStats: boolean;
  showDailyReturns: boolean;
  fullDigits: {
    totals: boolean;
    user: boolean;
    table: boolean;
    dailyReturns: boolean;
  };
  selected: {
    action?: TokenAction;
    tokenId: string;
    useAsCollateral: boolean;
    amount: number;
    borrowAmount: number,
    isMax: boolean,
    isMaxBorrow: boolean
  };
  staking: {
    amount: number;
    months: number;
  };
  tableSorting: {
    deposit: ITableSorting;
    borrow: ITableSorting;
    portfolioDeposited: ITableSorting;
    portfolioBorrowed: ITableSorting;
  };
  config: IConfig;
}

export const initialState: AppState = {
  degenMode: {
    enabled: false,
    repayFromDeposits: false,
  },
  showModal: false,
  globalAction: "Borrow",
  showInfo: true,
  protocolStats: true,
  displayAsTokenValue: true,
  showDust: false,
  showTicker: false,
  slimStats: false,
  showDailyReturns: false,
  fullDigits: {
    totals: false,
    user: false,
    table: true,
    dailyReturns: true,
  },
  selected: {
    action: undefined,
    tokenId: "",
    useAsCollateral: false,
    amount: 0,
    isMax: false,
    borrowAmount: 0,
    isMaxBorrow: false
  },
  staking: {
    amount: 0,
    months: 1,
  },
  tableSorting: {
    deposit: {
      property: "totalSupplyMoney",
      order: "desc" as IOrder,
    },
    borrow: {
      property: "borrowed",
      order: "desc" as IOrder,
    },
    portfolioDeposited: {
      property: "deposited",
      order: "desc" as IOrder,
    },
    portfolioBorrowed: {
      property: "borrowed",
      order: "desc" as IOrder,
    },
  },
  config: {
    booster_decimals: 0,
    booster_token_id: "",
    force_closing_enabled: 0,
    max_num_assets: 0,
    maximum_recency_duration_sec: 0,
    maximum_staking_duration_sec: 0,
    maximum_staleness_duration_sec: 0,
    minimum_staking_duration_sec: 0,
    oracle_account_id: "",
    owner_id: "",
    x_booster_multiplier_at_maximum_staking_duration: 0,
  },
};

export const fetchConfig = createAsyncThunk("account/getConfig", async (wallet) => {
  const config = await getConfig(wallet);
  return config;
});

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    hideModal(state) {
      state.showModal = false;
    },
    showModal(
      state,
      action: PayloadAction<{ action?: TokenAction; amount: number; tokenId: string }>,
    ) {
      state.selected = { ...state.selected, isMax: false, ...action.payload };
      state.showModal = true;
    },
    setGlobalAction(
      state,
      action: PayloadAction<{ action: TokenAction; }>,
    ) {
      state.globalAction = action.payload.action;
    },
    updateAmount(state, action: PayloadAction<{ amount: number; isMax: boolean }>) {
      state.selected.amount = action.payload.amount;
      state.selected.isMax = action.payload.isMax;
      state.selected.borrowAmount = 0;
      state.selected.isMaxBorrow = false;
    },
    updateBorrowAmount(state, action: PayloadAction<{ borrowAmount: number; isMaxBorrow: boolean }>) {
      state.selected.borrowAmount = action.payload.borrowAmount;
      state.selected.isMaxBorrow = action.payload.isMaxBorrow;
    },
    toggleUseAsCollateral(state, action: PayloadAction<{ useAsCollateral: boolean }>) {
      state.selected.useAsCollateral = action.payload.useAsCollateral;
    },
    toggleDisplayValues(state) {
      state.displayAsTokenValue = !state.displayAsTokenValue;
    },
    toggleShowDust(state) {
      state.showDust = !state.showDust;
    },
    toggleSlimStats(state) {
      state.slimStats = !state.slimStats;
    },
    setProtocolStats(state, action) {
      state.protocolStats = action.payload;
    },
    setShowInfo(state, action) {
      state.showInfo = action.payload;
    },
    setFullDigits(state, action) {
      state.fullDigits = { ...state.fullDigits, ...action.payload };
    },
    toggleShowTicker(state) {
      state.showTicker = !state.showTicker;
    },
    toggleShowDailyReturns(state) {
      state.showDailyReturns = !state.showDailyReturns;
    },
    setTableSorting(state, action) {
      const { name, property, order } = action.payload;
      state.tableSorting[name] = { property, order };
    },
    setStaking(state, action) {
      state.staking = { ...state.staking, ...action.payload };
    },
    toggleDegenMode(state) {
      state.degenMode = { ...state.degenMode, enabled: !state.degenMode.enabled };
    },
    setRepayFrom(state, action) {
      state.degenMode = {
        ...state.degenMode,
        repayFromDeposits: action.payload.repayFromDeposits,
      };
      state.selected = {
        ...state.selected,
        amount: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchConfig.fulfilled, (state, action) => {
      state.config = action.payload;
    });
  },
});

export const {
  hideModal,
  showModal,
  setGlobalAction,
  updateAmount,
  updateBorrowAmount,
  toggleUseAsCollateral,
  toggleDisplayValues,
  toggleShowDust,
  toggleSlimStats,
  setFullDigits,
  toggleShowTicker,
  setTableSorting,
  toggleShowDailyReturns,
  setStaking,
  toggleDegenMode,
  setRepayFrom,
  setProtocolStats,
  setShowInfo,
} = appSlice.actions;

export default appSlice;
