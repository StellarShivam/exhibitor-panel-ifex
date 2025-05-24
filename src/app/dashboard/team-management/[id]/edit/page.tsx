import { _userList } from 'src/_mock/_user';

import { UserEditView } from 'src/sections/team-managment/view/index';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: User Edit',
};

type Props = {
  params: {
    id: number;
  };
};

export default function UserEditPage({ params }: Props) {
  const { id } = params;

  return <UserEditView id={id} />;
}

// export async function generateStaticParams() {
//   return _userList.map((user) => ({
//     id: user.id,
//   }));
// }
