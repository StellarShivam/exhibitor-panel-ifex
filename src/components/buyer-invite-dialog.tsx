import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';

const buyerLinks = [
  {
    label: 'Overseas Buyer Registration',
    url: 'https://bharat-tex.com/overseas-buyer-registration/',
  },
  {
    label: 'Buying Consultant Registration',
    url: 'https://bharat-tex.com/buying-consultant-registration/',
  },
  {
    label: 'Domestic Buyer Registration',
    url: 'https://bharat-tex.com/domestic-buyer-registration/',
  },
];

export default function BuyerInviteDialog({ open, onClose }) {
  const [copiedIdx, setCopiedIdx] = useState(-1);

  const handleCopy = (url, idx) => {
    navigator.clipboard.writeText(url);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(-1), 1200);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>Invite Buyers</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          {buyerLinks.map((link, idx) => (
            <Box key={link.url} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, transition: 'background 0.2s', '&:hover': { background: '#f5f5f5' } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>{link.label}</Typography>
              </Box>
              <Button
                href={link.url}
                target="_blank"
                rel="noopener"
                variant="contained"
                size="small"
                sx={{ minWidth: 100 }}
              >
                Visit Link
              </Button>
              <IconButton
                onClick={() => handleCopy(link.url, idx)}
                size="small"
                color={copiedIdx === idx ? 'success' : 'primary'}
                sx={{ ml: 1 }}
              >
                {copiedIdx === idx ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', pb: 2 }}>
            <Button variant="outlined" onClick={onClose}>
                Close
            </Button>
      </DialogActions>
    </Dialog>
  );
}
