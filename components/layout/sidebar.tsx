'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { alpha } from '@mui/material/styles';
import { useAppSelector } from '@/lib/store';

export const SIDEBAR_WIDTH = 256;

const navSections = [
  {
    label: 'Main',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
      { href: '/customers', label: 'Customers', icon: PeopleIcon },
    ],
  },
  {
    label: 'Transactions',
    items: [
      { href: '/transactions/deposit', label: 'Deposit', icon: AddCircleOutlineIcon },
      { href: '/transactions/withdraw', label: 'Withdraw', icon: RemoveCircleOutlineIcon },
      { href: '/transactions/transfer', label: 'Transfer', icon: CompareArrowsIcon },
    ],
  },
  {
    label: 'Management',
    items: [
      { href: '/account-opening', label: 'Account Opening', icon: PersonAddIcon },
      { href: '/audit', label: 'Audit Logs', icon: ReceiptLongIcon },
    ],
  },
];

interface SidebarContentProps {
  onClose?: () => void;
}

function SidebarContent({ onClose }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Logo / Brand */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: `1px solid ${alpha('#FFFFFF', 0.08)}`,
          flexShrink: 0,
        }}
      >
        <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.125rem' }}>
          Diaconia MDI
        </Typography>
        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5), letterSpacing: '0.05em' }}>
          Agency Banking Portal
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1.5, px: 1.5 }}>
        {navSections.map((section, sIdx) => (
          <Box key={section.label} sx={{ mb: sIdx < navSections.length - 1 ? 1 : 0 }}>
            <List
              subheader={
                <ListSubheader disableSticky component="div" sx={{ px: 1 }}>
                  {section.label}
                </ListSubheader>
              }
              disablePadding
            >
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <ListItem key={item.href} disablePadding>
                    <ListItemButton
                      component={Link}
                      href={item.href}
                      selected={active}
                      onClick={onClose}
                      sx={{ px: 1.5, py: 1 }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Icon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400 }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
            {sIdx < navSections.length - 1 && (
              <Divider sx={{ borderColor: alpha('#FFFFFF', 0.06), my: 1 }} />
            )}
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderTop: `1px solid ${alpha('#FFFFFF', 0.08)}`,
          flexShrink: 0,
        }}
      >
        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.35) }}>
          © {new Date().getFullYear()} Diaconia MDI
        </Typography>
      </Box>
    </Box>
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <SidebarContent onClose={onMobileClose} />
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          display: { xs: 'none', lg: 'block' },
          width: sidebarOpen ? SIDEBAR_WIDTH : 0,
          flexShrink: 0,
          transition: 'width 0.2s ease',
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            transition: 'transform 0.2s ease',
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </>
  );
}
