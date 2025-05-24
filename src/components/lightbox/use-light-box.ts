import { useState } from 'react';
import { Slide } from './types';

// ----------------------------------------------------------------------

export default function useLightBox(slides: Slide[]) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpen = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return {
    open,
    currentIndex,
    onOpen: handleOpen,
    onClose: handleClose,
    onNext: handleNext,
    onPrev: handlePrev,
  };
}
