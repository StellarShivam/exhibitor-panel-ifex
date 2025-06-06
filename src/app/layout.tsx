/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

// ----------------------------------------------------------------------

import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';
import { LocalizationProvider } from 'src/locales';
import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';

import { CheckoutProvider } from 'src/sections/checkout/context';

import SnackbarProvider from 'src/components/snackbar/snackbar-provider';

import { AuthProvider } from 'src/auth/context/jwt';

import { EventProvider } from '../components/event-context';

import { PriceProvider } from 'src/sections/registartion-form/Price';

import { LoaderProvider } from 'src/sections/registartion-form/LoaderContext';

// ----------------------------------------------------------------------

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: 'IFEX',
  description:
    'The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style',
  keywords: 'react,material,kit,application,dashboard,admin,template',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/IFEX_LOGO.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/IFEX_LOGO.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/IFEX_LOGO.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/IFEX_LOGO.png' },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <AuthProvider>
          <LocalizationProvider>
            <SettingsProvider
              defaultSettings={{
                themeMode: 'light', // 'light' | 'dark'
                themeDirection: 'ltr', //  'rtl' | 'ltr'
                themeContrast: 'default', // 'default' | 'bold'
                themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                themeColorPresets: 'blue', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                themeStretch: false,
              }}
            >
              <ThemeProvider>
                <LoaderProvider>
                  <PriceProvider>
                    <EventProvider>
                      <MotionLazy>
                        <SnackbarProvider>
                          <CheckoutProvider>
                            <SettingsDrawer />
                            <ProgressBar />
                            {children}
                          </CheckoutProvider>
                        </SnackbarProvider>
                      </MotionLazy>
                    </EventProvider>
                  </PriceProvider>
                </LoaderProvider>
              </ThemeProvider>
            </SettingsProvider>
          </LocalizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
