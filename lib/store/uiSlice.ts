import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

interface UiState {
  sidebarOpen: boolean;
  snackbar: SnackbarState;
}

const initialState: UiState = {
  sidebarOpen: true,
  snackbar: { open: false, message: '', severity: 'info' },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    showSnackbar: (
      state,
      action: PayloadAction<{ message: string; severity: SnackbarSeverity }>
    ) => {
      state.snackbar = { open: true, ...action.payload };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, showSnackbar, hideSnackbar } = uiSlice.actions;
export default uiSlice.reducer;
