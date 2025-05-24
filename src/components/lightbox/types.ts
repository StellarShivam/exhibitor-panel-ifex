import { LightboxExternalProps } from 'yet-another-react-lightbox';

// ----------------------------------------------------------------------

export interface Slide {
  url: string;
  type: 'image' | 'video';
}

export interface LightBoxProps {
  open: boolean;
  slides: Slide[];
  currentIndex: number;
  onClose: VoidFunction;
  onNext?: VoidFunction;
  onPrev?: VoidFunction;
}
