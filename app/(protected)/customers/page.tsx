'use client';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { customersClient } from '@/lib/api/customers-client';

interface Customer {
  id: string | number;
  first_name: string;
  last_name: string;
  account_number: string;
  phone_number: string;
  status?: string;
}

function SkeletonRows() {
  return Array.from({ length: 6 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton variant="circular" width={36} height={36} /></TableCell>
      <TableCell><Skeleton variant="text" width={160} /></TableCell>
      <TableCell><Skeleton variant="text" width={120} /></TableCell>
      <TableCell><Skeleton variant="text" width={130} /></TableCell>
      <TableCell><Skeleton variant="rounded" width={70} height={24} /></TableCell>
    </TableRow>
  ));
}

export default function CustomersPage() {
  const { data, isLoading, error } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => (await customersClient.list()).data,
  });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Customers
        </Typography>
        <Typography variant="body2" color="text.secondary">
          All customers registered through this agency.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load customers. Please try again.
        </Alert>
      )}

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Account Number</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <SkeletonRows />
              ) : data && data.length > 0 ? (
                data.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.light', fontSize: '0.875rem' }}>
                        {customer.first_name?.[0]?.toUpperCase()}
                        {customer.last_name?.[0]?.toUpperCase()}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {customer.first_name} {customer.last_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {customer.account_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{customer.phone_number}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={customer.status ?? 'Active'}
                        size="small"
                        color={customer.status === 'queued' ? 'warning' : 'success'}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No customers found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
