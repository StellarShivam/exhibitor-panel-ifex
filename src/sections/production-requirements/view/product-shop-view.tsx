'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import orderBy from 'lodash/orderBy';

import Stack from '@mui/material/Stack';
import Box, { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';

import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import {
  useGetCategories,
  useGetSubCategories,
  useGetProducts,
  useGetCart,
} from 'src/api/production-requirements';
import { PRODUCT_SORT_OPTIONS } from 'src/_mock';

import { ICategoryItem, ISubCategoryItem, IProductItem } from 'src/types/production-requirements';
import { useEventContext } from 'src/components/event-context';
// import { useCheckoutContext } from '../../checkout/context';
import { Card, CardContent, CardMedia } from '@mui/material';

import ProductList from '../product-list';
import ProductSort from '../product-sort';
import CartIcon from '../common/cart-icon';
import CartSidebar from '../cart/cart-sidebar';
import SpecialRequestForm from '../product-special-request';
import { ComingSoonIllustration } from 'src/assets/illustrations';
// ----------------------------------------------------------------------

export default function ProductShopView() {
  const settings = useSettingsContext();
  const cartOpen = useBoolean();
  const specialRequest = useBoolean();

  const { eventData } = useEventContext();

  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);

  const { categories, categoriesLoading } = useGetCategories();
  console.log('categories:::::::::::::::::::::::::::::::::', categories);
  const { subCategories, subCategoriesLoading } = useGetSubCategories(
    selectedCategoryId || undefined
  );
  const { products, productsLoading } = useGetProducts(eventData?.state.eventId);
  const { cart, totalAmount, cartId, cartLoading } = useGetCart(eventData?.state.eventId);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(null);
  };

  const handleSubcategoryClick = (subCategoryId: number) => {
    setSelectedSubCategoryId(subCategoryId === selectedSubCategoryId ? null : subCategoryId);
  };

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const dataFiltered = applyFilter({
    inputData: products || [],
    selectedCategoryId,
    selectedSubCategoryId,
    categories,
    subCategories,
    sortBy,
    searchQuery,
  });

  const renderFilters = (
    <Stack spacing={2} sx={{ mb: 2 }}>
      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
      >
        <TextField
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search product..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" spacing={1} flexShrink={0}>
          <ProductSort sort={sortBy} onSort={handleSortBy} sortOptions={PRODUCT_SORT_OPTIONS} />
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ px: 0, flexWrap: 'wrap', gap: 1 }}>
        <Chip
          key="all"
          label="All Products"
          onClick={() => handleCategoryChange(null)}
          sx={{
            typography: 'body2',
            color: !selectedCategoryId ? 'primary.contrastText' : 'text.primary',
            bgcolor: !selectedCategoryId ? 'info.main' : 'background.paper',
            '&:hover': {
              bgcolor: !selectedCategoryId ? 'info.dark' : 'background.neutral',
            },
          }}
        />
        {categories?.map((category) => (
          <Chip
            key={category.id}
            label={category.categoryName}
            onClick={() => handleCategoryChange(category.id)}
            sx={{
              typography: 'body2',
              color: selectedCategoryId === category.id ? 'primary.contrastText' : 'text.primary',
              bgcolor: selectedCategoryId === category.id ? 'info.main' : 'background.paper',
              '&:hover': {
                bgcolor: selectedCategoryId === category.id ? 'info.dark' : 'background.neutral',
              },
            }}
          />
        ))}
      </Stack>

      {selectedCategoryId && subCategories && subCategories.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ px: 0, flexWrap: 'wrap', gap: 1 }}>
          {subCategories.map((subCategory) => (
            <Chip
              key={subCategory.id}
              label={subCategory.subCategoryName}
              onClick={() => handleSubcategoryClick(subCategory.id)}
              sx={{
                typography: 'body2',
                color:
                  selectedSubCategoryId === subCategory.id
                    ? 'primary.contrastText'
                    : 'text.primary',
                bgcolor:
                  selectedSubCategoryId === subCategory.id ? 'info.main' : 'background.paper',
                '&:hover': {
                  bgcolor:
                    selectedSubCategoryId === subCategory.id ? 'info.dark' : 'background.neutral',
                },
              }}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );

  const renderNotFound = (
    <EmptyContent
      filled
      title="No Products Found"
      sx={{ py: 10 }}
      description={
        searchQuery
          ? `No results found for "${searchQuery}". Try checking for typos or using complete words.`
          : 'No products match the selected filters.'
      }
    />
  );

  const isLoading = categoriesLoading || subCategoriesLoading || productsLoading;

  const itemsIncluded = [
    {
      id: 1,
      name: 'Table',
      image:
        'https://t3.ftcdn.net/jpg/01/96/73/92/360_F_196739274_vHDOtbnGAoQWzTFhCJsIFTpAfg0O9zSu.jpg',
      category: 'Furniture',
    },
    {
      id: 3,
      name: 'Light',
      image:
        'https://ghdisplay.b-cdn.net/app/uploads/2024/10/LED-light-with-clamp.jpg?width=1837.5',
      category: 'Electronics',
    },
    {
      id: 2,
      name: 'Chair',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxt3yLfYFefr09-NdQ8_EA--qUJ4Yp5GjFrg&s',
      category: 'Furniture',
    },
    {
      id: 4,
      name: 'Fan',
      image:
        'https://image.made-in-china.com/2f0j00StmkFWhrAqoQ/New-Model-DC-Standing-Fan-with-LCD-Touch-Display.webp',
      category: 'Electronics',
    },
  ];

  const renderItemsIncluded = (
    <Stack
      direction="column"
      justifyContent="space-between"
      alignItems="start"
      gap="3"
      sx={{ mb: 3 }}
    >
      <Typography variant="body1" sx={{ mb: 2 }}>
        Items Included in your package
      </Typography>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(4 , 1fr)',
        }}
      >
        {itemsIncluded.map((item) => (
          <Card
            key={item.id}
            variant="elevation"
            elevation={3}
            sx={{
              bgcolor: 'success.lighter',
              borderRadius: 2,
              boxShadow: (theme) => theme.customShadows.z8,
              width: 160,
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              justifyContent: 'center',
              gap: 1,
              height: 'full',
            }}
          >
            <CardMedia
              component="img"
              image={item.image}
              alt={item.name}
              width={160}
              height={160}
              sx={{ borderRadius: 2, objectFit: 'fill' }}
            />
            <Stack sx={{ mb: 1, px: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {item.category}
              </Typography>
              <Typography variant="body1" fontWeight={600} color="text.primary">
                {item.name}
              </Typography>
            </Stack>
          </Card>
        ))}
      </Box>
    </Stack>
  );
  // return (
  //   <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 15 }}>
  //     <CartIcon totalItems={cart?.length || 0} onClick={cartOpen.onTrue} />

  //     <CartSidebar open={cartOpen.value} onClose={cartOpen.onFalse} />

  //     <CustomBreadcrumbs
  //       heading="Production Requirements"
  //       links={[
  //         { name: 'Dashboard', href: paths.dashboard.root },
  //         { name: 'Production Requirements', href: paths.dashboard.root },
  //         { name: 'Shop' },
  //       ]}
  //       action={
  //         <Button
  //           onClick={specialRequest.onTrue}
  //           variant="contained"
  //           startIcon={<Iconify icon="mingcute:add-line" />}
  //         >
  //           Special Request
  //         </Button>
  //       }
  //       sx={{
  //         mb: { xs: 3, md: 5 },
  //       }}
  //     />

  //     <SpecialRequestForm open={specialRequest.value} onClose={specialRequest.onFalse} />

  //     {renderItemsIncluded}

  //     {/* <Stack
  //       direction="column"
  //       justifyContent="space-between"
  //       alignItems="start"
  //       gap="3"
  //       sx={{ mb: 3 }}
  //     >
  //       <Typography variant="body1" sx={{ mb: 2 }}>
  //         Items Included in your package
  //       </Typography>
  //       <Stack direction="row" spacing={1}>
  //         <Card
  //           variant="elevation"
  //           elevation={3}
  //           sx={{
  //             bgcolor: 'success.lighter',
  //             borderRadius: 2,
  //             boxShadow: (theme) => theme.customShadows.z8,
  //             width: 160,
  //             p: 2,
  //             display: 'flex',
  //             flexDirection: 'column',
  //             alignItems: 'start',
  //             justifyContent: 'center',
  //             gap: 1,
  //             height: 'full',
  //           }}
  //         >
  //           <CardMedia
  //             component="img"
  //             image="https://t3.ftcdn.net/jpg/01/96/73/92/360_F_196739274_vHDOtbnGAoQWzTFhCJsIFTpAfg0O9zSu.jpg"
  //             alt="Table"
  //             width={160}
  //             height={160}
  //             sx={{ borderRadius: 2, objectFit: 'fill' }}
  //           />
  //           <Typography variant="subtitle2" color="text.secondary">
  //             Furniture
  //           </Typography>
  //           <Typography variant="body1" fontWeight={600} color="text.primary">
  //             Table
  //           </Typography>
  //         </Card>
  //       </Stack>
  //     </Stack> */}

  //     {renderFilters}

  //     {isLoading ? (
  //       <Typography>Loading...</Typography>
  //     ) : (
  //       <>
  //         {dataFiltered.length > 0 ? (
  //           <ProductList products={dataFiltered} loading={isLoading} />
  //         ) : (
  //           renderNotFound
  //         )}
  //       </>
  //     )}
  //   </Container>
  // );

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Center the entire content
        display: 'flex',
        flexDirection: 'column', // Stack items vertically
        alignItems: 'center', // Center items horizontally
        textAlign: 'center', // Center text
      }}
    >
      <ComingSoonIllustration
        sx={{
          width: '150%',
          height: '150%',
          objectFit: 'contain',
        }}
      />
      <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          marginTop: 2, // Add spacing between the illustration and text
        }}
      >
        Coming Soon!
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  selectedCategoryId,
  selectedSubCategoryId,
  categories,
  subCategories,
  sortBy,
  searchQuery,
}: {
  inputData: IProductItem[];
  selectedCategoryId: number | null;
  selectedSubCategoryId: number | null;
  categories: ICategoryItem[] | undefined;
  subCategories: ISubCategoryItem[] | undefined;
  sortBy: string;
  searchQuery: string;
}) {
  let filteredData = [...inputData];

  filteredData = filteredData.filter((product) => product.status === 'ACTIVE');

  if (selectedCategoryId && categories) {
    const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);
    if (selectedCategory) {
      filteredData = filteredData.filter(
        (product) => product.category === selectedCategory.categoryName
      );
    }
  }

  if (selectedSubCategoryId && subCategories) {
    const selectedSubCategory = subCategories.find((subCat) => subCat.id === selectedSubCategoryId);
    if (selectedSubCategory) {
      filteredData = filteredData.filter(
        (product) => product.subCategory === selectedSubCategory.subCategoryName
      );
    }
  }

  if (searchQuery) {
    filteredData = filteredData.filter(
      (product) => product.productName.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
    );
  }

  if (sortBy === 'featured') {
    filteredData = orderBy(filteredData, ['totalSold'], ['desc']);
  }

  if (sortBy === 'newest') {
    filteredData = orderBy(filteredData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'priceDesc') {
    filteredData = orderBy(filteredData, ['price'], ['desc']);
  }

  if (sortBy === 'priceAsc') {
    filteredData = orderBy(filteredData, ['price'], ['asc']);
  }

  return filteredData;
}
