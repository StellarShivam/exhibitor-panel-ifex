'use client';

import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { AlertColor } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN, BASE_URL } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFPhoneField, RHFOTPField } from 'src/components/hook-form';
import axios, { apiEndpoints } from 'src/utils/axios';

const fontFamily = "'Poppins', sans-serif";

// ----------------------------------------------------------------------

export default function JwtLoginViewAdmin() {
  const { login } = useAuthContext();
  const router = useRouter();
  // const [errorMsg, setErrorMsg] = useState('');
  // const [successMsg, setSuccessMsg] = useState('');

  const [message, setMessage] = useState({
    type: '',
    msg: '',
  });
  const password = useBoolean();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const LoginSchema = Yup.object().shape({
    type: Yup.string().required('Select login method'),
    email: Yup.string().when('type', {
      is: 'Email',
      then: (schema) => schema.email('Enter valid email').required('Email is required'),
      otherwise: (schema) => schema.optional(),
    }),
    mobile: Yup.string().when('type', {
      is: 'Phone',
      then: (schema) =>
        schema.min(4, 'Enter valid mobile number').required('Mobile number is required'),
      otherwise: (schema) => schema.optional(),
    }),
  });

  const defaultValues = {
    email: '',
    mobile: '',
    type: 'Phone',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
    setValue,
    resetField,
  } = methods;

  const sendOtp = async () => {
    setIsLoading(true);
    const data: any = {};
    if (watch('type') === 'Email') {
      data.username = watch('email');
    } else {
      data.username = watch('mobile');
    }

    console.log(data);

    try {
      const res = await axios.post(`${BASE_URL}${apiEndpoints.auth.sendOtp}`, data);
      console.log(res);
      setMessage({
        type: 'success',
        msg: res.data.msg || res.data.message,
      });
      setOtpSent(true);
      setCountdown(30);
    } catch (error: any) {
      console.error(error);
      setMessage({
        type: 'error',
        msg: typeof error === 'string' ? error : error?.response?.data?.msg || error?.message || 'Failed to send OTP',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  useEffect(() => {
    if (watch('type') === 'Email') {
      resetField('mobile');
    } else {
      resetField('email');
    }
  }, [watch('type'), resetField]);

  const handleResendOtp = () => {
    if (countdown === 0) {
      sendOtp();
    }
  };

  const tryAnotherMethod = (type: string) => {
    resetField('email');
    resetField('mobile');
    if (type === 'Email') {
      setOtpSent(false);
      setOtp('');
      setCountdown(0);
      setMessage({ type: '', msg: '' });
      setValue('type', 'Phone');
    }
    if (type === 'Phone') {
      setOtpSent(false);
      setOtp('');
      setCountdown(0);
      setMessage({ type: '', msg: '' });
      setValue('type', 'Email');
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log('data', data);
    console.log('otp', otp);
    try {
      if (data.type === 'Email') {
        await login?.(data.email, '', otp, true);
      } else {
        await login?.('', data.mobile, otp, true);
      }
      router.push(PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      setMessage({
        type: 'error',
        msg: typeof error === 'string' ? error : error.message,
      });
    }
  });

  console.log(errors);
  console.log(watch('type'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {/* Left Section with Background */}
      <Box
        sx={{
          flex: { xs: 0, md: 1 },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          overflow: 'hidden',
          m: 2,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/IFEX_bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, #FC5A39 0%, rgba(0, 0, 0, 0.9) 100%)',
            opacity: 0.95,
            zIndex: 1,
          },
        }}
      >
        {/* Content wrapper to ensure content stays above the overlay */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            p: 4,
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src="/IFEX_logo1.png"
            alt="IFEX Logo"
            sx={{
              width: { xs: '120px', md: '180px', lg: '220px' },
              height: 'auto',
              mb: 'auto',
            }}
          />

          {/* Title Section */}
          <Box sx={{ mb: 3, mt: { xs: 6, md: 0 } }}>
            <Typography
              sx={{
                color: 'white',
                fontWeight: 600,
                fontSize: { xs: '26px', md: '36px', lg: '46px' },
                // mb: 2,
                // lineHeight: 1.2,
              }}
            >
              IFEX Control Hub
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'white',
                opacity: 0.9,
                fontSize: { xs: '0.6rem', md: '0.8rem', lg: '1.1rem' },
                // borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                pt: 0,
              }}
            >
              Your control centre for workforce insights & operations.
            </Typography>
          </Box>

          {/* Footer */}
          {/* <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(255, 255, 255, 0.6)',
              pt: 2,
            }}
          >
            <Link
              href="#"
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontSize: { xs: '0.6rem', md: '0.6rem', lg: '0.9rem' },
                opacity: 0.8,
                '&:hover': {
                  opacity: 1,
                  textDecoration: 'underline',
                },
              }}
            >
              Privacy Policy
            </Link>
            <Typography
              sx={{
                color: 'white',
                fontSize: { xs: '0.6rem', md: '0.6rem', lg: '0.9rem' },
                opacity: 0.8,
              }}
            >
              Copyright 2025
            </Typography>
          </Box> */}
        </Box>
      </Box>

      {/* Right Section with Login Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          bgcolor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Box
          sx={{
            maxWidth: 450,
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.08)',
            p: { xs: 2, md: 3, lg: 4 },
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Sign in
          </Typography>

          {message.type && message.msg && (
            <Alert severity={message.type as AlertColor} sx={{ mb: 1 }}>
              {message.msg}
            </Alert>
          )}

          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>
              <Controller
                name="type"
                control={methods.control}
                render={({ field: controllerField }) => (
                  <FormControl component="fieldset" fullWidth disabled={otpSent}>
                    <FormLabel>Select Login Method</FormLabel>
                    <RadioGroup
                      value={controllerField.value || ''}
                      onChange={(e) => controllerField.onChange(e.target.value)}
                    >
                      <Grid container spacing={0.5} sx={{ pl: 1 }}>
                        {['Phone', 'Email'].map((option: string) => (
                          <Grid key={option} xs={6} md={6}>
                            <FormControlLabel value={option} control={<Radio />} label={option} />
                          </Grid>
                        ))}
                      </Grid>
                    </RadioGroup>
                  </FormControl>
                )}
              />

              {watch('type') === 'Email' && (
                <RHFTextField
                  name="email"
                  label="Enter Email"
                  disabled={otpSent}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      // bgcolor: '#FFE8E5',
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: '#ffa206',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffa206',
                      },
                    },
                  }}
                />
              )}

              {watch('type') === 'Phone' && (
                <RHFPhoneField
                  name="mobile"
                  label="Enter Phone"
                  disabled={otpSent}
                  onlyCountries={['in']}
                  helperText="Only Indian numbers are allowed"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#FFE8E5',
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: '#ffa206',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffa206',
                      },
                    },
                  }}
                />
              )}

              {otpSent && (
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}
                >
                  <span>Enter OTP:</span>
                  <RHFOTPField
                    separator={<span>-</span>}
                    value={otp}
                    onChange={setOtp}
                    length={6}
                  />
                </Box>
              )}

              {/* <RHFTextField
                name="password"
                label="Password"
                type={password.value ? 'text' : 'password'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FFE8E5',
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: '#ffa206',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ffa206',
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'mdi:eye-off'}
                          sx={{ color: '#ffa206' }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              /> */}

              {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link
                  variant="body2"
                  href={paths.auth.jwt.forgotPassword}
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box> */}

              {!otpSent && (
                <LoadingButton
                  fullWidth
                  color="primary"
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isLoading}
                  disabled={
                    isSubmitting ||
                    !!errors.email ||
                    !!errors.mobile ||
                    (!watch('email') && !watch('mobile'))
                  }
                  onClick={() => sendOtp()}
                  sx={{
                    bgcolor: '#ffa206',
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: '#E63E20',
                    },
                    py: 1.5,
                    mt: 2,
                    boxShadow: '0px 4px 15px rgba(255, 68, 33, 0.6)',
                  }}
                >
                  Send OTP
                </LoadingButton>
              )}

              {otpSent && (
                <LoadingButton
                  fullWidth
                  color="primary"
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={otp.length !== 6}
                  loading={isSubmitting}
                  sx={{
                    bgcolor: '#ffa206',
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: '#E63E20',
                    },
                    py: 1.5,
                    mt: 2,
                    boxShadow: '0px 4px 15px rgba(255, 68, 33, 0.6)',
                  }}
                >
                  Verify OTP
                </LoadingButton>
              )}

              {otpSent && countdown > 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'center',
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                  }}
                >
                  Resend OTP in {countdown}s
                </Typography>
              )}

              {otpSent && countdown === 0 && (
                <Box
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}
                >
                  <Typography
                    variant="body2"
                    onClick={handleResendOtp}
                    sx={{
                      color: '#ffa206',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      '&:hover': {
                        color: '#E63E20',
                      },
                    }}
                  >
                    Resend OTP
                  </Typography>
                  {message.type === 'error' && (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                        }}
                      >
                        |
                      </Typography>
                      <Typography
                        variant="body2"
                        onClick={() => tryAnotherMethod(watch('type'))}
                        sx={{
                          color: '#ffa206',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          '&:hover': {
                            color: '#E63E20',
                          },
                        }}
                      >
                        {watch('type') === 'Email' ? 'Use Phone instead' : 'Use Email instead'}
                      </Typography>
                    </>
                  )}
                </Box>
              )}
            </Stack>
          </FormProvider>

          {/* <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Link
              href="#"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Need Help? Contact Support
            </Link>
          </Box> */}
        </Box>
      </Box>
    </Box>
  );
}
