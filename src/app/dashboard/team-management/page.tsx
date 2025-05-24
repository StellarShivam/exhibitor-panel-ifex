// import TeamManagementView from 'src/sections/team-managment/view';
import { UserListView } from 'src/sections/team-managment/view/index';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Team Management',
};

export default function Page() {
  return <UserListView />;
}
