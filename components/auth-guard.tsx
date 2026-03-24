'use client';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector } from '@/lib/store';
import { tokenStorage } from '@/lib/storage';

export function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Fallback: check token in storage in case Redux state hasn't rehydrated yet
    const hasToken = isAuthenticated || Boolean(tokenStorage.getAccessToken());
    if (!hasToken) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, router]);

  if (!checked) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress size={36} />
      </Box>
    );
  }

  return <>{children}</>;
}
