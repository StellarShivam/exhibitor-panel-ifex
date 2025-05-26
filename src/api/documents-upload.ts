import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import axios, { fetcher, apiEndpoints, tokenManager, axiosInstance2 } from 'src/utils/axios';

import { IRequiredDocuments, IUploadedDocuments, IRemoveUploadRequest } from 'src/types/documents';

// ----------------------------------------------------------------------

export function useGetRequiredDocuments(eventId: number) {
  const URL = apiEndpoints.documentsUpload.listing + eventId;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const reFetchDocuments = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(() => {
    const allDocuments = (data as IRequiredDocuments[]) || [];

    const userDocuments = allDocuments.filter((doc) => doc.userType === 'EXHIBITOR_USER');
    const exhibitorDocuments = allDocuments.filter((doc) => doc.userType === 'EXHIBITOR_ENTITY');

    return {
      allDocuments,
      userDocuments,
      exhibitorDocuments,
      documentsLoading: isLoading,
      documentsError: error,
      documentsValidating: isValidating,
      documentsEmpty: !isLoading && !allDocuments?.length,
      reFetchDocuments,
    };
  }, [data, error, isLoading, isValidating, reFetchDocuments]);

  return memoizedValue;
}

export function useGetUserUploadedDocuments(userId: number) {
  const URL = apiEndpoints.teamManagement.details + userId;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const reFetchUserUploadedDocs = useCallback(() => mutate(URL), [URL]);

  const memoizedValue = useMemo(
    () => ({
      documents: (data?.documents?.data as IUploadedDocuments) || [],
      documentsLoading: isLoading,
      documentsError: error,
      documentsValidating: isValidating,
      documentsEmpty: !isLoading && !data?.documents?.data?.length,
      reFetchUserUploadedDocs,
    }),
    [data, error, isLoading, isValidating, reFetchUserUploadedDocs]
  );

  return memoizedValue;
}

export function useGetExhibitorUploadedDocuments(exhibitorIdId: number) {
  const URL = apiEndpoints.exhibitorProfile.details + exhibitorIdId;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const reFetchExhibitorUploadedDocs = useCallback(() => mutate(URL), [URL]);

  console.log('*******', data);

  const memoizedValue = useMemo(
    () => ({
      documents: (data?.exhibitorDetails?.documents?.data as IUploadedDocuments) || [],
      documentsLoading: isLoading,
      documentsError: error,
      documentsValidating: isValidating,
      documentsEmpty: !isLoading && !data?.documents?.data?.length,
      reFetchExhibitorUploadedDocs,
    }),
    [data, error, isLoading, isValidating, reFetchExhibitorUploadedDocs]
  );

  return memoizedValue;
}
export function useGetExhibitorProformaInvoice(eventID: number) {
  const URL = apiEndpoints.documentsUpload.proforma + eventID;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const reFetchExhibitorproforma = useCallback(() => mutate(URL), [URL]);

  console.log('Proforma : *******', data);

  const memoizedValue = useMemo(
    () => ({
      proforma: (data) || {},
      proformaLoading: isLoading,
     proformaError: error,
      proformaValidating: isValidating,
      proformaEmpty: !isLoading && !data?.data == null,
      reFetchExhibitorproforma,
    }),
    [data, error, isLoading, isValidating, reFetchExhibitorproforma]
  );

  return memoizedValue;
}

export function useRemoveUploadUserDoc() {
  const removeUploadUserDoc = async (requestData: IRemoveUploadRequest) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post(apiEndpoints.teamManagement.update, requestData, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (err: any) {
      return err;
    }
  };

  return {
    removeUploadUserDoc,
  };
}

export function useRemoveUploadExhibitorDoc() {
  const removeUploadExhibitorDoc = async (requestData: IRemoveUploadRequest) => {
    const AUTH_TOKEN = tokenManager.getToken();

    try {
      const response = await axiosInstance2.post(
        apiEndpoints.exhibitorProfile.update,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (err: any) {
      return err;
    }
  };

  return {
    removeUploadExhibitorDoc,
  };
}

export function useDocumentUpload() {
  const uploadFile = async (file: File) => {
    const URL = `${apiEndpoints.base}${apiEndpoints.common.fileUpload}`;
    const AUTH_TOKEN = tokenManager.getToken();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      console.log('File upload response:', response);

      return response.data;
    } catch (err: any) {
      console.error('File upload error:', err);
      return err;
    }
  };

  return {
    uploadFile,
  };
}
