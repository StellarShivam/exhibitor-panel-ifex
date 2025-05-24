// import ExhibitorProfileView from 'src/sections/exhibitor-profile/view';
// import { UserProfileView } from 'src/sections/exhibitor-profile/view/index';
import DocumentsUploadView from 'src/sections/documents-upload/view/documents-upload-view';
// ----------------------------------------------------------------------
// import FileManagerView from 'src/sections/file-manager/view/user-document-upload';

export const metadata = {
  title: 'Dashboard: Documents Upload',
};

export default function Page() {
  return <DocumentsUploadView />;
}
