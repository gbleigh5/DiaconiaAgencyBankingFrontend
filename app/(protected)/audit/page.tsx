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
import { auditClient } from '@/lib/api/audit-client';

interface AuditLog {
  id: string | number;
  action: string;
  actor?: string;
  timestamp?: string;
  created_at?: string;
  status?: string;
  details?: string;
}

function SkeletonRows() {
  return Array.from({ length: 8 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton variant="text" width={80} /></TableCell>
      <TableCell><Skeleton variant="text" width={140} /></TableCell>
      <TableCell><Skeleton variant="text" width={120} /></TableCell>
      <TableCell><Skeleton variant="text" width={160} /></TableCell>
      <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
    </TableRow>
  ));
}

function formatTimestamp(ts?: string) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function AuditPage() {
  const { data, isLoading, error } = useQuery<AuditLog[]>({
    queryKey: ['audit'],
    queryFn: async () => (await auditClient.list()).data,
  });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Audit Logs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A full record of all actions performed on this portal.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load audit logs. Please try again.
        </Alert>
      )}

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Actor</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <SkeletonRows />
              ) : data && data.length > 0 ? (
                data.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Typography variant="caption" fontFamily="monospace" color="text.secondary">
                        #{log.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {log.action}
                      </Typography>
                      {log.details && (
                        <Typography variant="caption" color="text.secondary">
                          {log.details}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{log.actor ?? '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatTimestamp(log.timestamp ?? log.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.status ?? 'completed'}
                        size="small"
                        color={
                          log.status === 'failed'
                            ? 'error'
                            : log.status === 'pending'
                            ? 'warning'
                            : 'success'
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No audit logs found.
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
