export interface IRequiredDocuments {
  id: number;
  eventId: number;
  userType: string;
  documentName: string;
  status?: boolean;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUploadedDocument {
  name: string;
  verified: boolean;
  link: string;
  uploadedAt: string;
  documentName: string;
  size: number;
}

export type IUploadedDocuments = IUploadedDocument[];

export interface IProcessedDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
  status?: boolean;
}

export interface DocumentUploadProps {
  documents: IProcessedDocument[];
  documentType: string;
  uploadedDocuments: IUploadedDocuments;
  isLoading: boolean;
  onRefresh: () => void;
}

export interface IRemoveUploadRequest {
  id: number;
  eventId: number;
  documents: {
    data: {
      name: string;
      link: string;
      size: number;
      verified: boolean;
      uploadedAt: string;
      documentName: string;
    }[];
  };
}
