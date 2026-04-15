import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

type Props = {
  left?: string;
};

const footerLinks = [
  {
    href: 'https://bharat-tex.com/terms-conditions/',
    label: 'Terms and Conditions',
  },
  {
    href: 'https://bharat-tex.com/privacy-policy/',
    label: 'Privacy Policy',
  },
  {
    href: 'https://bharat-tex.com/general-regulation/',
    label: 'General Rules & Regulation',
  },
];

export default function Footer({ left = "0" }: Props) {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: { xs: 0, lg: `${left}px` },
        right: 0,
        py: 2,
        px: { xs: 2, sm: 3, md: 4 },
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        zIndex: 1000,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={{ xs: 2, sm: 3 }}
      >
        <Typography variant="body2" color="text.secondary">
          © Copyright IFEX 2025–26
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 3 }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          {footerLinks.map((link, index) => (
            <Box key={link.href} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Link
                href={link.href}
                target="_blank"
                rel="noopener"
                color="text.secondary"
                underline="hover"
                sx={{ fontSize: '0.875rem' }}
              >
                {link.label}
              </Link>
              {index < footerLinks.length - 1 && (
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    width: '1px',
                    height: '16px',
                    bgcolor: 'divider',
                  }}
                />
              )}
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
