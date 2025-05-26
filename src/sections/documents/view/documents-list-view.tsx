'use client';

import { useState, useMemo } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

import { useEventContext } from 'src/components/event-context';

import Iconify from 'src/components/iconify';
import {
  useGetRequiredDocuments,
  useGetUserUploadedDocuments,
  useGetExhibitorUploadedDocuments,
  useGetExhibitorProformaInvoice,
} from 'src/api/documents-upload';

import UserDocumentUpload from './user-document-upload';
import EntityDocumentUpload from './entity-document-upload';
import FileManagerTable from '../file-manager-table';

const getFileType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return extension;
};

export default function DocumentsListView() {
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

  const {
    proforma: proformaInvoice,
    proformaLoading: proformaLoading,
    proformaError: proformaError,
    reFetchExhibitorproforma: reFetchExhibitorproforma,
  } = useGetExhibitorProformaInvoice(eventData?.state?.eventId);

  console.log('userDocuments:---------', userDocuments);
  console.log('exhibitorDocuments:---------', exhibitorDocuments);
  console.log('uploadedDocuments:---------', exhibitorUploadedDocuments);
  console.log('proformaInvoice:---------', proformaInvoice);

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
          Documents
        </Typography>
      </Box>

      {/* Proforma Invoice Table */}
      {proformaInvoice?.proformaInvoice ? (
        <TableContainer sx={{ my: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>File Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Proforma Invoice</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.open(proformaInvoice.proformaInvoice, '_blank')}
                  >
                    View Document
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ):
      (
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No Documents available.
          </Typography>
        </Box>
      )}


      {/* <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: 3,
        }}
      >
        <Tab
          label="User Document"
          value="user"
          icon={<Iconify icon="solar:user-id-bold" width={20} />}
          iconPosition="start"
        />
        <Tab
          label="Entity Document"
          value="entity"
          icon={<Iconify icon="solar:document-add-bold" width={20} />}
          iconPosition="start"
        />
      </Tabs> */}

      {/* {currentTab === 'user' && (
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
          documentType="entity"
          uploadedDocuments={exhibitorUploadedDocuments}
          isLoading={documentsLoading || exhibitorUploadedDocsLoading}
          onRefresh={() => {
            reFetchDocuments();
            reFetchExhibitorUploadedDocs();
          }}
        />
      )} */}
    </Container>
  );
}
