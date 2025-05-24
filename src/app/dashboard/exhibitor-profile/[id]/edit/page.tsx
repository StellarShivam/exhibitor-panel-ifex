import { _userList } from 'src/_mock/_user';

import { UserEditView } from 'src/sections/exhibitor-profile/view/index';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Exhibitor Profile Edit',
};

type Props = {
  params: {
    id: string;
  };
};

// Add generateStaticParams function
// export async function generateStaticParams() {
//   // Replace this with your actual logic to fetch or define IDs
  

//   return [ { id: '1' },
//   { id: '2' },
//   { id: '37' },];
// }

export default function UserEditPage({ params }: Props) {
  const { id } = params;

  return <UserEditView id={id} />;
}
