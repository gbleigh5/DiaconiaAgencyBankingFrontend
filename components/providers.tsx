'use client';
import { PropsWithChildren, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { makeQueryClient } from '@/lib/query-client';
import { store, persistor } from '@/lib/store';
import theme from '@/lib/theme';

function PersistLoading() {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
      <CircularProgress size={40} />
    </Box>
  );
}

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(makeQueryClient);
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<PersistLoading />} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ThemeProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
