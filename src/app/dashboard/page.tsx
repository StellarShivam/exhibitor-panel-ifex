'use client';

import { useEffect } from 'react';

import { useRouter } from 'src/routes/hooks';

// import { PATH_AFTER_LOGIN } from 'src/config-global';

// ----------------------------------------------------------------------

// export const metadata = {
//   title: 'Dashboard: One',
// };

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/overview');
  }, [router]);

  return null;
}
