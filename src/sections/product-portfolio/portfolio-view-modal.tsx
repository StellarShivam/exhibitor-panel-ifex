import { Dialog, DialogContent, Box, Typography, Grid, Card, Stack, alpha } from '@mui/material';
import { IProductItemNew } from 'src/types/product';
import { styled } from '@mui/material/styles';
import Image from 'src/components/image';
import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '210mm',
    height: '297mm',
    maxWidth: '90vw',
    maxHeight: '90vh',
    backgroundColor: theme.palette.background.paper,
  },
}));

const ProductCard = styled(Box)(({ theme }) => ({
  height: '100%', // This ensures all cards in a row are same height
  padding: theme.spacing(3),
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  transition: 'all 0.3s ease-in-out',
}));

const ProductImage = styled(Image)({
  width: '100%',
  maxWidth: '300px',
  height: 'auto',
  backgroundColor: '#F5F5F1',
  margin: '0 auto',
  display: 'block',
});

const ProductTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.3rem',
  fontWeight: 700,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  textTransform: 'uppercase',
}));

const ProductPrice = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 500,
  marginBottom: theme.spacing(1),
}));

const ProductDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  pdfUrl?: string | null;
  products?: IProductItemNew[];
};

export default function PortfolioViewModal({ open, onClose, pdfUrl, products }: Props) {
  if (!open) return null;

  if (pdfUrl) {
    return (
      <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogContent>
          <Box sx={{ height: '100%', width: '100%' }}>
            <iframe
              src={pdfUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Portfolio PDF"
            />
          </Box>
        </DialogContent>
      </StyledDialog>
    );
  }

  if (products && products.length > 0) {
    return (
      <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogContent>
          <Box sx={{ p: 4 }}>
            <Typography
              variant="h1"
              sx={{
                textAlign: 'center',
                mb: 3,
                '& .product': {
                  display: 'block',
                  fontSize: '3rem',
                  fontWeight: 900,
                  marginBottom: '4px',
                  letterSpacing: '0.04em',
                  fontFamily: "'Playfair Display', serif",
                  color: 'text.primary',
                },
                '& .portfolio': {
                  display: 'block',
                  fontSize: '2.5rem',
                  fontWeight: 500,
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  letterSpacing: '0.05em',
                  color: 'text.primary',
                  marginTop: '-4px',
                },
              }}
            >
              <span className="product">PRODUCT</span>
              <span className="portfolio">Portfolio</span>
            </Typography>

            <Grid
              container
              spacing={3}
              sx={{
                '& .MuiGrid-item': {
                  paddingTop: 4,
                },
              }}
            >
              {products.map((product) => {
                // Calculate price with tax
                const priceWithTax = product.salePrice * (1 + (product.tax || 0) / 100);

                return (
                  <Grid item xs={12} sm={6} key={product.id}>
                    <ProductCard>
                      <ProductImage
                        src={product.images?.[0] || '/assets/placeholder.svg'}
                        alt={product.productName}
                        ratio="1/1"
                      />
                      <ProductTitle>{product.productName}</ProductTitle>
                      <ProductPrice>{fCurrency(priceWithTax)}</ProductPrice>
                      <ProductDescription>{product.subDescription}</ProductDescription>
                    </ProductCard>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </DialogContent>
      </StyledDialog>
    );
  }

  return null;
}
