'use client';
import { useState } from 'react';
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
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Chip from '@mui/material/Chip';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import KeyIcon from '@mui/icons-material/Key';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrintIcon from '@mui/icons-material/Print';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { transactionsClient } from '@/lib/api/transactions-client';
import { printReceipt } from '@/lib/bluetooth-printer';
import { useAppDispatch } from '@/lib/store';
import { showSnackbar } from '@/lib/store/uiSlice';

type TransactionMode = 'deposit' | 'withdraw' | 'transfer';

const modeConfig = {
  deposit: {
    title: 'Cash Deposit',
    icon: AttachMoneyIcon,
    color: 'success' as const,
    steps: ['Account Details', 'Amount & OTP', 'Confirm'],
  },
  withdraw: {
    title: 'Cash Withdrawal',
    icon: AccountBalanceWalletIcon,
    color: 'warning' as const,
    steps: ['Account Details', 'Amount & OTP', 'Confirm'],
  },
  transfer: {
    title: 'Fund Transfer',
    icon: CompareArrowsIcon,
    color: 'info' as const,
    steps: ['Accounts', 'Amount & OTP', 'Confirm'],
  },
};

function buildSchema(mode: TransactionMode) {
  return z.object({
    customer_account_number: z
      .string()
      .min(10, 'Account number must be 10 digits')
      .max(10, 'Account number must be 10 digits')
      .regex(/^\d+$/, 'Must contain digits only'),
    beneficiary_account_number:
      mode === 'transfer'
        ? z
            .string()
            .min(10, 'Beneficiary account must be 10 digits')
            .max(10, 'Beneficiary account must be 10 digits')
            .regex(/^\d+$/, 'Must contain digits only')
        : z.string().optional(),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount (e.g. 5000 or 5000.00)')
      .refine((v) => parseFloat(v) > 0, 'Amount must be greater than zero'),
    narration: z.string().min(1, 'Narration is required').max(100, 'Maximum 100 characters'),
    otp_code: z
      .string()
      .length(6, 'OTP must be exactly 6 digits')
      .regex(/^\d+$/, 'OTP must contain digits only'),
  });
}

type FormValues = {
  customer_account_number: string;
  beneficiary_account_number?: string;
  amount: string;
  narration: string;
  otp_code: string;
};

interface TransactionResult {
  transaction_type: string;
  amount: string | number;
  fee_amount: string | number;
  reference: string;
}

interface TransactionFormProps {
  mode: TransactionMode;
}

export function TransactionForm({ mode }: TransactionFormProps) {
  const dispatch = useAppDispatch();
  const config = modeConfig[mode];
  const ModeIcon = config.icon;
  const [activeStep, setActiveStep] = useState(0);
  const [otpReference, setOtpReference] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(buildSchema(mode)),
    defaultValues: {
      customer_account_number: '',
      beneficiary_account_number: '',
      amount: '',
      narration: '',
      otp_code: '',
    },
  });

  const customerAccount = watch('customer_account_number');

  async function handleSendOtp() {
    const valid = await trigger('customer_account_number');
    if (!valid) return;
    setSendingOtp(true);
    try {
      const { data } = await transactionsClient.sendOtp(customerAccount);
      setOtpReference(data.reference);
      setOtpSent(true);
      dispatch(showSnackbar({ message: 'OTP sent to registered phone number.', severity: 'info' }));
    } catch {
      dispatch(showSnackbar({ message: 'Failed to send OTP. Check the account number.', severity: 'error' }));
    } finally {
      setSendingOtp(false);
    }
  }

  async function goToStep2() {
    const fields: Array<keyof FormValues> =
      mode === 'transfer'
        ? ['customer_account_number', 'beneficiary_account_number']
        : ['customer_account_number'];
    const valid = await trigger(fields);
    if (valid) setActiveStep(1);
  }

  async function onSubmit(values: FormValues) {
    setSubmitError('');
    try {
      const payload: Record<string, unknown> = {
        customer_account_number: values.customer_account_number,
        amount: values.amount,
        otp_reference: otpReference,
        otp_code: values.otp_code,
        narration: values.narration,
      };
      if (mode === 'transfer') payload.beneficiary_account_number = values.beneficiary_account_number;

      const { data } =
        mode === 'deposit'
          ? await transactionsClient.deposit(payload)
          : mode === 'withdraw'
          ? await transactionsClient.withdraw(payload)
          : await transactionsClient.transfer(payload);

      setResult(data as TransactionResult);
      setActiveStep(2);

      await printReceipt(
        `Diaconia MDI\nType: ${data.transaction_type}\nAmount: ₦${data.amount}\nFee: ₦${data.fee_amount}\nRef: ${data.reference}`
      );
    } catch {
      setSubmitError('Transaction failed. Please verify the OTP and try again.');
    }
  }

  if (result) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            {config.title}
          </Typography>
        </Box>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <CheckCircleIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Transaction Successful
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              The {mode} transaction has been processed successfully.
            </Typography>

            <Box
              sx={{
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 3,
                maxWidth: 360,
                mx: 'auto',
                textAlign: 'left',
              }}
            >
              {[
                { label: 'Transaction Type', value: result.transaction_type },
                { label: 'Amount', value: `₦${Number(result.amount).toLocaleString()}` },
                { label: 'Fee', value: `₦${Number(result.fee_amount).toLocaleString()}` },
                { label: 'Reference', value: result.reference },
              ].map((row) => (
                <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {row.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {row.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={() =>
                  printReceipt(
                    `Diaconia MDI\nType: ${result.transaction_type}\nAmount: ₦${result.amount}\nFee: ₦${result.fee_amount}\nRef: ${result.reference}`
                  )
                }
              >
                Reprint Receipt
              </Button>
              <Button
                variant="contained"
                onClick={() => { setResult(null); setActiveStep(0); setOtpSent(false); setOtpReference(''); }}
              >
                New Transaction
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <ModeIcon color={config.color} />
          <Typography variant="h3" fontWeight={700}>
            {config.title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Complete all steps to process this {mode} transaction.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {config.steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Step 0: Account details */}
            {activeStep === 0 && (
              <Grid container spacing={2.5}>
                <Grid size={12}>
                  <TextField
                    {...register('customer_account_number')}
                    label="Customer Account Number"
                    fullWidth
                    inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                    error={Boolean(errors.customer_account_number)}
                    helperText={errors.customer_account_number?.message ?? '10-digit NUBAN account number'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountBalanceWalletIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {mode === 'transfer' && (
                  <Grid size={12}>
                    <TextField
                      {...register('beneficiary_account_number')}
                      label="Beneficiary Account Number"
                      fullWidth
                      inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                      error={Boolean(errors.beneficiary_account_number)}
                      helperText={errors.beneficiary_account_number?.message ?? '10-digit beneficiary NUBAN'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SwapHorizIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                )}

                <Grid size={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={goToStep2} sx={{ minWidth: 140 }}>
                      Next
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}

            {/* Step 1: Amount + OTP */}
            {activeStep === 1 && (
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    {...register('amount')}
                    label="Amount (₦)"
                    fullWidth
                    inputProps={{ inputMode: 'decimal' }}
                    error={Boolean(errors.amount)}
                    helperText={errors.amount?.message}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₦</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    {...register('narration')}
                    label="Narration / Description"
                    fullWidth
                    error={Boolean(errors.narration)}
                    helperText={errors.narration?.message ?? 'Brief description of this transaction'}
                  />
                </Grid>

                <Grid size={12}>
                  <Divider sx={{ my: 0.5 }}>
                    <Chip label="OTP Verification" size="small" />
                  </Divider>
                </Grid>

                <Grid size={12}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <TextField
                      {...register('otp_code')}
                      label="OTP Code"
                      fullWidth
                      inputProps={{ maxLength: 6, inputMode: 'numeric' }}
                      error={Boolean(errors.otp_code)}
                      helperText={
                        errors.otp_code?.message ??
                        (otpSent ? 'OTP sent — check registered phone' : 'Click "Send OTP" first')
                      }
                      disabled={!otpSent}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <KeyIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleSendOtp}
                      disabled={sendingOtp || !customerAccount}
                      sx={{ flexShrink: 0, minWidth: 120, height: 56 }}
                    >
                      {sendingOtp ? <CircularProgress size={18} /> : otpSent ? 'Resend OTP' : 'Send OTP'}
                    </Button>
                  </Box>
                </Grid>

                {submitError && (
                  <Grid size={12}>
                    <Alert severity="error" onClose={() => setSubmitError('')}>
                      {submitError}
                    </Alert>
                  </Grid>
                )}

                <Grid size={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                    <Button variant="outlined" color="inherit" onClick={() => setActiveStep(0)}>
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color={config.color}
                      disabled={isSubmitting || !otpSent}
                      startIcon={isSubmitting ? undefined : <SendIcon />}
                      sx={{ minWidth: 160 }}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        `Submit ${mode.charAt(0).toUpperCase() + mode.slice(1)}`
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
