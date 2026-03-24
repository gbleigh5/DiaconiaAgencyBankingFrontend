import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleIcon from '@mui/icons-material/People';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import Link from 'next/link';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const stats = [
  {
    label: 'Total Customers',
    value: '—',
    icon: PeopleIcon,
    color: '#0B2447',
    bgColor: 'rgba(11,36,71,0.08)',
    href: '/customers',
  },
  {
    label: "Today's Deposits",
    value: '—',
    icon: TrendingUpIcon,
    color: '#2E7D32',
    bgColor: 'rgba(46,125,50,0.08)',
    href: '/transactions/deposit',
  },
  {
    label: "Today's Withdrawals",
    value: '—',
    icon: TrendingDownIcon,
    color: '#E65100',
    bgColor: 'rgba(230,81,0,0.08)',
    href: '/transactions/withdraw',
  },
  {
    label: "Today's Transfers",
    value: '—',
    icon: CompareArrowsIcon,
    color: '#0277BD',
    bgColor: 'rgba(2,119,189,0.08)',
    href: '/transactions/transfer',
  },
];

const quickActions = [
  { label: 'Deposit', href: '/transactions/deposit', color: 'success' as const },
  { label: 'Withdraw', href: '/transactions/withdraw', color: 'warning' as const },
  { label: 'Transfer', href: '/transactions/transfer', color: 'info' as const },
  { label: 'Open Account', href: '/account-opening', color: 'primary' as const },
];

export default function DashboardPage() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back. Here is an overview of your agency banking activity.
        </Typography>
      </Box>

      {/* Stats cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid key={stat.label} size={{ xs: 12, sm: 6, xl: 3 }}>
              <Card
                sx={{
                  '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s ease' },
                  transition: 'transform 0.2s ease',
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: stat.bgColor,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ color: stat.color, fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="text.primary">
                      {stat.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={2.5}>
        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    component={Link}
                    href={action.href}
                    variant="outlined"
                    color={action.color}
                    endIcon={<ArrowForwardIcon />}
                    fullWidth
                    sx={{ justifyContent: 'space-between', py: 1.25 }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Info panel */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                About This Portal
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Use this agency banking portal to process cash deposits, withdrawals, and inter-bank
                transfers on behalf of customers. All transactions require OTP verification for
                security. Account opening requests can be submitted online or queued for offline
                processing.
              </Typography>
              <Box
                sx={{
                  mt: 2.5,
                  p: 2,
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 1 }}>
                  SUPPORT & HELPDESK
                </Typography>
                <Typography variant="body2">
                  For technical issues or transaction disputes, contact your branch supervisor or
                  reach the IT helpdesk via the internal communication portal.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
