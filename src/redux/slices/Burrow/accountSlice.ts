import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { transformAccount } from "../../transform/account";
import { initialState } from "./accountState";
import getAccount from "../../../api/get-account";



export const fetchAccount = createAsyncThunk("account/fetchAccount", async (wallet) => {
  const account = await getAccount(wallet).then(transformAccount);

  return account;
});

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    logoutAccount: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccount.pending, (state, action) => {
      state.status = action.meta.requestStatus;
    });
    builder.addCase(fetchAccount.rejected, (state, action) => {
      state.status = action.meta.requestStatus;
      console.error(action.payload);
      throw new Error("Failed to fetch account");
    });
    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      state.isClaiming = undefined;
      state.status = action.meta.requestStatus;
      state.fetchedAt = new Date().toString();
      if (!action.payload?.accountId) return;

      const { accountId, balances, portfolio } = action.payload;

      state.accountId = accountId;
      state.balances = balances;

      if (portfolio) {
        state.portfolio = portfolio;
      }
    });
  },
});

export const { logoutAccount } = accountSlice.actions;
export default accountSlice;
