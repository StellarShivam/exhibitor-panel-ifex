import Box from '@mui/material/Box';

import { useBoolean } from 'src/hooks/use-boolean';

import Header from './header';
import Main from './main';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function ListLayout({ children }: Props) {
  const nav = useBoolean();

  return (
    <>
      <Header onOpenNav={nav.onTrue} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Main>{children}</Main>
      </Box>
    </>
  );
}
