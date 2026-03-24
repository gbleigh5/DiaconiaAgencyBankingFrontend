'use client';
import { createTheme, alpha } from '@mui/material/styles';

const NAVY = '#0B2447';
const GOLD = '#C8962C';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: NAVY,
      light: '#1B4F8A',
      dark: '#071729',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: GOLD,
      light: '#D4AB50',
      dark: '#9B7020',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F6F9',
      paper: '#FFFFFF',
    },
    success: { main: '#2E7D32', light: '#4CAF50', dark: '#1B5E20' },
    error: { main: '#C62828', light: '#EF5350', dark: '#B71C1C' },
    warning: { main: '#E65100', light: '#FF7043', dark: '#BF360C' },
    info: { main: '#0277BD', light: '#0288D1', dark: '#01579B' },
    text: {
      primary: '#1A1A2E',
      secondary: '#546E7A',
      disabled: '#90A4AE',
    },
    divider: 'rgba(0,0,0,0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", "Arial", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.25rem', fontWeight: 600 },
    h4: { fontSize: '1.125rem', fontWeight: 600 },
    h5: { fontSize: '1rem', fontWeight: 600 },
    h6: { fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', letterSpacing: '0.02em' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
    overline: { textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, fontSize: '0.75rem' },
  },
  shape: { borderRadius: 8 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    '0 2px 6px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
    '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
    '0 6px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
    '0 8px 20px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)',
    '0 10px 24px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04)',
    '0 12px 28px rgba(0,0,0,0.08), 0 6px 12px rgba(0,0,0,0.04)',
    '0 14px 32px rgba(0,0,0,0.10), 0 6px 14px rgba(0,0,0,0.06)',
    '0 16px 36px rgba(0,0,0,0.10), 0 8px 16px rgba(0,0,0,0.06)',
    '0 18px 40px rgba(0,0,0,0.10), 0 8px 18px rgba(0,0,0,0.06)',
    '0 20px 44px rgba(0,0,0,0.12), 0 10px 20px rgba(0,0,0,0.06)',
    '0 22px 48px rgba(0,0,0,0.12), 0 10px 22px rgba(0,0,0,0.06)',
    '0 24px 52px rgba(0,0,0,0.12), 0 12px 24px rgba(0,0,0,0.06)',
    '0 26px 56px rgba(0,0,0,0.14), 0 12px 26px rgba(0,0,0,0.08)',
    '0 28px 60px rgba(0,0,0,0.14), 0 14px 28px rgba(0,0,0,0.08)',
    '0 30px 64px rgba(0,0,0,0.14), 0 14px 30px rgba(0,0,0,0.08)',
    '0 32px 68px rgba(0,0,0,0.16), 0 16px 32px rgba(0,0,0,0.08)',
    '0 34px 72px rgba(0,0,0,0.16), 0 16px 34px rgba(0,0,0,0.08)',
    '0 36px 76px rgba(0,0,0,0.16), 0 18px 36px rgba(0,0,0,0.10)',
    '0 38px 80px rgba(0,0,0,0.18), 0 18px 38px rgba(0,0,0,0.10)',
    '0 40px 84px rgba(0,0,0,0.18), 0 20px 40px rgba(0,0,0,0.10)',
    '0 42px 88px rgba(0,0,0,0.20), 0 20px 42px rgba(0,0,0,0.10)',
    '0 44px 92px rgba(0,0,0,0.20), 0 22px 44px rgba(0,0,0,0.12)',
    '0 48px 96px rgba(0,0,0,0.22), 0 24px 48px rgba(0,0,0,0.12)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { background-color: #F4F6F9; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #F1F1F1; }
        ::-webkit-scrollbar-thumb { background: #BDBDBD; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #9E9E9E; }
      `,
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, padding: '10px 24px', fontSize: '0.9375rem', minHeight: 44 },
        containedPrimary: {
          background: `linear-gradient(135deg, #1B4F8A 0%, ${NAVY} 100%)`,
          '&:hover': { background: `linear-gradient(135deg, #245DAA 0%, #0F2D5A 100%)`, boxShadow: `0 4px 12px ${alpha(NAVY, 0.4)}` },
          '&:active': { background: `linear-gradient(135deg, ${NAVY} 0%, #071729 100%)` },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${GOLD} 0%, #9B7020 100%)`,
          '&:hover': { background: `linear-gradient(135deg, #D4AB50 0%, ${GOLD} 100%)` },
        },
        outlined: { borderWidth: 1.5, '&:hover': { borderWidth: 1.5 } },
        sizeLarge: { padding: '12px 32px', fontSize: '1rem', minHeight: 52 },
        sizeSmall: { padding: '6px 16px', fontSize: '0.8125rem', minHeight: 36 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: NAVY },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2 },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: NAVY },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: { root: { padding: '24px', '&:last-child': { paddingBottom: '24px' } } },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        elevation1: { boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' },
        rounded: { borderRadius: 12 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: NAVY,
          color: '#FFFFFF',
          border: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 2,
          color: alpha('#FFFFFF', 0.75),
          '& .MuiListItemIcon-root': { color: alpha('#FFFFFF', 0.6), minWidth: 40 },
          '&.Mui-selected': {
            backgroundColor: alpha('#FFFFFF', 0.15),
            color: '#FFFFFF',
            '& .MuiListItemIcon-root': { color: GOLD },
            '&:hover': { backgroundColor: alpha('#FFFFFF', 0.2) },
          },
          '&:hover': { backgroundColor: alpha('#FFFFFF', 0.08), color: '#FFFFFF' },
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          color: alpha('#FFFFFF', 0.4),
          fontSize: '0.6875rem',
          letterSpacing: '0.1em',
          fontWeight: 600,
          textTransform: 'uppercase',
          lineHeight: '32px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 500 },
        colorSuccess: { backgroundColor: alpha('#2E7D32', 0.1), color: '#2E7D32' },
        colorError: { backgroundColor: alpha('#C62828', 0.1), color: '#C62828' },
        colorWarning: { backgroundColor: alpha('#E65100', 0.1), color: '#E65100' },
        colorInfo: { backgroundColor: alpha('#0277BD', 0.1), color: '#0277BD' },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: '#F4F6F9',
            color: '#546E7A',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '12px 16px' },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: alpha(NAVY, 0.02) },
          '&:last-child .MuiTableCell-root': { borderBottom: 'none' },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8, alignItems: 'flex-start' },
        standardSuccess: { backgroundColor: alpha('#2E7D32', 0.08), color: '#1B5E20' },
        standardError: { backgroundColor: alpha('#C62828', 0.08), color: '#B71C1C' },
        standardWarning: { backgroundColor: alpha('#E65100', 0.08), color: '#BF360C' },
        standardInfo: { backgroundColor: alpha('#0277BD', 0.08), color: '#01579B' },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 16 } },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        tooltip: { backgroundColor: '#1A1A2E', borderRadius: 6, fontSize: '0.75rem' },
        arrow: { color: '#1A1A2E' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 4, height: 6 } },
    },
    MuiSkeleton: {
      defaultProps: { animation: 'wave' },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: 'rgba(0,0,0,0.06)' } },
    },
  },
});

export default theme;
