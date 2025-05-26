'use client';

import { useState, useMemo } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { useEventContext } from 'src/components/event-context';

import Iconify from 'src/components/iconify';
import {
  useGetRequiredDocuments,
  useGetUserUploadedDocuments,
  useGetExhibitorUploadedDocuments,
} from 'src/api/documents-upload';

import UserDocumentUpload from './user-document-upload';
import EntityDocumentUpload from './entity-document-upload';

const getFileType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return extension;
};

export default function DocumentsUploadView() {
  const [currentTab, setCurrentTab] = useState('user');

  const { eventData } = useEventContext();

  const {
    allDocuments,
    userDocuments,
    exhibitorDocuments,
    documentsLoading,
    documentsError,
    reFetchDocuments,
  } = useGetRequiredDocuments(eventData?.state?.eventId);

  const {
    documents: userUploadedDocuments,
    documentsLoading: userUploadedDocsLoading,
    documentsError: uploadedDocsError,
    reFetchUserUploadedDocs,
  } = useGetUserUploadedDocuments(eventData?.state?.exhibitorUserId);

  const {
    documents: exhibitorUploadedDocuments,
    documentsLoading: exhibitorUploadedDocsLoading,
    documentsError: exhibitorUploadedDocsError,
    reFetchExhibitorUploadedDocs,
  } = useGetExhibitorUploadedDocuments(eventData?.state?.exhibitorId);

  console.log('userDocuments:---------', userDocuments);
  console.log('exhibitorDocuments:---------', exhibitorDocuments);
  console.log('uploadedDocuments:---------', exhibitorUploadedDocuments);

  const userDocumentsList = useMemo(
    () =>
      userDocuments.map((doc) => {
        const uploadedDoc = userUploadedDocuments?.find(
          (uploaded) => uploaded.name.toLowerCase() === doc.documentName.toLowerCase()
        );
        return {
          id: doc.documentName,
          name: doc.documentName,
          url: uploadedDoc?.link || '',
          type: uploadedDoc ? getFileType(uploadedDoc.documentName) : '',
          size: uploadedDoc?.size || 0,
          createdAt: uploadedDoc?.uploadedAt || doc.createdAt,
          status: uploadedDoc?.verified || false,
        };
      }),
    [userDocuments, userUploadedDocuments]
  );

  // Transform exhibitor documents
  const exhibitorDocumentsList = useMemo(
    () =>
      exhibitorDocuments.map((doc) => {
        const uploadedDoc = exhibitorUploadedDocuments?.find(
          (uploaded) => uploaded.name.toLowerCase() === doc.documentName.toLowerCase()
        );
        return {
          id: doc.documentName,
          name: doc.documentName,
          url: uploadedDoc?.link || '',
          type: uploadedDoc ? getFileType(uploadedDoc.documentName) : '',
          size: uploadedDoc?.size || 0,
          createdAt: uploadedDoc?.uploadedAt || doc.createdAt,
          status: uploadedDoc?.verified || false,
        };
      }),
    [exhibitorDocuments, exhibitorUploadedDocuments]
  );

  console.log('userDocumentsList:---------', userDocumentsList);
  console.log('exhibitorDocumentsList:---------', exhibitorDocumentsList);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 0 }}>
        <Typography variant="h4" gutterBottom>
          Documents Upload
        </Typography>
        {/* <Breadcrumbs separator={<Iconify icon="eva:chevron-right-fill" />} aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="#">
            Dashboard
          </Link>
          <Typography color="text.primary">Documents Upload</Typography>
        </Breadcrumbs> */}
      </Box>

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: 3,
        }}
      >
        <Tab
          label="Exhbitor Team Documents"
          value="user"
          icon={<Iconify icon="solar:user-id-bold" width={20} />}
          iconPosition="start"
        />
        <Tab
          label="Exhibitor Entity Documents"
          value="entity"
          icon={<Iconify icon="solar:document-add-bold" width={20} />}
          iconPosition="start"
        />
      </Tabs>

      {currentTab === 'user' && (
        <UserDocumentUpload
          documents={userDocumentsList}
          documentType="user"
          uploadedDocuments={userUploadedDocuments}
          isLoading={documentsLoading || userUploadedDocsLoading}
          onRefresh={() => {
            reFetchDocuments();
            reFetchUserUploadedDocs();
          }}
        />
      )}
      {currentTab === 'entity' && (
        <UserDocumentUpload
          documents={exhibitorDocumentsList}
          documentType="EXHIBITOR_ENTITY"
          uploadedDocuments={exhibitorUploadedDocuments}
          isLoading={documentsLoading || exhibitorUploadedDocsLoading}
          onRefresh={() => {
            reFetchDocuments();
            reFetchExhibitorUploadedDocs();
          }}
        />
      )}
    </Container>
  );
}
