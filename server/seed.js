import { query } from './db.js';

const products = [
  {
    id: 'p1',
    name: 'Ananya Floral Short Kurti',
    description: 'A beautiful floral printed short kurti in soft cotton fabric. Features delicate embroidery work on the neckline and sleeves. Perfect for casual outings and daily wear.',
    category: 'kurtis-short',
    basePrice: 799,
    discountPercent: 20,
    images: ['/images/kurti-product.png'],
    isActive: true,
    fabric: 'Pure Cotton',
    careInstructions: 'Machine wash cold, tumble dry low',
    tags: ['bestseller', 'new'],
    variants: [
      { id: 'v1', sku: 'AFK-S-PNK', size: 'S', color: 'Rose Pink', stock: 12 },
      { id: 'v2', sku: 'AFK-M-PNK', size: 'M', color: 'Rose Pink', stock: 18 },
      { id: 'v3', sku: 'AFK-L-PNK', size: 'L', color: 'Rose Pink', stock: 15 },
      { id: 'v4', sku: 'AFK-XL-PNK', size: 'XL', color: 'Rose Pink', stock: 8 },
      { id: 'v5', sku: 'AFK-M-BLU', size: 'M', color: 'Sky Blue', stock: 10 },
      { id: 'v6', sku: 'AFK-L-BLU', size: 'L', color: 'Sky Blue', stock: 6 },
    ],
  },
  {
    id: 'p2',
    name: 'Priya Embroidered Long Kurti',
    description: 'Elegant floor-length kurti with intricate Chikankari embroidery. Crafted from premium georgette fabric with a relaxed A-line silhouette.',
    category: 'kurtis-long',
    basePrice: 1299,
    discountPercent: 15,
    images: ['/images/kurti-product.png'],
    isActive: true,
    fabric: 'Georgette',
    careInstructions: 'Hand wash only, dry in shade',
    tags: ['trending'],
    variants: [
      { id: 'v7', sku: 'PLK-S-WHT', size: 'S', color: 'Ivory White', stock: 5 },
      { id: 'v8', sku: 'PLK-M-WHT', size: 'M', color: 'Ivory White', stock: 12 },
      { id: 'v9', sku: 'PLK-L-WHT', size: 'L', color: 'Ivory White', stock: 10 },
      { id: 'v10', sku: 'PLK-XL-WHT', size: 'XL', color: 'Ivory White', stock: 7 },
    ],
  },
  {
    id: 'p4',
    name: 'Bloom Comfort Feeding Gown',
    description: 'Ultra-soft feeding gown designed for new mothers. Features discreet zip-access for easy nursing, adjustable waist, and breathable fabric.',
    category: 'maternity-feeding-gown',
    basePrice: 1199,
    discountPercent: 10,
    images: ['/images/maternity-wear.png'],
    isActive: true,
    fabric: 'Soft Cotton Jersey',
    careInstructions: 'Machine wash gentle cycle',
    tags: ['bestseller'],
    variants: [
      { id: 'v15', sku: 'BCF-M-LAV', size: 'M', color: 'Lavender', stock: 14 },
      { id: 'v16', sku: 'BCF-L-LAV', size: 'L', color: 'Lavender', stock: 20 },
      { id: 'v17', sku: 'BCF-XL-LAV', size: 'XL', color: 'Lavender', stock: 10 },
      { id: 'v18', sku: 'BCF-L-PNK', size: 'L', color: 'Blush Pink', stock: 8 },
    ],
  },
  {
    id: 'p7',
    name: 'Classic Stretch Leggings',
    description: 'Premium quality stretchable leggings in a wide range of colors. Four-way stretch, high waist, and ankle length.',
    category: 'bottom-leggings',
    basePrice: 399,
    discountPercent: 5,
    images: ['/images/bottom-wear.png'],
    isActive: true,
    fabric: 'Cotton Lycra',
    careInstructions: 'Machine wash cold',
    tags: ['bestseller'],
    variants: [
      { id: 'v25', sku: 'CSL-M-BLK', size: 'M', color: 'Jet Black', stock: 50 },
      { id: 'v26', sku: 'CSL-L-BLK', size: 'L', color: 'Jet Black', stock: 40 },
      { id: 'v28', sku: 'CSL-M-MRN', size: 'M', color: 'Maroon', stock: 25 },
    ],
  },
  {
      id: 'p12',
      name: 'Bella Floral One Piece Dress',
      description: 'Stunning one-piece dress with all-over floral print. Flattering A-line silhouette with cinched waist.',
      category: 'western-one-piece',
      basePrice: 1499,
      discountPercent: 25,
      images: ['/images/western-dress.png'],
      isActive: true,
      fabric: 'Georgette',
      careInstructions: 'Hand wash cold, iron low',
      tags: ['bestseller', 'trending'],
      variants: [
        { id: 'v45', sku: 'BFD-S-PNK', size: 'S', color: 'Blush Pink', stock: 10 },
        { id: 'v46', sku: 'BFD-M-PNK', size: 'M', color: 'Blush Pink', stock: 14 },
      ],
  },
  {
      id: 'p14',
      name: 'Silk Embroidered Dupatta',
      description: 'Luxurious pure silk dupatta with intricate embroidery and zari border. A statement piece for special occasions.',
      category: 'dupattas',
      basePrice: 499,
      discountPercent: 10,
      images: ['/images/dupatta-product.png'],
      isActive: true,
      fabric: 'Pure Silk',
      careInstructions: 'Dry clean only',
      tags: ['trending'],
      variants: [
        { id: 'v52', sku: 'SED-RED', size: 'Free Size', color: 'Deep Red', stock: 15 },
        { id: 'v53', sku: 'SED-GRN', size: 'Free Size', color: 'Emerald Green', stock: 12 },
      ],
  },
  {
      id: 'p16',
      name: 'Royal Bridal Lehenga Set',
      description: 'Exquisite bridal lehenga set with heavy zardozi embroidery. Includes lehenga, blouse, and dupatta. A masterpiece for your special day.',
      category: 'ethnic-wear',
      basePrice: 2999,
      discountPercent: 30,
      images: ['/images/ethnic-wear.png'],
      isActive: true,
      fabric: 'Velvet & Net',
      careInstructions: 'Professional dry clean only',
      tags: ['bestseller', 'trending'],
      variants: [
        { id: 'v59', sku: 'RBL-S-MRN', size: 'S', color: 'Maroon', stock: 3 },
        { id: 'v60', sku: 'RBL-M-MRN', size: 'M', color: 'Maroon', stock: 5 },
      ],
  }
];

async function seed() {
  console.log('Starting data migration to CockroachDB...');
  
  try {
    for (const product of products) {
      console.log(`Migrating: ${product.name}`);
      
      // Insert Product
      await query(
        `INSERT INTO products (id, name, description, category_id, base_price, discount_percent, images, is_active, fabric, care_instructions, tags) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET 
         name = EXCLUDED.name, description = EXCLUDED.description, base_price = EXCLUDED.base_price`,
        [
          product.id, product.name, product.description, product.category, 
          product.basePrice, product.discountPercent, product.images, 
          product.isActive, product.fabric, product.careInstructions, product.tags
        ]
      );

      // Insert Variants
      for (const v of product.variants) {
        await query(
          `INSERT INTO product_variants (id, product_id, sku, size, color, stock, price_override)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET stock = EXCLUDED.stock`,
          [v.id, product.id, v.sku, v.size, v.color, v.stock, v.priceOverride || null]
        );
      }
    }
    
    console.log('✅ Migration complete! All categories and products are now in CockroachDB.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    process.exit();
  }
}

seed();
