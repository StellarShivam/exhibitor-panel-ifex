'use client';

import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';

import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useSnackbar } from 'src/components/snackbar';
import { useGetExhibitorForm, generateProformaInvoice } from 'src/api/space';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useEventContext } from 'src/components/event-context';
import ExhibitorForm from './ExhibitorForm';

// ----------------------------------------------------------------------

export default function ExhibitorRegistrationForm() {
  const router = useRouter();
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
        router.replace('/dashboard/space');
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);
  const topRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'view';
  const params = useParams<{ urnNumber: string }>();
  const { exhibitorForm, exhibitorFormLoading } = useGetExhibitorForm();

  // const { editExhibitorForm } = useEditExhibitorForm();
  const { eventData } = useEventContext();
  
  const { enqueueSnackbar } = useSnackbar();
  const [isEditable, setIsEditable] = useState(mode === 'editing');

  useEffect(() => {
    setIsEditable(mode === 'editing');
  }, [mode]);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [userIp, setUserIp] = useState<string>('');
  const [steps, setSteps] = useState([
    { id: 1, label: 'Exhibitor Information', completed: false },
    { id: 2, label: 'Company Details', completed: false },
    { id: 3, label: 'Objective & Preferences', completed: false },
    { id: 4, label: 'Booth Details', completed: false },
    { id: 5, label: 'Payment', completed: false },
  ]);

  const pdfContentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Fetch user IP address
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => setUserIp(data.ip))
      .catch(() => setUserIp('Unavailable'));
  }, []);

  const handleDownloadPdf = async () => {
    const elementToCapture = pdfContentRef.current;
    if (!elementToCapture) {
      enqueueSnackbar('Error: Could not find the content to print.', { variant: 'error' });
      return;
    }

    setPdfGenerating(true);

    // Store original styles
    const originalStyles = {
      overflow: elementToCapture.style.overflow,
      height: elementToCapture.style.height,
      maxHeight: elementToCapture.style.maxHeight,
      width: elementToCapture.style.width,
      transform: elementToCapture.style.transform,
      transformOrigin: elementToCapture.style.transformOrigin,
    };

    // Set a fixed width for A4 (210mm at 96dpi ≈ 794px) and scale to 100%
    elementToCapture.style.width = '1080px'; // Fixed width for A4
    elementToCapture.style.transform = 'scale(1)';
    elementToCapture.style.transformOrigin = 'top left';
    elementToCapture.style.overflow = 'visible';
    elementToCapture.style.height = 'auto';
    elementToCapture.style.maxHeight = 'none';

    elementToCapture.scrollIntoView({ behavior: 'instant', block: 'start' });
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const canvas = await html2canvas(elementToCapture, {
        scale: 2,
        useCORS: true,
        logging: process.env.NODE_ENV === 'development',
        width: 1080, // Fixed width for A4
        windowWidth: 1080, // Fixed width for A4
        x: 0,
        y: 0,
        onclone: (clonedDoc) => {
          // Ensure all elements are visible in the cloned document
          const clonedElement = clonedDoc.querySelector('#pdf-content');
          if (clonedElement) {
            clonedElement.style.overflow = 'visible';
            clonedElement.style.height = 'auto';
            clonedElement.style.maxHeight = 'none';
          }
        },
      });

      // Restore original styles immediately after canvas capture
      elementToCapture.style.overflow = originalStyles.overflow;
      elementToCapture.style.height = originalStyles.height;
      elementToCapture.style.maxHeight = originalStyles.maxHeight;
      elementToCapture.style.width = originalStyles.width;
      elementToCapture.style.transform = originalStyles.transform;
      elementToCapture.style.transformOrigin = originalStyles.transformOrigin;

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        compress: true,
      });

      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();

      const sourceCanvas = canvas;
      const sourceWidthPx = sourceCanvas.width;
      const sourceHeightPx = sourceCanvas.height;

      // Margins - increased for better content visibility
      const FIRST_PAGE_TOP_MARGIN = 8;
      const SUBSEQUENT_PAGE_TOP_MARGIN = 8;
      const ALL_PAGE_BOTTOM_MARGIN = 12;
      const xPositionOnPdf = 0;

      let yPosOnSourceCanvas = 0;
      let pageNum = 0;

      // Get current timestamp and site URL
      const timestamp = new Date().toLocaleString();
      const siteUrl = window.location.origin + window.location.pathname;
      const ipText = `IP: ${userIp}`;

      // Calculate scale factor
      const scaleFactor = pdfPageWidth / sourceWidthPx;

      while (yPosOnSourceCanvas < sourceHeightPx) {
        if (pageNum > 0) {
          pdf.addPage();
        }

        const currentTopMargin = pageNum === 0 ? FIRST_PAGE_TOP_MARGIN : SUBSEQUENT_PAGE_TOP_MARGIN;
        const imageYPositionOnPdf = currentTopMargin;

        let availableHeightOnPdf = pdfPageHeight - currentTopMargin - ALL_PAGE_BOTTOM_MARGIN;

        if (availableHeightOnPdf <= 0) {
          console.error('Error: PDF page margins are too large, no space for content.');
          enqueueSnackbar('Error: PDF page margins are too large to fit content.', {
            variant: 'error',
          });
          break;
        }

        const remainingSourceHeightPx = sourceHeightPx - yPosOnSourceCanvas;
        const scaledHeightOfRemainingSourceOnPdf = remainingSourceHeightPx * scaleFactor;

        let sliceHeightOnPdf = Math.min(availableHeightOnPdf, scaledHeightOfRemainingSourceOnPdf);

        if (sliceHeightOnPdf <= 0.001) {
          break;
        }

        let sliceHeightOnSourcePx = sliceHeightOnPdf / scaleFactor;

        // Ensure we don't exceed the remaining content
        if (yPosOnSourceCanvas + sliceHeightOnSourcePx > sourceHeightPx) {
          sliceHeightOnSourcePx = sourceHeightPx - yPosOnSourceCanvas;
          sliceHeightOnPdf = sliceHeightOnSourcePx * scaleFactor;
        }

        if (sliceHeightOnSourcePx <= 0.001) {
          break;
        }

        // Create a temporary canvas for this slice
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sourceWidthPx;
        tempCanvas.height = Math.ceil(sliceHeightOnSourcePx);
        const tempCtx = tempCanvas.getContext('2d', { alpha: true });

        if (!tempCtx) {
          console.error('Error: Could not get 2D context from temporary canvas.');
          enqueueSnackbar('Error: Failed to prepare image slice for PDF.', { variant: 'error' });
          break;
        }

        // Fill with white background to prevent transparency issues
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw the slice from the source canvas
        tempCtx.drawImage(
          sourceCanvas,
          0,
          Math.floor(yPosOnSourceCanvas),
          sourceWidthPx,
          Math.ceil(sliceHeightOnSourcePx),
          0,
          0,
          sourceWidthPx,
          Math.ceil(sliceHeightOnSourcePx)
        );

        const pageImageDataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);

        pdf.addImage(
          pageImageDataUrl,
          'JPEG',
          xPositionOnPdf,
          imageYPositionOnPdf,
          pdfPageWidth,
          sliceHeightOnPdf
        );

        // --- Add footer and header ---
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        // Bottom left: site URL
        pdf.text(siteUrl, 8, pdfPageHeight - 4, { align: 'left' });
        // Bottom right: page number
        pdf.text(`Page ${pageNum + 1}`, pdfPageWidth - 8, pdfPageHeight - 4, { align: 'right' });
        // Top left: timestamp
        pdf.text(timestamp, 4, 3, { align: 'left' });
        // Top right: IP address
        pdf.text(ipText, pdfPageWidth - 8, 3, { align: 'right' });

        yPosOnSourceCanvas += sliceHeightOnSourcePx;
        pageNum++;

        // Safety check to prevent infinite loops
        if (pageNum > 100) {
          console.error('Error: Too many pages generated, stopping to prevent infinite loop.');
          enqueueSnackbar('Warning: PDF generation stopped due to excessive page count.', {
            variant: 'warning',
          });
          break;
        }
      }

      pdf.save(
        exhibitorForm?.companyOrganizationName
          ? exhibitorForm?.companyOrganizationName + '_Exhibitor_Submission_Overview.pdf'
          : 'Exhibitor_Submission_Overview.pdf'
      );
      enqueueSnackbar('PDF downloaded successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      enqueueSnackbar(`Error generating PDF: ${errorMessage}. Check console.`, {
        variant: 'error',
      });
      // Restore original styles in case of error too
      elementToCapture.style.overflow = originalStyles.overflow;
      elementToCapture.style.height = originalStyles.height;
      elementToCapture.style.maxHeight = originalStyles.maxHeight;
      elementToCapture.style.width = originalStyles.width;
      elementToCapture.style.transform = originalStyles.transform;
      elementToCapture.style.transformOrigin = originalStyles.transformOrigin;
    } finally {
      setPdfGenerating(false);
    }
  };

  const toggleEditMode = () => {
    const newEditable = !isEditable;
    setIsEditable(newEditable);
    const params = new URLSearchParams(searchParams.toString());
    params.set('mode', newEditable ? 'editing' : 'view');
    router.push(`?${params.toString()}`);
  };

  const handleDownloadProformaInvoice = async () => {
    enqueueSnackbar('Processing proforma invoice...', { variant: 'info' });
    try {
      const urnNumber = exhibitorForm.urn
      console.log(exhibitorForm)
      if (urnNumber) {
        const res = await generateProformaInvoice(urnNumber);

        enqueueSnackbar('Proforma invoice processed!!', { variant: 'success' });

        if (res) {
          window.open(res?.proformaUrl, '_blank', 'noopener,noreferrer');
        }
        // Optionally, refresh data or show a notification here
      } else {
        
        enqueueSnackbar('Failed to generate proforma invoice!', { variant: 'error' });
      }
    } catch (error) {
      console.error('Failed to generate proforma invoice:', error);
      enqueueSnackbar('Failed to generate proforma invoice!', { variant: 'error' });
    }
  };

  const isEditDisabled=()=>{
    if(eventData.state.roles?.includes('MANAGER') && exhibitorForm?.metaData?.data?.status !=='REGISTERED'){
      return true;
    }
    if(eventData.state.roles?.includes('PAYMENT_ADMIN')){
      return true;
    }
    if(eventData.state.roles?.includes('EXECUTIVE')){
      return true;
    }
    if(eventData.state.roles?.includes('COUNCIL_ADMIN')){
      return true;
    }
    return false;
  };

  return (
    <>
      <div ref={topRef} className="absolute top-0 left-0" />
      <div id="pdf-content" ref={pdfContentRef}>
        {' '}
        {/* This id is on the outer div, pdfContentRef is on the inner Box */}
        {(exhibitorFormLoading || isSubmitting) && (
          <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 4 }}>
            <CircularProgress color="primary" />
          </Backdrop>
        )}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
 Exhibitor Submission Overview
          </Typography>
          <Typography variant="body1">
Here are the details submitted by the exhibitor during registration. Use this view to verify booth preferences, company info, documents, and payment structure.
          </Typography>
        </Box>
        {/* <img src="/logo/frame.png" alt="logo" /> */}
        <Box sx={{ px: 3, py: 2, display: 'flex', gap: 1 }}>
          {!pdfGenerating && (
            <>
                {/* <Button
                  variant="contained"
                  startIcon={
                    <Box component="img" src="/Edit.svg" sx={{ width: 20, height: 20 }} />
                  }
                  onClick={toggleEditMode}
                  sx={{
                    bgcolor: isEditable ? '#FF4D1C' : '#2D3250',
                    '&:hover': { bgcolor: isEditable ? '#FF3A0A' : '#1a1e30' },
                    textTransform: 'none',
                    px: 2,
                  }}
                  disabled={isEditDisabled()}
                >
                  {isEditable ? 'Cancel Edit' : 'Edit'}
                </Button> */}
              <Button
                variant="contained"
                startIcon={
                  <Box component="img" src="/Export_Pdf.svg" sx={{ width: 20, height: 20 }} />
                }
                sx={{
                  bgcolor: '#2D3250',
                  '&:hover': { bgcolor: '#1a1e30' },
                  textTransform: 'none',
                  px: 2,
                }}
                onClick={handleDownloadPdf}
                ref={buttonRef}
              >
                Download PDF Summary
              </Button>
              <Button
                variant="contained"
                startIcon={
                  <Box component="img" src="/Export_Pdf.svg" sx={{ width: 20, height: 20 }} />
                }
                sx={{
                  bgcolor: '#2D3250',
                  '&:hover': { bgcolor: '#1a1e30' },
                  textTransform: 'none',
                  px: 2,
                }}
                onClick={handleDownloadProformaInvoice}
                ref={buttonRef}
                // disabled={exhibitorForm?.metaData?.data?.status === 'PENDING'}
              >
                Proforma Invoice
              </Button>
            </>
          )}
        </Box>
        <div className="flex flex-col lg:flex-row relative bg-[#F6F6F6] min-h-[100vh] rounded-2xl mx-6 mb-8">
          <div className="min-h-full w-full p-6 lg:p-8">
            <ExhibitorForm isEditable={isEditable && !isEditDisabled()} />
          </div>
        </div>
      </div>
    </>
  );
}
