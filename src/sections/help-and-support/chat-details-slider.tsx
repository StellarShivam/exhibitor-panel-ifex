import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Stack,
  Paper,
  Modal,
  styled,
} from '@mui/material';
import { format } from 'date-fns';
import Iconify from 'src/components/iconify';
import {
  ITicketItem,
  ITicketMessage,
  ITicketDetails,
  ITicketMessageItem,
} from 'src/types/help-and-support';
import {
  sendExhibitorMessage,
  useGetTicketDetails,
  useImageUpload,
} from 'src/api/help-and-support';
import DOMPurify from 'dompurify';
import { enqueueSnackbar } from 'notistack';
import { useEventContext } from 'src/components/event-context';

interface StyledMessageBubbleProps {
  isUser?: boolean;
}

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '400px',
    maxWidth: '100%',
    padding: theme.spacing(2),
  },
}));

const MessageBubble = styled(Paper)<{ isUser?: boolean }>(({ theme, isUser }) => ({
  padding: theme.spacing(2),
  width: '100%',
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[100],
  color: theme.palette.text.primary,
  position: 'relative',
  borderRadius: theme.spacing(1.5),
  boxShadow: theme.shadows[1],
  marginLeft: isUser ? 'auto' : 0,
  marginRight: isUser ? 0 : 'auto',
  maxWidth: '85%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -8,
    [isUser ? 'right' : 'left']: 14,
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderBottom: `8px solid ${
      theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[100]
    }`,
  },
}));

const AttachmentPreview = styled(Box)(({ theme }) => ({
  width: '100px',
  height: '100px',
  position: 'relative',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.8,
  },
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.neutral,
  borderRadius: theme.shape.borderRadius,
}));

const PreviewItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 100,
  height: 100,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const RemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  padding: 4,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

const AttachmentPreviewSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

const PreviewImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 100,
  height: 100,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover .preview-actions': {
    opacity: 1,
  },
}));

const PreviewActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: theme.spacing(0.5),
  display: 'flex',
  gap: theme.spacing(0.5),
  opacity: 0,
  transition: theme.transitions.create('opacity'),
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: `0 ${theme.shape.borderRadius}px 0 ${theme.shape.borderRadius}px`,
}));

interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

interface PreviewState {
  isOpen: boolean;
  imageUrl: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  data: ITicketItem | null;
}

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
}));

export default function ChatDetailsSlider({ open, onClose, data }: Props) {
  const [message, setMessage] = useState<string>('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const { eventData } = useEventContext();
  const { uploadImage } = useImageUpload();
  const [ticket, setTicket] = useState<ITicketDetails | null>(null);
  const [previewState, setPreviewState] = useState<PreviewState>({
    isOpen: false,
    imageUrl: null,
  });
  const [error, setError] = useState<string>('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const { ticketDetails, reFetchTicketDetails } = useGetTicketDetails(Number(data?.id));

  useEffect(() => {
    setTicket(ticketDetails);
  }, [ticketDetails]);

  useEffect(
    () => () => {
      attachments.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    },
    [attachments]
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (!isImage) {
        setError('Only image files are allowed');
        return false;
      }
      if (!isValidSize) {
        setError('Image size should not exceed 5MB');
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })
    );

    setAttachments((prev) => [...prev, ...newFiles]);
    setError('');
    event.target.value = '';
  };

  const handleRemoveAttachment = (idToRemove: string) => {
    setAttachments((prev) => {
      const fileToRemove = prev.find((file) => file.id === idToRemove);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((file) => file.id !== idToRemove);
    });
  };

  const handleMessageImageClick = (imageUrl: string) => {
    setPreviewState({
      isOpen: true,
      imageUrl,
    });
  };

  const handleClosePreview = () => {
    setPreviewState({
      isOpen: false,
      imageUrl: null,
    });
  };

  const handleSend = async () => {
    console.log('********* The attachments are mjn: ', attachments);

    if (message.trim() || attachments.length > 0) {
      try {
        if (!ticket?.ticket?.id) {
          throw new Error('Ticket ID is required');
        }

        // console.log('********* The file objects are : ', fileObjects);
        const uploadPromises = attachments.map((file) => uploadImage(file));
        const uploadedImages = await Promise.all(uploadPromises);
        const imageUrls = uploadedImages.map((response: any) => response.data.storeUrl);

        // console.log('********* The image urls are : ', imageUrls);
        const messageData: ITicketMessageItem = {
          eventId: eventData.state.eventId,
          ticketId: ticket.ticket.id,
          subject: ticket?.ticket?.subject || '',
          description: message,
          attachments: imageUrls,
        };
        await sendExhibitorMessage(messageData);
        setMessage('');
        attachments.forEach((file) => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });
        setAttachments([]);
        setError('');
        reFetchTicketDetails();
        enqueueSnackbar('Message sent successfully!', { variant: 'success' });
      } catch (err: any) {
        console.error('Error:', err);
        enqueueSnackbar(err.message || 'Error sending message', { variant: 'error' });
      }
    }
  };

  const sanitizeHTML = (html: string) => {
    const containsHTML = /<[a-z][\s\S]*>/i.test(html);

    if (!containsHTML) {
      return html;
    }
    return DOMPurify.sanitize(html);
  };

  const scrollToBottom = (instant = false) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: instant ? 'auto' : 'smooth',
    });
  };

  useEffect(() => {
    if (ticket?.details?.length) {
      scrollToBottom(false);
    }
  }, [ticket?.details]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        scrollToBottom(true);
      }, 100);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  if (!ticket) return null;

  return (
    <>
      <StyledDrawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Ticket Conversations</Typography>
            <IconButton onClick={onClose}>
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, px: 2 }}>
            {ticket?.details?.map((msg: ITicketMessage, index: number) => (
              <Box key={msg.id} sx={{ mb: 3 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{
                    mb: 1,
                    justifyContent: msg.userType === 'EXHIBITOR' ? 'flex-end' : 'flex-start',
                    px: 1,
                  }}
                >
                  {msg.userType !== 'EXHIBITOR' && (
                    <>
                      <Avatar
                        // src={ticket.ticket?.profileUrl || ''}
                        alt={msg.userType}
                        sx={{
                          width: 32,
                          height: 32,
                          border: (theme) => `2px solid ${theme.palette.background.paper}`,
                          boxShadow: (theme) => theme.shadows[2],
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          color: 'text.primary',
                        }}
                      >
                        {msg.userType}
                      </Typography>
                    </>
                  )}
                  {msg.userType === 'EXHIBITOR' && (
                    <>
                      <Typography
                        sx={{
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          color: 'text.primary',
                        }}
                      >
                        {msg.userType}
                      </Typography>
                      <Avatar
                        src={ticket.ticket?.profileUrl || ''}
                        alt={msg.userType}
                        sx={{
                          width: 32,
                          height: 32,
                          border: (theme) => `2px solid ${theme.palette.background.paper}`,
                          boxShadow: (theme) => theme.shadows[2],
                        }}
                      />
                    </>
                  )}
                </Stack>

                <Box sx={{ width: '100%' }}>
                  <MessageBubble isUser={msg.userType === 'EXHIBITOR'}>
                    <Box
                      component="div"
                      sx={{ fontSize: '0.95rem' }}
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHTML(msg.message),
                      }}
                    />
                    {msg.attachments?.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {msg.attachments.map((attachment: string, i: number) => (
                          <Box
                            key={i}
                            sx={{
                              position: 'relative',
                              cursor: 'pointer',
                              width: 100,
                              height: 100,
                              borderRadius: 1,
                              overflow: 'hidden',
                              '&:hover': {
                                '& .image-overlay': {
                                  opacity: 1,
                                },
                              },
                            }}
                            onClick={() => handleMessageImageClick(attachment)}
                          >
                            <Box
                              component="img"
                              src={attachment}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <Box
                              className="image-overlay"
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                bgcolor: 'rgba(0, 0, 0, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                              }}
                            >
                              <Iconify
                                icon="eva:eye-fill"
                                sx={{ color: 'white', width: 24, height: 24 }}
                              />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 0.5,
                        textAlign: msg.userType === 'EXHIBITOR' ? 'right' : 'left',
                        color: 'text.secondary',
                        fontSize: '0.8rem',
                      }}
                    >
                      {format(new Date(msg.createdAt), 'PPpp')}
                    </Typography>
                  </MessageBubble>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 1 }}>
              {error}
            </Typography>
          )}

          {attachments.length > 0 && (
            <AttachmentPreviewSection>
              {attachments.map((file) => (
                <PreviewImageContainer key={file.id}>
                  {file.preview && (
                    <Box
                      component="img"
                      src={file.preview}
                      alt={file.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <PreviewActions className="preview-actions">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAttachment(file.id);
                      }}
                      sx={{
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        },
                      }}
                    >
                      <Iconify icon="eva:close-fill" width={20} />
                    </IconButton>
                  </PreviewActions>
                </PreviewImageContainer>
              ))}
            </AttachmentPreviewSection>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              id="attachment-input"
              onChange={handleFileUpload}
            />
            <IconButton
              component="label"
              htmlFor="attachment-input"
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={!message.trim() && attachments.length === 0}
            >
              <Iconify icon="eva:paper-plane-fill" />
            </Button>
          </Box>
        </Box>
      </StyledDrawer>

      <StyledModal
        open={previewState.isOpen}
        onClose={handleClosePreview}
        aria-labelledby="image-preview"
        aria-describedby="preview of selected image"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'auto',
            maxWidth: '90vw',
            maxHeight: '90vh',
            bgcolor: 'transparent',
            outline: 'none',
          }}
        >
          <IconButton
            onClick={handleClosePreview}
            sx={{
              position: 'absolute',
              right: -40,
              top: -40,
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>
          {previewState.imageUrl && (
            <Box
              component="img"
              src={previewState.imageUrl}
              alt="Preview"
              sx={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          )}
        </Box>
      </StyledModal>
    </>
  );
}
