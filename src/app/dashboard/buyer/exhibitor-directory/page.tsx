import { featureFlags } from 'src/config-global';
import { ExhibitorDirectoryListView } from 'src/sections/exhibitor-directory/view';
import NotFoundView from 'src/sections/error/not-found-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Exhibitor Directory',
};

export default function ExhibitorDirectoryPage() {
  if(!featureFlags.exhibitorDirectory) {
    return <NotFoundView />;
  }
  return <ExhibitorDirectoryListView />;
}
