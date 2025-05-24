'use client';

import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { useSettingsContext } from 'src/components/settings';

import { IChatConversation, IChatParticipant } from 'src/types/chat';
import { mockContacts, mockConversations } from 'src/_mock/_chat';

import ChatNav from '../chat-nav';
import ChatRoom from '../chat-room';
import ChatMessageList from '../chat-message-list';
import ChatMessageInput from '../chat-message-input';
import ChatHeaderDetail from '../chat-header-detail';
import ChatHeaderCompose from '../chat-header-compose';
import { Box } from '@mui/material';
import { ComingSoonIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export default function ChatView() {
  return (
    <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // Center the entire content
          display: 'flex',
          flexDirection: 'column', // Stack items vertically
          alignItems: 'center', // Center items horizontally
          textAlign: 'center', // Center text
        }}
      >
        <ComingSoonIllustration
          sx={{
            width: '150%',
            height: '150%',
            objectFit: 'contain',
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            marginTop: 2, // Add spacing between the illustration and text
          }}
        >
          Coming Soon!
        </Typography>
      </Box>
  )
  // const router = useRouter();

  // const { user } = useMockedUser();

  // const settings = useSettingsContext();

  // const searchParams = useSearchParams();

  // const selectedConversationId = searchParams.get('id') || '';

  // const [recipients, setRecipients] = useState<IChatParticipant[]>([]);

  // // Replace API calls with mock data
  // const contacts = mockContacts;
  // const conversations = {
  //   byId: mockConversations.reduce(
  //     (acc, conv) => {
  //       acc[conv.id] = conv;
  //       return acc;
  //     },
  //     {} as Record<string, IChatConversation>
  //   ),
  //   allIds: mockConversations.map((conv) => conv.id),
  // };
  // const conversationsLoading = false; // Mock loading state
  // const conversation = mockConversations.find((conv) => conv.id === selectedConversationId);
  // const conversationError = !conversation && selectedConversationId ? true : false;

  // const participants: IChatParticipant[] = conversation
  //   ? conversation.participants.filter(
  //       (participant: IChatParticipant) => participant.id !== `${user?.id}`
  //     )
  //   : [];

  // useEffect(() => {
  //   if (conversationError || !selectedConversationId) {
  //     router.push(paths.dashboard.chat);
  //   }
  // }, [conversationError, router, selectedConversationId]);

  // const handleAddRecipients = useCallback((selected: IChatParticipant[]) => {
  //   setRecipients(selected);
  // }, []);

  // const details = !!conversation;

  // const renderHead = (
  //   <Stack
  //     direction="row"
  //     alignItems="center"
  //     flexShrink={0}
  //     sx={{ pr: 1, pl: 2.5, py: 1, minHeight: 72 }}
  //   >
  //     {selectedConversationId ? (
  //       <>{details && <ChatHeaderDetail participants={participants} />}</>
  //     ) : (
  //       <ChatHeaderCompose contacts={contacts} onAddRecipients={handleAddRecipients} />
  //     )}
  //   </Stack>
  // );

  // const renderNav = (
  //   <ChatNav
  //     contacts={contacts}
  //     conversations={conversations}
  //     loading={conversationsLoading}
  //     selectedConversationId={selectedConversationId}
  //   />
  // );

  // const renderMessages = (
  //   <Stack
  //     sx={{
  //       width: 1,
  //       height: 1,
  //       overflow: 'hidden',
  //     }}
  //   >
  //     <ChatMessageList messages={conversation?.messages || []} participants={participants} />

  //     <ChatMessageInput
  //       recipients={recipients}
  //       onAddRecipients={handleAddRecipients}
  //       //
  //       selectedConversationId={selectedConversationId}
  //       disabled={!recipients.length && !selectedConversationId}
  //     />
  //   </Stack>
  // );

  // return (
  //   <Container maxWidth={settings.themeStretch ? false : 'xl'}>
  //     <Typography
  //       variant="h4"
  //       sx={{
  //         mb: { xs: 3, md: 5 },
  //       }}
  //     >
  //       Chat
  //     </Typography>

  //     <Stack component={Card} direction="row" sx={{ height: '72vh' }}>
  //       {renderNav}

  //       <Stack
  //         sx={{
  //           width: 1,
  //           height: 1,
  //           overflow: 'hidden',
  //         }}
  //       >
  //         {renderHead}

  //         <Stack
  //           direction="row"
  //           sx={{
  //             width: 1,
  //             height: 1,
  //             overflow: 'hidden',
  //             borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
  //           }}
  //         >
  //           {renderMessages}

  //           {details && <ChatRoom conversation={conversation} participants={participants} />}
  //         </Stack>
  //       </Stack>
  //     </Stack>
  //   </Container>
  // );
}
