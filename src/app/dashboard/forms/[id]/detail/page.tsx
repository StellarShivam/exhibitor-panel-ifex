import { _userList } from 'src/_mock/_user';

import { FormsEditView } from 'src/sections/forms/view';

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

  return <FormsEditView id={id} />;
}

// export async function generateStaticParams() {
//   return _userList.map((user) => ({
//     id: user.id,
//   }));
// }
