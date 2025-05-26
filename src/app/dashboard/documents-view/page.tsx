// import ExhibitorProfileView from 'src/sections/exhibitor-profile/view';
// import { UserProfileView } from 'src/sections/exhibitor-profile/view/index';
import DocumentsListView from 'src/sections/documents/view/documents-list-view';
// ----------------------------------------------------------------------
// import FileManagerView from 'src/sections/file-manager/view/user-document-upload';

export const metadata = {
  title: 'Dashboard: Documents Upload',
};

export default function Page() {
  return <DocumentsListView />;
}
