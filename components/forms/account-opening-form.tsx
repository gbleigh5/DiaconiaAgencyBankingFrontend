'use client';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { customersClient } from '@/lib/api/customers-client';
import { queueOfflineAction } from '@/lib/offline';
import { useAppDispatch } from '@/lib/store';
import { showSnackbar } from '@/lib/store/uiSlice';

const schema = z.object({
  account_number: z
    .string()
    .min(10, 'Account number must be 10 digits')
    .max(10, 'Account number must be 10 digits')
    .regex(/^\d+$/, 'Account number must contain digits only'),
  first_name: z.string().min(2, 'First name must be at least 2 characters').max(50),
  last_name: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  phone_number: z
    .string()
    .regex(
      /^(\+?234|0)[789][01]\d{8}$/,
      'Enter a valid Nigerian phone number (e.g. 08012345678)'
    ),
});

type FormValues = z.infer<typeof schema>;

export function AccountOpeningForm() {
  const dispatch = useAppDispatch();
  const offlineRef = useRef(crypto.randomUUID());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    const payload = {
      customer: {
        account_number: values.account_number,
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
      },
      offline_reference: offlineRef.current,
      status: navigator.onLine ? 'submitted' : 'queued',
    };

    if (!navigator.onLine) {
      await queueOfflineAction({ type: 'account-opening', payload });
      dispatch(showSnackbar({ message: 'Saved offline — will sync when connectivity returns.', severity: 'warning' }));
      return;
    }

    await customersClient.createAccountOpening(payload);

    dispatch(showSnackbar({ message: 'Account opening request submitted successfully.', severity: 'success' }));
    offlineRef.current = crypto.randomUUID();
    reset();
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Account Opening
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete the form below to initiate a new customer account opening request.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <AccountBalanceIcon color="primary" />
            <Typography variant="h5" fontWeight={600}>
              Customer Information
            </Typography>
            {!navigator.onLine && (
              <Chip
                icon={<WifiOffIcon sx={{ fontSize: 14 }} />}
                label="Offline mode"
                size="small"
                color="warning"
                sx={{ ml: 'auto' }}
              />
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Grid container spacing={2.5}>
              <Grid size={12}>
                <TextField
                  {...register('account_number')}
                  label="Proposed Account Number"
                  fullWidth
                  error={Boolean(errors.account_number)}
                  helperText={errors.account_number?.message ?? 'Enter the 10-digit NUBAN account number'}
                  inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...register('first_name')}
                  label="First Name"
                  fullWidth
                  error={Boolean(errors.first_name)}
                  helperText={errors.first_name?.message}
                  autoCapitalize="words"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...register('last_name')}
                  label="Last Name"
                  fullWidth
                  error={Boolean(errors.last_name)}
                  helperText={errors.last_name?.message}
                  autoCapitalize="words"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  {...register('phone_number')}
                  label="Phone Number"
                  fullWidth
                  error={Boolean(errors.phone_number)}
                  helperText={errors.phone_number?.message ?? 'Nigerian number, e.g. 08012345678'}
                  inputProps={{ inputMode: 'tel' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {isSubmitSuccessful && (
              <Alert
                icon={<CheckCircleOutlineIcon />}
                severity="success"
                sx={{ mt: 3 }}
              >
                Account opening request submitted. The customer will be notified.
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => reset()}
                disabled={isSubmitting}
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ minWidth: 160 }}
              >
                {isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : navigator.onLine ? (
                  'Submit Request'
                ) : (
                  'Save Offline'
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
