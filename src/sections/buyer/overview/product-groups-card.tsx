import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

const COLORS = ['#FFE5E5', '#E5F3FF', '#E5FFE5', '#FFF9E5', '#F0E5FF', '#FFE5F5'];

const getCleanText = (text: string): string => {
  // Remove leading numbers like "2.", "2.1", etc.
  return text.replace(/^\d+(\.\d+)*\s+/, '').trim();
};

const getColorByIndex = (index: number): string => {
  return COLORS[index % COLORS.length];
};

type ProductGroup = {
  productGroupId: number;
  productGroupName: string;
  productCategories: string[];
};

type Props = {
  productGroups?: ProductGroup[];
};

export default function ProductGroupsCard({ productGroups = [] }: Props) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows?.z16 || undefined,
      }}
    >
      <Stack spacing={2.5}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Product Group Interests
        </Typography>

        {productGroups.length ? (
          <Stack spacing={2.5}>
            {productGroups.map((group, index) => {
              const groupColor = getColorByIndex(index);
              const cleanGroupName = getCleanText(group.productGroupName);

              return (
                <Stack key={group.productGroupId ?? index} spacing={1.25}>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 1,
                      bgcolor: groupColor,
                      display: 'inline-block',
                      width: 'fit-content',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                      }}
                    >
                      {cleanGroupName || 'Untitled group'}
                    </Typography>
                  </Box>

                  {Array.isArray(group.productCategories) && group.productCategories.length ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {group.productCategories.map((category, categoryIndex) => (
                        <Box
                          key={`${category}-${categoryIndex}`}
                          sx={{
                            px: 1.25,
                            py: 0.5,
                            borderRadius: 0.75,
                            bgcolor: 'grey.100',
                            color: 'text.primary',
                            typography: 'body2',
                            border: `1px solid ${theme.palette.grey[300]}`,
                          }}
                        >
                          {getCleanText(category)}
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No categories selected.
                    </Typography>
                  )}
                </Stack>
              );
            })}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No product groups selected yet.
          </Typography>
        )}
      </Stack>
    </Card>
  );
}
