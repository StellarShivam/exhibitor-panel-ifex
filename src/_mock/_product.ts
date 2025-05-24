import { IProductItem } from 'src/types/product';

// ----------------------------------------------------------------------

export const PRODUCT_GENDER_OPTIONS = [
  { label: 'Men', value: 'Men' },
  { label: 'Women', value: 'Women' },
  { label: 'Kids', value: 'Kids' },
];

export const PRODUCT_CATEGORY_OPTIONS = [
  'electronics',
  'Furniture',
  'Decor',
  'Utilities & Hygiene',
];

export const PRODUCT_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

export const PRODUCT_COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

export const PRODUCT_COLOR_NAME_OPTIONS = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'violet', label: 'Violet' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
];

export const PRODUCT_SIZE_OPTIONS = [
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '8.5', label: '8.5' },
  { value: '9', label: '9' },
  { value: '9.5', label: '9.5' },
  { value: '10', label: '10' },
  { value: '10.5', label: '10.5' },
  { value: '11', label: '11' },
  { value: '11.5', label: '11.5' },
  { value: '12', label: '12' },
  { value: '13', label: '13' },
];

export const PRODUCT_STOCK_OPTIONS = [
  { value: 'in stock', label: 'In stock' },
  { value: 'low stock', label: 'Low stock' },
  { value: 'out of stock', label: 'Out of stock' },
];

export const PRODUCT_PUBLISH_OPTIONS = [
  {
    value: 'published',
    label: 'Published',
  },
  {
    value: 'draft',
    label: 'Draft',
  },
];

export const PRODUCT_SORT_OPTIONS = [
  // { value: 'featured', label: 'Featured' },
  // { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High - Low' },
  { value: 'priceAsc', label: 'Price: Low - High' },
];

export const PRODUCT_CATEGORY_GROUP_OPTIONS = [
  {
    group: 'Clothing',
    classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather', 'Accessories'],
  },
  {
    group: 'Tailored',
    classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats', 'Apparel'],
  },
  {
    group: 'Accessories',
    classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'],
  },
];

export const EVENT_PRODUCT_CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'sound', label: 'Sound-System' },
  { value: 'camera', label: 'Camera' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'others', label: 'Others' },
];

export const EVENT_PRODUCT_SUBCATEGORIES = [
  {
    category: 'electronics',
    subcategory: ['TV', 'Laptops', 'Headphones', 'Refrigerator', 'Others'],
  },
  { category: 'sound', subcategory: ['Sony', 'JBL', 'Sennheiser', 'Boat', 'Others'] },
  { category: 'camera', subcategory: ['DSLR', 'Video Camera'] },
  { category: 'gaming', subcategory: ['PlayStation', 'Xbox', 'Nintendo', 'Gaming PC', 'Others'] },
  {
    category: 'accessories',
    subcategory: ['Mobile Covers', 'Laptop Bags', 'Headphone Cases', 'Others'],
  },
  { category: 'others', subcategory: ['Others'] },
];

export const PRODUCT_SIZE_BY_SUBCATEGORY = [
  { subcategory: 'TV', size: ['45 inches', '55 inches', '65 inches'] },
  { subcategory: 'Laptops', size: ['15 inches', '17 inches', '14 inches'] },
  { subcategory: 'Headphones', size: ['On-ear', 'In-ear', 'Over-ear'] },
  { subcategory: 'Refrigerator', size: ['44L', '100L', '200L'] },
  { subcategory: 'Sony', size: ['3 inches', '4 inches', '5-1/4 inches', '6-1/2 inches'] },
  { subcategory: 'JBL', size: ['3 inches', '4 inches', '5-1/4 inches', '6-1/2 inches'] },
  { subcategory: 'Sennheiser', size: ['3 inches', '4 inches', '5-1/4 inches', '6-1/2 inches'] },
  { subcategory: 'Boat', size: ['3 inches', '4 inches', '5-1/4 inches', '6-1/2 inches'] },
  { subcategory: 'DSLR', size: ['24 MP', '32 MP', '48 MP', '64 MP'] },
  { subcategory: 'Video Camera', size: ['24 MP', '32 MP', '48 MP', '64 MP'] },
  { subcategory: 'PlayStation', size: ['PlayStation 4', 'PlayStation 5'] },
  { subcategory: 'Xbox', size: ['Xbox One', 'Xbox Series X'] },
  { subcategory: 'Nintendo', size: ['Nintendo Switch', 'Nintendo Switch Lite'] },
  { subcategory: 'Gaming PC', size: ['16 GB RAM', '32 GB RAM', '64 GB RAM'] },
  { subcategory: 'Mobile Covers', size: ['iPhone 12', 'Samsung Galaxy S21', 'OnePlus 9'] },
  { subcategory: 'Laptop Bags', size: ['15 inches', '17 inches', '14 inches'] },
  { subcategory: 'Headphone Cases', size: ['On-ear', 'In-ear', 'Over-ear'] },
  { subcategory: 'Others', size: ['Others'] },
];

export const PRODUCT_CHECKOUT_STEPS = ['Cart', 'Billing & address', 'Payment'];

export const PRODUCTS: IProductItem[] = [
  {
    id: '1',
    sku: 'FRG-001',
    name: 'Whirlpool 235 Litres 2 Star Frost Free Double Door Refrigerator',
    code: 'FRG44L',
    price: 29999.99,
    taxes: 20,
    tags: ['electronics', 'home appliance'],
    sizes: ['44L', '55L', '65L'],
    publish: 'published',
    gender: 'Male',
    coverUrl:
      'https://media.istockphoto.com/id/469549810/photo/refrigerator.jpg?s=2048x2048&w=is&k=20&c=Cc5i2URHmQqL1C6l51mIvLUc3JnnlgtMNtRLAYYfQS8=',
    images: [
      'https://media.istockphoto.com/id/469549810/photo/refrigerator.jpg?s=612x612&w=0&k=20&c=-4E9Vdx7bgwlrKVUr9gaZ6OjMTJ7t9SgS5A7k5BRBx8=',
      'https://media.istockphoto.com/id/469549810/photo/refrigerator.jpg?s=2048x2048&w=is&k=20&c=Cc5i2URHmQqL1C6l51mIvLUc3JnnlgtMNtRLAYYfQS8=',
    ],
    colors: ['white', 'black'],
    quantity: 50,
    category: 'electronics',
    subcategory: 'Refrigerator',
    available: 50,
    totalSold: 10,
    description:
      '<h6>Specifications</h6>\n' +
      '<ol>\n' +
      '  <li>Category: Electronics</li>\n' +
      '  <li>Type: Refrigerator</li>\n' +
      '  <li>Capacity: 235 Litres</li>\n' +
      '  <li>Energy Rating: 2 Star</li>\n' +
      '  <li>Frost Free: Yes</li>\n' +
      '</ol>\n' +
      '<h6>Product details</h6>\n' +
      '<ul>\n' +
      '  <li><p>Energy efficient and quiet operation</p></li>\n' +
      '  <li><p>Double door design</p></li>\n' +
      '  <li><p>Adjustable shelves</p></li>\n' +
      '  <li><p>Colour: White/Black</p></li>\n' +
      '</ul>\n' +
      '<h6>Benefits</h6>\n' +
      '<ul>\n' +
      '  <li><p>Spacious interior</p></li>\n' +
      '  <li><p>Low power consumption</p></li>\n' +
      '  <li><p>Easy to clean</p></li>\n' +
      '</ul>\n' +
      '<h6>Delivery and returns</h6>\n' +
      '<p>Your order of $200 or more gets free standard delivery.</p>\n' +
      '<ul>\n' +
      '  <li><p>Standard delivered 4-5 Business Days</p></li>\n' +
      '  <li><p>Express delivered 2-4 Business Days</p></li>\n' +
      '</ul>\n' +
      '<p>Orders are processed and delivered Monday-Friday (excluding public holidays)</p>',
    totalRatings: 4.5,
    totalReviews: 20,
    createdAt: new Date().toISOString(),
    inventoryType: 'in stock',
    subDescription: 'Energy efficient and quiet operation.',
    priceSale: 27999.99,
    reviews: [
      {
        id: 'r1',
        name: 'John Doe',
        rating: 5,
        comment: 'Excellent fridge, very spacious and energy efficient.',
        helpful: 10,
        avatarUrl: 'https://example.com/avatar1.jpg',
        postedAt: new Date().toISOString(),
        isPurchased: true,
        attachments: ['https://example.com/review1-attachment1.jpg'],
      },
      {
        id: 'r2',
        name: 'Jane Smith',
        rating: 4,
        comment: 'Good fridge but a bit noisy.',
        helpful: 5,
        avatarUrl: 'https://example.com/avatar2.jpg',
        postedAt: new Date().toISOString(),
        isPurchased: true,
      },
    ],
    ratings: [
      { name: 'John Doe', starCount: 5, reviewCount: 10 },
      { name: 'Jane Smith', starCount: 4, reviewCount: 5 },
    ],
    saleLabel: { enabled: true, content: '10% Off' },
    newLabel: { enabled: false, content: '' },
  },
  {
    id: '2',
    sku: 'TV-002',
    name: 'LG 81 cm (32 inch) HD Ready LED Smart TV ',
    code: 'TV45IN',
    price: 49999.99,
    taxes: 30,
    tags: ['electronics', 'entertainment'],
    sizes: ['45 inches', '55 inches', '65 inches'],
    publish: 'published',
    gender: 'Male',
    coverUrl:
      'https://media.istockphoto.com/id/839011518/vector/4k-screen-resolution-smart-tv-ultra-hd-monitor-isolated-on-white-illustration.jpg?s=612x612&w=0&k=20&c=zXQxkEUOCyeDeC5qz90wE00-WX3wLZfoER8UM5qG1l4=',
    images: [
      'https://media.istockphoto.com/id/869694282/photo/blank-white-tv-screen-on-a-wooden-stand-in-the-living-room-from-the-side.jpg?s=612x612&w=0&k=20&c=FWgcRngaI2VWhV1oa3zuN9qHazUNdeurEhgd2gMJcEQ=',
      'https://media.istockphoto.com/id/482372367/vector/tv-screen.jpg?s=612x612&w=0&k=20&c=vBwkLM1PrgNnAs3xFEGfyKc_XdtbTdcjYETi6_B9htU=',
    ],
    colors: ['black'],
    quantity: 30,
    category: 'electronics',
    subcategory: 'TV',
    available: 30,
    totalSold: 15,
    description:
      '<h6>Specifications</h6>\n' +
      '<ol>\n' +
      '  <li>Category: Electronics</li>\n' +
      '  <li>Type: LED Smart TV</li>\n' +
      '  <li>Screen Size: 45 inches</li>\n' +
      '  <li>Resolution: HD Ready</li>\n' +
      '  <li>Smart TV: Yes</li>\n' +
      '</ol>\n' +
      '<h6>Product details</h6>\n' +
      '<ul>\n' +
      '  <li><p>Stunning picture quality</p></li>\n' +
      '  <li><p>Multiple streaming options</p></li>\n' +
      '  <li><p>Built-in Wi-Fi</p></li>\n' +
      '  <li><p>Colour: Black</p></li>\n' +
      '</ul>\n' +
      '<h6>Benefits</h6>\n' +
      '<ul>\n' +
      '  <li><p>High resolution display</p></li>\n' +
      '  <li><p>Smart features</p></li>\n' +
      '  <li><p>Energy efficient</p></li>\n' +
      '</ul>\n' +
      '<h6>Delivery and returns</h6>\n' +
      '<p>Your order of $200 or more gets free standard delivery.</p>\n' +
      '<ul>\n' +
      '  <li><p>Standard delivered 4-5 Business Days</p></li>\n' +
      '  <li><p>Express delivered 2-4 Business Days</p></li>\n' +
      '</ul>\n' +
      '<p>Orders are processed and delivered Monday-Friday (excluding public holidays)</p>',
    totalRatings: 4.7,
    totalReviews: 25,
    createdAt: new Date().toISOString(),
    inventoryType: 'in stock',
    subDescription: 'Smart TV with multiple streaming options.',
    priceSale: 47999.99,
    reviews: [
      {
        id: 'r3',
        name: 'Alice Johnson',
        rating: 5,
        comment: 'Amazing TV with great picture quality.',
        helpful: 15,
        avatarUrl: 'https://example.com/avatar3.jpg',
        postedAt: new Date().toISOString(),
        isPurchased: true,
      },
      {
        id: 'r4',
        name: 'Bob Brown',
        rating: 4,
        comment: 'Good value for money.',
        helpful: 8,
        avatarUrl: 'https://example.com/avatar4.jpg',
        postedAt: new Date().toISOString(),
        isPurchased: true,
      },
    ],
    ratings: [
      { name: 'Alice Johnson', starCount: 5, reviewCount: 15 },
      { name: 'Bob Brown', starCount: 4, reviewCount: 10 },
    ],
    saleLabel: { enabled: true, content: '5% Off' },
    newLabel: { enabled: false, content: '' },
  },
  {
    id: '3',
    sku: 'LPT-003',
    name: 'HP 15s Laptop (AMD Ryzen 3 5300U / 8GB RAM/ 512 SSD/ 15.6 (39.6 cm) Display/ AMD Integrated Graphics/ Win 11/ Office)EQ2143AU',
    code: 'LPT123',
    price: 99999.99,
    taxes: 50,
    tags: ['electronics', 'computers'],
    sizes: ['15 inches', '17 inches', '14inches'],
    publish: 'published',
    gender: 'Female',
    coverUrl:
      'https://media.istockphoto.com/id/1394988455/photo/laptop-with-a-blank-screen-on-a-white-background.jpg?s=612x612&w=0&k=20&c=BXNMs3xZNXP__d22aVkeyfvgJ5T18r6HuUTEESYf_tE=',
    images: [
      'https://media.istockphoto.com/id/1389603578/photo/laptop-blank-screen-on-wood-table-with-blurred-coffee-shop-cafe-interior-background-and.jpg?s=612x612&w=0&k=20&c=bPf3XxUZJZ6HRw7BE75ur1wBMCm_r4QAr-_lajERIyU=',
      'https://media.istockphoto.com/id/1160505836/photo/a-woman-using-and-typing-on-laptop-with-blank-white-desktop-screen.jpg?s=612x612&w=0&k=20&c=dVzA8f88OwRnun_rTyK1zgKtllY_x1CLrZdGbttlHrg=',
    ],
    colors: ['silver', 'gray'],
    quantity: 20,
    category: 'electronics',
    subcategory: 'Laptops',
    available: 20,
    totalSold: 5,
    description:
      '<h6>Specifications</h6>\n' +
      '<ol>\n' +
      '  <li>Category: Electronics</li>\n' +
      '  <li>Type: Laptop</li>\n' +
      '  <li>Processor: AMD Ryzen 3 5300U</li>\n' +
      '  <li>RAM: 8GB</li>\n' +
      '  <li>Storage: 512GB SSD</li>\n' +
      '  <li>Display: 15.6 inches</li>\n' +
      '  <li>Graphics: AMD Integrated Graphics</li>\n' +
      '  <li>Operating System: Windows 11</li>\n' +
      '</ol>\n' +
      '<h6>Product details</h6>\n' +
      '<ul>\n' +
      '  <li><p>Lightweight and powerful</p></li>\n' +
      '  <li><p>Long battery life</p></li>\n' +
      '  <li><p>High-resolution display</p></li>\n' +
      '  <li><p>Colour: Silver/Gray</p></li>\n' +
      '</ul>\n' +
      '<h6>Benefits</h6>\n' +
      '<ul>\n' +
      '  <li><p>Fast performance</p></li>\n' +
      '  <li><p>Portable design</p></li>\n' +
      '  <li><p>Durable build</p></li>\n' +
      '</ul>\n' +
      '<h6>Delivery and returns</h6>\n' +
      '<p>Your order of $200 or more gets free standard delivery.</p>\n' +
      '<ul>\n' +
      '  <li><p>Standard delivered 4-5 Business Days</p></li>\n' +
      '  <li><p>Express delivered 2-4 Business Days</p></li>\n' +
      '</ul>\n' +
      '<p>Orders are processed and delivered Monday-Friday (excluding public holidays)</p>',
    totalRatings: 4.8,
    totalReviews: 30,
    createdAt: new Date().toISOString(),
    inventoryType: 'in stock',
    subDescription: 'Lightweight and powerful with long battery life.',
    priceSale: 94999.99,
    reviews: [
      {
        id: 'r5',
        name: 'Charlie Davis',
        rating: 5,
        comment: 'Fantastic laptop, very fast and lightweight.',
        helpful: 20,
        avatarUrl: 'https://example.com/avatar5.jpg',
        postedAt: new Date().toISOString(),
        isPurchased: true,
        attachments: ['https://example.com/review5-attachment1.jpg'],
      },
      {
        id: 'r6',
        name: 'Dana Lee',
        rating: 4,
        comment: 'Great laptop but battery life could be better.',
        helpful: 10,
        avatarUrl: 'https://example.com/avatar6.jpg',
        postedAt: new Date().toISOString(),
        isPurchased: true,
      },
    ],
    ratings: [
      { name: 'Charlie Davis', starCount: 5, reviewCount: 20 },
      { name: 'Dana Lee', starCount: 4, reviewCount: 10 },
    ],
    saleLabel: { enabled: true, content: '5% Off' },
    newLabel: { enabled: true, content: 'New Arrival' },
  },
  {
    id: '4',
    sku: 'LPT-003',
    name: 'HP 15s Laptop (AMD Ryzen 3 5300U / 8GB RAM/ 512 SSD/ 15.6 (39.6 cm) Display/ AMD Integrated Graphics/ Win 11/ Office)EQ2143AU',
    code: 'LPT123',
    price: 99999.99,
    taxes: 50,
    tags: ['electronics', 'computers'],
    sizes: ['15 inches', '17 inches', '14inches'],
    publish: 'published',
    gender: 'Female',
    coverUrl:
      'https://media.istockphoto.com/id/1394988455/photo/laptop-with-a-blank-screen-on-a-white-background.jpg?s=612x612&w=0&k=20&c=BXNMs3xZNXP__d22aVkeyfvgJ5T18r6HuUTEESYf_tE=',
    images: [
      'https://media.istockphoto.com/id/1389603578/photo/laptop-blank-screen-on-wood-table-with-blurred-coffee-shop-cafe-interior-background-and.jpg?s=612x612&w=0&k=20&c=bPf3XxUZJZ6HRw7BE75ur1wBMCm_r4QAr-_lajERIyU=',
      'https://media.istockphoto.com/id/1160505836/photo/a-woman-using-and-typing-on-laptop-with-blank-white-desktop-screen.jpg?s=612x612&w=0&k=20&c=dVzA8f88OwRnun_rTyK1zgKtllY_x1CLrZdGbttlHrg=',
    ],
    colors: ['silver', 'gray'],
    quantity: 20,
    category: 'electronics',
    subcategory: 'Laptops',
    available: 20,
    totalSold: 5,
    description:
      '<h6>Specifications</h6>\n' +
      '<ol>\n' +
      '  <li>Category: Electronics</li>\n' +
      '  <li>Type: Laptop</li>\n' +
      '  <li>Processor: AMD Ryzen 3 5300U</li>\n' +
      '  <li>RAM: 8GB</li>\n' +
      '  <li>Storage: 512GB SSD</li>\n' +
      '  <li>Display: 15.6 inches</li>\n' +
      '  <li>Graphics: AMD Integrated Graphics</li>\n' +
      '  <li>Operating System: Windows 11</li>\n' +
      '</ol>\n' +
      '<h6>Product details</h6>\n' +
      '<ul>\n' +
      '  <li><p>Lightweight and powerful</p></li>\n' +
      '  <li><p>Long battery life</p></li>\n' +
      '  <li><p>High-resolution display</p></li>\n' +
      '  <li><p>Colour: Silver/Gray</p></li>\n' +
      '</ul>\n' +
      '<h6>Benefits</h6>\n' +
      '<ul>\n' +
      '  <li><p>Fast performance</p></li>\n' +
      '  <li><p>Portable design</p></li>\n' +
      '  <li><p>Durable build</p></li>\n' +
      '</ul>\n' +
      '<h6>Delivery and returns</h6>\n' +
      '<p>Your order of $200 or more gets free standard delivery.</p>\n' +
      '<ul>\n' +
      '  <li><p>Standard delivered 4-5 Business Days</p></li>\n' +
      '  <li><p>Express delivered 2-4 Business Days</p></li>\n' +
      '</ul>\n' +
      '<p>Orders are processed and delivered Monday-Friday (excluding public holidays)</p>',
    totalRatings: 4.8,
    totalReviews: 30,
    createdAt: new Date().toISOString(),
    inventoryType: 'in stock',
    subDescription: 'Lightweight and powerful with long battery life.',
    priceSale: 94999.99,
    reviews: [
      {
        id: 'r5',
        name: 'Charlie Davis',
        rating: 5,
        comment: 'Fantastic laptop, very fast and lightweight.',
        helpful: 20,
        avatarUrl: 'https://example.com/avatar5.jpg',
        postedAt: new Date().toISOString(),
        isPurchased: true,
        attachments: ['https://example.com/review5-attachment1.jpg'],
      },
      {
        id: 'r6',
        name: 'Dana Lee',
        rating: 4,
        comment: 'Great laptop but battery life could be better.',
        helpful: 10,
        avatarUrl: 'https://example.com/avatar6.jpg',
        postedAt: new Date().toISOString(),
        isPurchased: true,
      },
    ],
    ratings: [
      { name: 'Charlie Davis', starCount: 5, reviewCount: 20 },
      { name: 'Dana Lee', starCount: 4, reviewCount: 10 },
    ],
    saleLabel: { enabled: true, content: '5% Off' },
    newLabel: { enabled: true, content: 'New Arrival' },
  },
];
