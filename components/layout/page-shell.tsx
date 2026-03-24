'use client';
import { PropsWithChildren, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import ListItemIcon from '@mui/material/ListItemIcon';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import Chip from '@mui/material/Chip';
import { Sidebar, SIDEBAR_WIDTH } from './sidebar';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { toggleSidebar, hideSnackbar } from '@/lib/store/uiSlice';
import { logout } from '@/lib/store/authSlice';
import { tokenStorage } from '@/lib/storage';

export function PageShell({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const snackbar = useAppSelector((s) => s.ui.snackbar);
  const user = useAppSelector((s) => s.auth.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  function handleLogout() {
    tokenStorage.clear();
    dispatch(logout());
    router.replace('/login');
  }

  const mainMarginLeft = sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          ml: { lg: mainMarginLeft },
          transition: 'margin-left 0.2s ease',
        }}
      >
        {/* Top AppBar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: 'divider',
            zIndex: (t) => t.zIndex.drawer - 1,
          }}
        >
          <Toolbar sx={{ gap: 1 }}>
            {/* Mobile menu button */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              size="small"
              sx={{ display: { lg: 'none' }, mr: 0.5 }}
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop sidebar toggle */}
            <IconButton
              onClick={() => dispatch(toggleSidebar())}
              size="small"
              sx={{ display: { xs: 'none', lg: 'flex' }, mr: 0.5 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: 'primary.main', display: { xs: 'none', sm: 'block' } }}
            >
              Diaconia Agency Banking
            </Typography>

            <Box sx={{ flex: 1 }} />

            {/* Offline indicator */}
            {typeof window !== 'undefined' && !navigator.onLine && (
              <Chip
                icon={<WifiOffIcon sx={{ fontSize: 14 }} />}
                label="Offline"
                size="small"
                color="warning"
                sx={{ mr: 1 }}
              />
            )}

            {/* User avatar menu */}
            <Tooltip title="Account settings">
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size="small"
                sx={{ p: 0.5 }}
              >
                <Avatar
                  sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.875rem' }}
                >
                  {user?.username?.[0]?.toUpperCase() ?? 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* User menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{ paper: { elevation: 3, sx: { mt: 0.5, minWidth: 200, borderRadius: 2 } } }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" fontWeight={600}>{user?.username ?? 'Agent'}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.role ?? 'Field Agent'}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => setAnchorEl(null)} sx={{ gap: 1.5, py: 1.25 }}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.25, color: 'error.main' }}>
            <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
            Sign Out
          </MenuItem>
        </Menu>

        {/* Page content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, maxWidth: '100%', overflowX: 'hidden' }}>
          {children}
        </Box>
      </Box>

      {/* Global snackbar notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => dispatch(hideSnackbar())}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => dispatch(hideSnackbar())}
          severity={snackbar.severity}
          variant="filled"
          sx={{ minWidth: 280 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
