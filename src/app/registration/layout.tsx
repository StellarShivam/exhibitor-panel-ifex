'use client';

import { AuthGuard } from 'src/auth/guard';
// import DashboardLayout from 'src/layouts/dashboard';
import ListLayout from 'src/layouts/list';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <ListLayout>{children}</ListLayout>
    </AuthGuard>
  );
}
