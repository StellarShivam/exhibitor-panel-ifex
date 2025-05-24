import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Image from 'src/components/image';

// ----------------------------------------------------------------------

type Product = {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Macbook',
    category: 'Gadgets',
    imageUrl:
      'https://media-hosting.imagekit.io/2001376113ea4dac/julian-o-hayon-Bs-zngH79Ds-unsplash.jpg?Expires=1838532170&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=DIvR3RVuMclLVcNEvZlmI3TGWgyT1JvvH7IRmeQ558jVLt7IUO2blX3DiJpAsqVgOj7DauvWf1FiTONL8oC~LsUMZ5Co~K8Nmlv1foD6m6lowY1mjVsAGRpSBLV-Xzwo1CjRZxnp~jt7rEOaQasuK6m12KTQAJJivmdcGHhoHGxsVRQxt9oMtqwpvikROnrAYKWa1HVLzHsL6~Rk~cWpR5gfrErWLDlBIYEJn-8cBaT-aX7bc~m4p5dfoHDcd-L8V3ebdAA3~QrILwaOBz6ASuZ3z0JX37~OdKg0zwEIdaDC0unaVM2txiBn4oA8hdIlrtnGuKSnV6pPOwPluLsw7g__',
  },
  {
    id: 2,
    name: 'Chanel',
    category: 'Perfume',
    imageUrl:
      'https://media-hosting.imagekit.io/5ee48708c8bf425d/laura-chouette-_ODRA1MPL1I-unsplash.jpg?Expires=1838532170&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=UHWtEezNbo8fQet6qyqs6wwlDQSro-w32M8M0OLzBP2wnRNCX~dxxVqrPjYEPzB6LxQwhjfKIXiX4ekDb0RzQh1U-C2fNMphlPEH3Tmnn4y72gDnKScLrpCQVORPgB47KTPZ9QMILBBrLduimG-uSD7uvSDT3fWycl3k-yK-MpeD5YVEx-Z0ngq~JkEKjR8oOUbopFbS9Bc88Ifj5wk9s9lKWmtFTMMNYkaZFpWkZMD1GC-GE5t2texlkYJ7xxFyuBnggDNmkU0ZFKk2B9SCQT7x1iWtWTWAo1d6-9PD7mX1eBfxNMN1Hpxy8cRlqKP5z8QbCMTvuwAbCi886poGPQ__',
  },
  {
    id: 3,
    name: 'Apple Watch',
    category: 'Watches',
    imageUrl:
      'https://media-hosting.imagekit.io/d45775f1fa9f4cb9/daniel-korpai-hbTKIbuMmBI-unsplash%20(1).jpg?Expires=1838532170&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Sx0esAK2Df59XiHlVKsQAExdu8hMRzxZwwYudLHtyg64zoclk2ztIXHhXvOCPkqzbqapIktrB6Pz4ytlKxxZCpwsljgn0cd~ynVwWrYMpz-qEv~8fKiK-RVrd6jNQMbZ9s8menrqEWB5K8Wfdmv0UzjHj-jKvQR-hlQS3IzoFwC5GLsYfYMRywCGquJjSMAXYPKXzr~x~tcwpz3cE07WafuSpu2-MsosvcvOGbGIlhvSk5i20JQEYpZAtk9MAUlsCMXQlC8DXdYKGDIRlpJD43uEXx9DdoIEBxurAmn1~6pwVHKaQjtzbFSdob0ktD2~HU1Go5nWbgCnvo7bFLdrRA__',
  },
  {
    id: 4,
    name: 'Nike Shoes',
    category: 'Shoes',
    imageUrl:
      'https://media-hosting.imagekit.io/e29716ebaed444ba/imani-bahati-LxVxPA1LOVM-unsplash.jpg?Expires=1838532170&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=SpBQpoNSV~20LUA1qEgeahJj3o~Vz4dbUVDVvMOGfScKRUw0uFRu~jAvBgTCO3pbghXz-KfvEkvmKcU5~qcJ2CISdgvRlGQcPoln8FGKno65AbXd578N8WTJUwERHULL3fNtmRA12H9U4cwKor3bi5dbIa9qZ0cbbFQlAmH7ueXE4-0LZEZU2rdP084FWCEKG4tRqXYmQj9OQndrSV3T7Y~lER4SxxpWzoYyyddS3CHyWCc4-ioU~dW1XDhPo90VgHObZ70JTdo8YiiKyKp0eacvXJyoriBXR0TA-ly0mT~NPSz5bvKtN6v7IHYpV-CyivntoBjkddD3VzimP~Ha-Q__',
  },
];

// ----------------------------------------------------------------------

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      sx={{
        p: 0,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: (theme) => theme.customShadows.z8,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <Image
          alt={product.name}
          src={product.imageUrl}
          sx={{
            top: 0,
            width: 1,
            height: 1,
            objectFit: 'cover',
            position: 'absolute',
          }}
        />
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {product.category}
        </Typography>
      </Box>
    </Card>
  );
}

export default function ProductPortfolio() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, mt: 6 }}>
        Product Portfolio
      </Typography>

      <Grid container spacing={3}>
        {PRODUCTS.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={4}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
