import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';

import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';
import Typography from '@mui/material/Typography';
import { fData } from 'src/utils/format-number';
import { useSnackbar } from 'src/components/snackbar';
import { useEventContext } from 'src/components/event-context';
import { useImageUpload, savePortfolio, useGetPortfolio } from 'src/api/product-portfolio';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  title?: string;
  //
  onCreate?: VoidFunction;
  onUpdate?: VoidFunction;
  //
  folderName?: string;
  onChangeFolderName?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  //
  open: boolean;
  onClose: VoidFunction;
}

export default function FileManagerNewFolderDialog({
  title = 'Upload File',
  open,
  onClose,
  //
  onCreate,
  onUpdate,
  //
  folderName,
  onChangeFolderName,
  ...other
}: Props) {
  const [files, setFiles] = useState<(File | string)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { uploadImage } = useImageUpload();
  const { enqueueSnackbar } = useSnackbar();
  const { eventData } = useEventContext();
  const { reFetchPortfolio } = useGetPortfolio(eventData?.state.exhibitorId);
  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );

  const handleUpload = async () => {
    if (files.length === 0) {
      enqueueSnackbar('Please select a PDF file', { variant: 'error' });
      return;
    }

    try {
      setIsSubmitting(true);

      const file = files[0];
      if (file instanceof File) {
        const uploadResponse = await uploadImage(file);
        console.log('UPLOAD RESPONSE : ', uploadResponse);
        if (!uploadResponse?.data?.storeUrl) {
          enqueueSnackbar('Error uploading PDF1', { variant: 'error' });
          return;
        }

        const portfolioData = {
          portfolioName: 'Portfolio',
          exhibitorId: eventData?.state.exhibitorId,
          pdfUrl: uploadResponse.data.storeUrl,
        };

        await savePortfolio(portfolioData);
        await reFetchPortfolio?.();

        enqueueSnackbar('Portfolio saved successfully!');
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}

        <Upload
          multiple
          files={files}
          maxSize={20971520}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
          disabled={files.length === 1}
          accept={{
            'application/pdf': ['.pdf'],
          }}
          helperText={
            <Typography
              variant="caption"
              sx={{
                mt: 3,
                mx: 'auto',
                display: 'block',
                textAlign: 'center',
                color: 'text.disabled',
              }}
            >
              Allowed *.pdf
              <br /> max size of {fData(20971520)}
            </Typography>
          }
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
          disabled={files.length === 0 || isSubmitting}
        >
          Upload
        </Button>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? 'Save' : 'Create'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}
