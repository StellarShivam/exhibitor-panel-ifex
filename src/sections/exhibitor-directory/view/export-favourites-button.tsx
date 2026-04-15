import { Button, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { axiosInstance2, tokenManager, apiEndpoints } from 'src/utils/axios';

export default function ExportFavouritesButton() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const AUTH_TOKEN = tokenManager.getToken();
      if (!AUTH_TOKEN) {
        enqueueSnackbar('No access token found', { variant: 'error' });
        setLoading(false);
        return;
      }
      const response = await axiosInstance2.get(apiEndpoints.leadWallet.exportFavourites, {
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'favourites_export.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      enqueueSnackbar('Exported favourites!', { variant: 'success' });
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Export failed', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleExport}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={20} /> : null}
    >
      Export Favourites
    </Button>
  );
}
