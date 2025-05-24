import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import Iconify from '../iconify';
import { LightBoxProps } from './types';

// ----------------------------------------------------------------------

const renderContent = (
  currentSlide: { url: string; type: 'image' | 'video' },
  currentIndex: number
) => {
  if (currentSlide.type === 'image') {
    return (
      <img
        alt="lightbox"
        src={currentSlide.url}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    );
  }

  if (currentSlide.type === 'video') {
    return (
      <video
        key={currentIndex}
        controls
        autoPlay
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        <source src={currentSlide.url} type="video/mp4" />
        <track kind="captions" src="" label="English" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'common.white',
        bgcolor: 'action.selected',
        borderRadius: 1,
      }}
    >
      Unsupported media type
    </Box>
  );
};

export default function Lightbox({
  slides = [],
  open = false,
  currentIndex = 0,
  onClose,
  onNext,
  onPrev,
}: LightBoxProps) {
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [open]);

  if (!slides.length) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  if (!currentSlide) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiBackdrop-root': {
          backgroundColor: alpha(theme.palette.grey[900], 0.4),
          backdropFilter: 'blur(8px)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 'calc(100% - 8px)',
          maxHeight: 'calc(100% - 8px)',
          bgcolor: alpha(theme.palette.grey[900], 0.4),
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 9,
            p: 1,
            color: 'common.white',
            bgcolor: 'action.active',
            '&:hover': {
              bgcolor: 'action.selected',
            },
          }}
        >
          <Iconify icon="mingcute:close-line" width={24} />
        </IconButton>

        {/* Content */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 8,
          }}
        >
          {renderContent(currentSlide, currentIndex)}
        </Box>

        {/* Navigation buttons */}
        {slides.length > 1 && (
          <>
            <IconButton
              onClick={onPrev}
              disabled={currentIndex === 0}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                height: 40,
                width: 40,
                p: 0,
                color: 'common.white',
                bgcolor: 'action.active',
                zIndex: 9,
                '&:hover': {
                  bgcolor: 'action.selected',
                },
                ...(currentIndex === 0 && {
                  opacity: 0.48,
                  '&:hover': { bgcolor: 'action.active' },
                }),
              }}
            >
              <Iconify icon="eva:arrow-ios-back-fill" width={24} />
            </IconButton>

            <IconButton
              onClick={onNext}
              disabled={currentIndex === slides.length - 1}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                height: 40,
                width: 40,
                p: 0,
                color: 'common.white',
                bgcolor: 'action.active',
                zIndex: 9,
                '&:hover': {
                  bgcolor: 'action.selected',
                },
                ...(currentIndex === slides.length - 1 && {
                  opacity: 0.48,
                  '&:hover': { bgcolor: 'action.active' },
                }),
              }}
            >
              <Iconify icon="eva:arrow-ios-forward-fill" width={24} />
            </IconButton>
          </>
        )}
      </Box>
    </Modal>
  );
}
