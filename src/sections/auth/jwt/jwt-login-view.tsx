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
import { useEventContext } from 'src/components/event-context';

const fontFamily = "'Poppins', sans-serif";

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();
  const router = useRouter();
  const { eventData } = useEventContext();
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
    type: 'Email',
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
      data.identifier = watch('email');
    } else {
      data.identifier = watch('mobile');
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
        msg:
          typeof error === 'string'
            ? error
            : error?.response?.data?.msg || error?.message || 'Failed to send OTP',
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
    let res;
    try {
      if (data.type === 'Email') {
        res = await login?.(data.email, '', otp);
      } else {
        res = await login?.('', data.mobile, otp);
      }
      eventData.setState({
        ...res?.data?.userInfo,
      });
      if( res?.data?.userInfo?.roles.length > 0 && res?.data?.userInfo?.roles?.includes('COUNCIL_BUYER')){
        router.push('/dashboard/buyer/OVERSEAS_BUYER');
        return;
      }
      router.push('/dashboard/overview');
    } catch (error) {
      console.error(error);
      setMessage({
        type: 'error',
        msg: typeof error === 'string' ? error : error.message,
      });
    }
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {/* Left Section with Image */}
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
            background: 'linear-gradient(180deg, #febd1f 0%, rgba(0, 0, 0, 0.8) 100%)',
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
            src="/IFEX_LOGO.png"
            alt="IFEX Logo"
            sx={{
              width: { xs: '120px', md: '100px' },
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

      {/* Right Section with Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          bgcolor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // p: { xs: 2, sm: 3, md: 4 },
          minHeight: 'auto',
        }}
      >
        <Box
          sx={{
            maxWidth: 480,
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '16px',
            px: { xs: 1.5, md: 2, lg: 3 },
            py: { xs: 2, md: 4, lg: 5 },
          }}
        >
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: 1,
              }}
            >
              Welcome to the IFEX Event <br /> Management Platform
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                textAlign: 'center',
              }}
            >
              Your control center for workforce insights and operations.
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
            Sign In
          </Typography>

          {message.type && message.msg && (
            <Alert severity={message.type as AlertColor} sx={{ mb: 1 }}>
              {message.msg}
            </Alert>
          )}

          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack spacing={1.5} sx={{ width: '100%' }}>
              <RHFTextField
                name="email"
                placeholder="Enter Your Email"
                disabled={otpSent}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: 'grey.100',
                    // '& fieldset': {
                    //   borderColor: 'transparent',
                    // },
                    // '&:hover fieldset': {
                    //   borderColor: 'grey.300',
                    // },
                    // '&.Mui-focused fieldset': {
                    //   borderColor: '#E91E8C',
                    // },
                  },
                  '& .MuiOutlinedInput-input': {
                    paddingY: '12px',
                  },
                }}
              />

              {otpSent && (
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}
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

              {!otpSent && (
                <LoadingButton
                  fullWidth
                  color="primary"
                  size="medium"
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
                  endIcon={<Iconify icon="eva:arrow-forward-fill" />}
                  sx={{
                    bgcolor: '#ffa206',
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: '#ffa206',
                    },
                    '&:disabled': {
                      bgcolor: 'grey.300',
                    },
                    py: 1,
                    mt: 0.25,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    boxShadow: 'none',
                  }}
                >
                  Send OTP
                </LoadingButton>
              )}

              {!otpSent && (
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'right',
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    mt: -1,
                  }}
                >
                  Need Help?{' '}
                  <Link
                    href="https://bharat-tex.com/contact-us/"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'underline',
                      '&:hover': {
                        color: 'text.primary',
                      },
                    }}
                  >
                    Contact IFEX Support
                  </Link>
                </Typography>
              )}

              {otpSent && (
                <LoadingButton
                  fullWidth
                  color="primary"
                  size="medium"
                  type="submit"
                  variant="contained"
                  disabled={otp.length !== 6}
                  loading={isSubmitting}
                  endIcon={<Iconify icon="eva:arrow-forward-fill" />}
                  sx={{
                    bgcolor: '#ffa206',
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: '#ffa206',
                    },
                    '&:disabled': {
                      bgcolor: 'grey.300',
                    },
                    py: 1,
                    mt: 0.25,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    boxShadow: 'none',
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
                    fontSize: '0.75rem',
                  }}
                >
                  Resend OTP in {countdown}s
                </Typography>
              )}

              {otpSent && countdown === 0 && (
                <Box
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1.5 }}
                >
                  <Typography
                    variant="body2"
                    onClick={handleResendOtp}
                    sx={{
                      color: '#ffa206',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      '&:hover': {
                        color: '#ffa206',
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
                          fontSize: '0.75rem',
                        }}
                      >
                        |
                      </Typography>
                      <Typography
                        variant="body2"
                        onClick={() => tryAnotherMethod(watch('type'))}
                        sx={{
                          color: '#ffa206',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          '&:hover': {
                            color: '#ffa206',
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
        </Box>
      </Box>
    </Box>
  );
}
