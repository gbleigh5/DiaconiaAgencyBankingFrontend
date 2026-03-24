'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { authClient } from '@/lib/api/auth-client';
import { tokenStorage } from '@/lib/storage';
import { useAppDispatch } from '@/lib/store';
import { setCredentials } from '@/lib/store/authSlice';

const credentialsSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const otpSchema = z.object({
  code: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain digits only'),
});

type CredentialsValues = z.infer<typeof credentialsSchema>;
type OtpValues = z.infer<typeof otpSchema>;

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [stage, setStage] = useState<'credentials' | 'otp'>('credentials');
  const [otpReference, setOtpReference] = useState('');
  const [otpUsername, setOtpUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const credentialsForm = useForm<CredentialsValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { username: '', password: '' },
  });

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: '' },
  });

  async function onCredentialsSubmit(values: CredentialsValues) {
    setError('');
    try {
      const { data } = await authClient.login({ username: values.username, password: values.password });
      if (data.access) {
        tokenStorage.setTokens(data.access, data.refresh);
        dispatch(setCredentials({ access: data.access, refresh: data.refresh, user: { username: values.username, role: 'Agent' } }));
        router.push('/dashboard');
        return;
      }
      setOtpReference(data.challenge.reference);
      setOtpUsername(values.username);
      setStage('otp');
    } catch {
      setError('Invalid credentials. Please check your username and password.');
    }
  }

  async function onOtpSubmit(values: OtpValues) {
    setError('');
    try {
      const { data } = await authClient.verifyOtp({ reference: otpReference, code: values.code });
      tokenStorage.setTokens(data.access, data.refresh);
      dispatch(setCredentials({ access: data.access, refresh: data.refresh, user: { username: otpUsername, role: 'Agent' } }));
      router.push('/dashboard');
    } catch {
      setError('Invalid or expired OTP. Please try again.');
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      {/* Left brand panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '45%',
          flexShrink: 0,
          background: 'linear-gradient(145deg, #0B2447 0%, #1B4F8A 60%, #0F2D5A 100%)',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)', top: -100, right: -100 }} />
        <Box sx={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)', bottom: -200, left: -200 }} />

        <Box sx={{ position: 'relative', textAlign: 'center', maxWidth: 380 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#C8962C' }}>D</Typography>
          </Box>
          <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 1.5 }}>
            Diaconia MDI
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
            Secure agency banking portal for microfinance operations. Fast, reliable, and always accessible.
          </Typography>

          <Box sx={{ mt: 6, display: 'grid', gap: 2 }}>
            {[
              { label: 'Secure Transactions', desc: 'End-to-end encrypted operations' },
              { label: 'OTP Verification', desc: 'Two-factor authentication for safety' },
              { label: 'Offline Support', desc: 'Works even without internet connection' },
            ].map((feature) => (
              <Box
                key={feature.label}
                sx={{
                  textAlign: 'left',
                  bgcolor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 2,
                  px: 2.5,
                  py: 1.75,
                }}
              >
                <Typography variant="body2" sx={{ color: '#C8962C', fontWeight: 600, mb: 0.25 }}>
                  {feature.label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)' }}>
                  {feature.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { md: 'none' }, textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" fontWeight={700} color="primary">
              Diaconia MDI
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Agency Banking Portal
            </Typography>
          </Box>

          <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: '1px solid', borderColor: 'divider' }}>
            {stage === 'credentials' ? (
              <>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Welcome back
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Sign in to your agent account to continue
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                <Box
                  component="form"
                  onSubmit={credentialsForm.handleSubmit(onCredentialsSubmit)}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
                  noValidate
                >
                  <TextField
                    {...credentialsForm.register('username')}
                    label="Username"
                    autoComplete="username"
                    autoFocus
                    fullWidth
                    error={Boolean(credentialsForm.formState.errors.username)}
                    helperText={credentialsForm.formState.errors.username?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    {...credentialsForm.register('password')}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    fullWidth
                    error={Boolean(credentialsForm.formState.errors.password)}
                    helperText={credentialsForm.formState.errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((v) => !v)}
                            edge="end"
                            size="small"
                            tabIndex={-1}
                          >
                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={credentialsForm.formState.isSubmitting}
                    sx={{ mt: 0.5 }}
                  >
                    {credentialsForm.formState.isSubmitting ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      'Continue'
                    )}
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => { setStage('credentials'); setError(''); otpForm.reset(); }}
                  size="small"
                  color="inherit"
                  sx={{ mb: 2, ml: -1, color: 'text.secondary' }}
                >
                  Back
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{ width: 44, height: 44, bgcolor: 'primary.main', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <KeyIcon sx={{ color: '#C8962C' }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>Verify OTP</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Enter the 6-digit code sent to your registered phone
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {error && (
                  <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                <Box
                  component="form"
                  onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
                  noValidate
                >
                  <TextField
                    {...otpForm.register('code')}
                    label="OTP Code"
                    placeholder="000000"
                    autoFocus
                    fullWidth
                    inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
                    error={Boolean(otpForm.formState.errors.code)}
                    helperText={otpForm.formState.errors.code?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={otpForm.formState.isSubmitting}
                  >
                    {otpForm.formState.isSubmitting ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      'Verify & Sign In'
                    )}
                  </Button>
                </Box>
              </>
            )}
          </Paper>

          <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 3 }}>
            Diaconia Microfinance Institution · Secure Banking
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
