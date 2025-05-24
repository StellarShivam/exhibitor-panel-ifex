'use client';

import React, { useState, useEffect } from 'react';
import {
  Stack,
  Container,
  Typography,
  Card,
  Box,
  Avatar,
  TextField,
  Button,
  IconButton,
  Paper,
  Modal,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme, styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { useRouter } from 'src/routes/hooks';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ITicketDetails, ITicketMessage, ITicketMessageItem } from 'src/types/help-and-support';
import { fDate, fDateTime, fTime } from 'src/utils/format-time';
import { paths } from 'src/routes/paths';
import { useGetTicketDetails, sendExhibitorMessage } from 'src/api/help-and-support';
import { useEventContext } from 'src/components/event-context';
import { useSnackbar } from 'src/components/snackbar';
import { useImageUpload } from 'src/api/product-portfolio';
import DOMPurify from 'dompurify';

interface FileWithPreview extends File {
  preview?: string;
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

interface PreviewState {
  isOpen: boolean;
  imageUrl: string | null;
}

// Styled Components
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
    [isUser ? 'right' : 'left']: 10,
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderBottom: `8px solid ${
      theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[100]
    }`,
  },
}));

const ChatContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(16),
  height: 'calc(100vh - 350px)',
  minHeight: '500px',
  maxHeight: 'calc(100vh - 350px)',
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 3,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.grey[100],
    borderRadius: 3,
  },
}));

const InputContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
}));

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
}));

type Props = {
  id: string;
};

export default function TicketDetailsView({ id }: Props) {
  const settings = useSettingsContext();
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { uploadImage } = useImageUpload();
  const { eventData } = useEventContext();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { ticketDetails, reFetchTicketDetails } = useGetTicketDetails(Number(id));

  const [ticket, setTicket] = useState<ITicketDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [previewState, setPreviewState] = useState<PreviewState>({
    isOpen: false,
    imageUrl: null,
  });

  useEffect(() => {
    setTicket({
      ticket: ticketDetails?.ticket || {},
      details: ticketDetails?.details || [],
    });

    setLoading(false);
  }, [id, ticketDetails]);

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

    // console.log(files);

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

  const handleSend = async () => {
    console.log('********* The attachments are : ', attachments);
    if (message.trim() || attachments.length > 0) {
      try {
        if (!ticket?.ticket?.id) {
          throw new Error('Ticket ID is required');
        }

        // console.log('********* The attachments are : ', attachments);
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

  if (loading || !ticket) {
    return null;
  }

  const sanitizeHTML = (html: string) => {
    const containsHTML = /<[a-z][\s\S]*>/i.test(html);

    if (!containsHTML) {
      return html;
    }
    return DOMPurify.sanitize(html);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Ticket Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Help & Support', href: paths.dashboard.helpAndSupport.root },
          { name: 'Ticket Details' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Grid
        container
        spacing={3}
        sx={{
          height: '100%',
          minHeight: 'calc(100vh - 200px)',
        }}
      >
        <Grid xs={12} md={7}>
          <Card
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Stack spacing={3} sx={{ flexGrow: 1 }}>
              <div>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ mb: 0.5, fontWeight: 700, fontSize: 16 }}
                >
                  Subject
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ticket.ticket.subject}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ mb: 0.5, fontWeight: 700, fontSize: 16 }}
                >
                  Description
                </Typography>
                <Box
                  component="div"
                  color="text.secondary"
                  sx={{ whiteSpace: 'pre-line' }}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(ticket?.details[0]?.message || 'No description available'),
                  }}
                />
              </div>

              <Stack direction="row" alignItems="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 110, fontWeight: 600 }}
                >
                  Status
                </Typography>
                <Label
                  variant="soft"
                  sx={{
                    textTransform: 'capitalize',
                    bgcolor: '#FFF7E6',
                    color: '#B76E00',
                  }}
                >
                  {ticket.ticket.status}
                </Label>
              </Stack>

              <Stack direction="row" alignItems="flex-start">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 110, fontWeight: 600 }}
                >
                  Created On
                </Typography>
                <Box>
                  <Typography variant="body2">{fDate(ticket.ticket.createdAt)}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {fTime(ticket.ticket.createdAt)}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" alignItems="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 110, fontWeight: 600 }}
                >
                  Event
                </Typography>
                <Typography variant="body2">
                  {ticket.ticket.eventName || `Event ${ticket.ticket.eventId}`}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 110, fontWeight: 600 }}
                >
                  Assigned to
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <div>
                    <Typography variant="body2">
                      {ticket.ticket.assignTo || 'Not yet assigned'}
                    </Typography>
                  </div>
                </Stack>
              </Stack>

              <Stack direction="row" alignItems="flex-start">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 110, fontWeight: 600 }}
                >
                  Updated On
                </Typography>
                <Box>
                  <Typography variant="body2">{fDate(ticket.ticket.updatedAt)}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {fTime(ticket.ticket.updatedAt)}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" alignItems="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 110, fontWeight: 600 }}
                >
                  Priority
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
                  <Iconify
                    icon={
                      (ticket.ticket.priority === 'LOW' && 'eva:arrow-down-fill') ||
                      (ticket.ticket.priority === 'MEDIUM' && 'eva:arrow-right-fill') ||
                      (ticket.ticket.priority === 'HIGH' && 'eva:arrow-up-fill') ||
                      ''
                    }
                    sx={{
                      color: (theme_) =>
                        (ticket.ticket.priority === 'LOW' && theme_.palette.info.main) ||
                        (ticket.ticket.priority === 'MEDIUM' && theme_.palette.warning.main) ||
                        (ticket.ticket.priority === 'HIGH' && theme_.palette.error.main) ||
                        'inherit',
                    }}
                  />
                  {ticket.ticket.priority}
                </Box>
              </Stack>

              <Stack direction="row">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 110, fontWeight: 600 }}
                >
                  Images
                </Typography>
                <Box gap={1} display="grid" gridTemplateColumns="repeat(4, 1fr)">
                  {ticket.details[0]?.attachments?.length > 0 ? (
                    ticket.details[0].attachments.map((image, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={image}
                        sx={{
                          borderRadius: 1,
                          width: 64,
                          height: 64,
                          objectFit: 'cover',
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No images attached
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={5}>
          <Card
            sx={{
              height: 'calc(100vh-100px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ChatContainer>
              <Box
                sx={{
                  p: 3,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1,
                    flex: 1,
                  }}
                >
                  Coversations
                </Typography>
              </Box>
              <MessagesContainer>
                {ticket?.details?.map((msg: ITicketMessage, index: number) => (
                  <Box key={msg.id} sx={{ mb: 3 }}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{
                        mb: 1,
                        justifyContent: msg.userType === 'EXHIBITOR' ? 'flex-end' : 'flex-start',
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
                              border: () => `2px solid ${theme.palette.background.paper}`,
                              boxShadow: () => theme.shadows[2],
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
                              border: () => `2px solid ${theme.palette.background.paper}`,
                              boxShadow: () => theme.shadows[2],
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
              </MessagesContainer>

              {error && (
                <Typography color="error" sx={{ px: 2, py: 1 }}>
                  {error}
                </Typography>
              )}
              <InputContainer>
                {attachments.length > 0 && (
                  <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {attachments.map((file) => (
                      <Box
                        key={file.id}
                        sx={{
                          position: 'relative',
                          width: 64,
                          height: 64,
                          borderRadius: 1,
                          overflow: 'hidden',
                          border: () => `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Box
                          component="img"
                          src={file.preview}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveAttachment(file.id!)}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'rgba(0,0,0,0.7)',
                            },
                          }}
                        >
                          <Iconify icon="eva:close-fill" width={16} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}

                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  />
                  <IconButton
                    component="label"
                    sx={{
                      alignSelf: 'flex-end',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                    <Iconify icon="eva:attach-2-fill" />
                  </IconButton>
                  <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={!message.trim() && attachments.length === 0}
                    sx={{ alignSelf: 'flex-end' }}
                  >
                    <Iconify icon="eva:paper-plane-fill" />
                  </Button>
                </Stack>
              </InputContainer>
            </ChatContainer>
          </Card>
        </Grid>
      </Grid>

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
    </Container>
  );
}
