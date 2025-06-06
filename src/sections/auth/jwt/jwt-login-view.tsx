'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

const fontFamily = "'Poppins', sans-serif";

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    username: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const usernameWithSuffix = `${data.username}`;
      await login?.(usernameWithSuffix, data.password);
      router.push(PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
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
            background: 'linear-gradient(180deg, #3090C8 0%, rgba(0, 0, 0, 0.8) 100%)',
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
            p: { xs: 2, md: 3, lg: 6 },
          }}
        >
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            Sign in
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMsg}
            </Alert>
          )}

          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>
              <RHFTextField
                name="username"
                label="Enter User Name"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#3090C833',
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: '#3090C8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3090C8',
                    },
                  },
                }}
              />

              <RHFTextField
                name="password"
                label="Password"
                type={password.value ? 'text' : 'password'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#3090C833',
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: '#3090C8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3090C8',
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'mdi:eye-off'}
                          sx={{ color: '#3090C8' }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

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

              <LoadingButton
                fullWidth
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                sx={{
                  bgcolor: '#3090C8',
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: '#3090C8',
                  },
                  py: 1.5,
                  mt: 2,
                  boxShadow: '0px 8px 15px rgba(48, 144, 200, 0.6)',
                }}
              >
                Login
              </LoadingButton>
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
