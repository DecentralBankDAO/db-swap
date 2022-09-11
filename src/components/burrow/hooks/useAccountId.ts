import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

export const getAccountId = createSelector(
    (state) => state.account,
    (account) => account.accountId,
  );

export function useAccountId() {
    return useSelector(getAccountId);
  }