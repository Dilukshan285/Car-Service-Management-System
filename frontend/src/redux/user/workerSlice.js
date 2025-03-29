// redux/worker/workerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  worker: null, // This is likely the field name, not `currentWorker`
  loading: false,
  error: null,
};

const workerSlice = createSlice({
  name: "worker",
  initialState,
  reducers: {
    loginWorkerStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginWorkerSuccess(state, action) {
      state.worker = action.payload; // Store the worker data here
      state.loading = false;
      state.error = null;
    },
    loginWorkerFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logoutWorker(state) {
      state.worker = null;
      state.loading = false;
      state.error = null;
    },
    resetLoadingState(state) {
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  loginWorkerStart,
  loginWorkerSuccess,
  loginWorkerFailure,
  logoutWorker,
  resetLoadingState,
} = workerSlice.actions;

export default workerSlice.reducer;