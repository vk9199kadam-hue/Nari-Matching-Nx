import type { CategoryId } from './categories'

export interface ProductVariant {
  id: string
  sku: string
  size: string
  color: string
  stock: number
  priceOverride?: number
}

export interface Product {
  id: string
  name: string
  description: string
  category: CategoryId
  basePrice: number
  discountPercent: number
  images: string[]
  isActive: boolean
  variants: ProductVariant[]
  fabric?: string
  careInstructions?: string
  tags: string[]
  createdAt: string
}

export const products: Product[] = [
  // ── Kurtis ──
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
    createdAt: '2024-12-01',
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
    createdAt: '2024-11-15',
  },
  {
    id: 'p3',
    name: 'Meera Cotton Printed Kurti',
    description: 'Comfortable cotton kurti with modern block print design. Features three-quarter sleeves and a mandarin collar.',
    category: 'kurtis-short',
    basePrice: 649,
    discountPercent: 10,
    images: ['/images/kurti-product.png'],
    isActive: true,
    fabric: 'Cotton Blend',
    careInstructions: 'Machine wash cold',
    tags: ['new'],
    variants: [
      { id: 'v11', sku: 'MCK-S-YLW', size: 'S', color: 'Mustard Yellow', stock: 20 },
      { id: 'v12', sku: 'MCK-M-YLW', size: 'M', color: 'Mustard Yellow', stock: 25 },
      { id: 'v13', sku: 'MCK-L-YLW', size: 'L', color: 'Mustard Yellow', stock: 15 },
      { id: 'v14', sku: 'MCK-M-GRN', size: 'M', color: 'Sage Green', stock: 18 },
    ],
    createdAt: '2025-01-10',
  },

  // ── Maternity Wear ──
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
    createdAt: '2025-01-05',
  },
  {
    id: 'p5',
    name: 'Easy Access Feeding Kurti',
    description: 'Stylish yet functional feeding kurti with hidden nursing access. Perfect for outings with your little one.',
    category: 'maternity-feeding-kurti',
    basePrice: 899,
    discountPercent: 15,
    images: ['/images/maternity-wear.png'],
    isActive: true,
    fabric: 'Rayon',
    careInstructions: 'Hand wash recommended',
    tags: [],
    variants: [
      { id: 'v19', sku: 'EAF-M-TEA', size: 'M', color: 'Teal', stock: 10 },
      { id: 'v20', sku: 'EAF-L-TEA', size: 'L', color: 'Teal', stock: 12 },
      { id: 'v21', sku: 'EAF-XL-TEA', size: 'XL', color: 'Teal', stock: 6 },
    ],
    createdAt: '2025-02-01',
  },
  {
    id: 'p6',
    name: 'Grace Maternity One Piece',
    description: 'Elegant one piece maternity dress with easy feeding access. Flattering empire waist and flowing skirt.',
    category: 'maternity-one-piece',
    basePrice: 1399,
    discountPercent: 20,
    images: ['/images/maternity-wear.png'],
    isActive: true,
    fabric: 'Crepe',
    careInstructions: 'Dry clean recommended',
    tags: ['trending'],
    variants: [
      { id: 'v22', sku: 'GMO-M-NVY', size: 'M', color: 'Navy Blue', stock: 8 },
      { id: 'v23', sku: 'GMO-L-NVY', size: 'L', color: 'Navy Blue', stock: 10 },
      { id: 'v24', sku: 'GMO-XL-NVY', size: 'XL', color: 'Navy Blue', stock: 5 },
    ],
    createdAt: '2025-01-20',
  },

  // ── Bottom Wear ──
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
      { id: 'v27', sku: 'CSL-XL-BLK', size: 'XL', color: 'Jet Black', stock: 30 },
      { id: 'v28', sku: 'CSL-M-MRN', size: 'M', color: 'Maroon', stock: 25 },
      { id: 'v29', sku: 'CSL-L-MRN', size: 'L', color: 'Maroon', stock: 20 },
      { id: 'v30', sku: 'CSL-M-NVY', size: 'M', color: 'Navy Blue', stock: 18 },
    ],
    createdAt: '2024-10-01',
  },
  {
    id: 'p8',
    name: 'Premium Cigar Pants',
    description: 'Tailored cigar pants with a sleek, tapered silhouette. Comfortable waistband with side pockets.',
    category: 'bottom-cigar-pants',
    basePrice: 699,
    discountPercent: 10,
    images: ['/images/bottom-wear.png'],
    isActive: true,
    fabric: 'Cotton Twill',
    careInstructions: 'Machine wash, iron medium',
    tags: ['trending'],
    variants: [
      { id: 'v31', sku: 'PCP-M-BEI', size: 'M', color: 'Beige', stock: 12 },
      { id: 'v32', sku: 'PCP-L-BEI', size: 'L', color: 'Beige', stock: 15 },
      { id: 'v33', sku: 'PCP-XL-BEI', size: 'XL', color: 'Beige', stock: 8 },
      { id: 'v34', sku: 'PCP-M-OLV', size: 'M', color: 'Olive Green', stock: 10 },
    ],
    createdAt: '2025-01-12',
  },
  {
    id: 'p9',
    name: 'Elegant 12 Kali Skirt',
    description: 'Beautifully constructed 12 kali flared skirt. Full volume with graceful movement. Ideal for festive occasions.',
    category: 'bottom-12-kalis',
    basePrice: 899,
    discountPercent: 15,
    images: ['/images/bottom-wear.png'],
    isActive: true,
    fabric: 'Chanderi Silk',
    careInstructions: 'Dry clean only',
    tags: [],
    variants: [
      { id: 'v35', sku: 'E12-M-RED', size: 'M', color: 'Ruby Red', stock: 8 },
      { id: 'v36', sku: 'E12-L-RED', size: 'L', color: 'Ruby Red', stock: 10 },
      { id: 'v37', sku: 'E12-M-GLD', size: 'M', color: 'Gold', stock: 6 },
    ],
    createdAt: '2025-02-10',
  },
  {
    id: 'p10',
    name: 'Royal 16 Kali Lehenga Skirt',
    description: 'Luxurious 16 kali skirt with maximum flare and volume. Rich embroidered border with mirror work.',
    category: 'bottom-16-kalis',
    basePrice: 999,
    discountPercent: 10,
    images: ['/images/bottom-wear.png'],
    isActive: true,
    fabric: 'Art Silk',
    careInstructions: 'Dry clean only',
    tags: ['new'],
    variants: [
      { id: 'v38', sku: 'R16-M-MRN', size: 'M', color: 'Maroon', stock: 5 },
      { id: 'v39', sku: 'R16-L-MRN', size: 'L', color: 'Maroon', stock: 7 },
      { id: 'v40', sku: 'R16-M-GRN', size: 'M', color: 'Emerald Green', stock: 4 },
    ],
    createdAt: '2025-03-01',
  },
  {
    id: 'p11',
    name: 'Flowy Palazzo Pants',
    description: 'Wide-leg palazzo pants in premium crepe fabric. Elastic waistband for all-day comfort.',
    category: 'bottom-plazos',
    basePrice: 599,
    discountPercent: 20,
    images: ['/images/bottom-wear.png'],
    isActive: true,
    fabric: 'Crepe',
    careInstructions: 'Machine wash cold, hang dry',
    tags: ['bestseller'],
    variants: [
      { id: 'v41', sku: 'FPP-M-WHT', size: 'M', color: 'Off White', stock: 22 },
      { id: 'v42', sku: 'FPP-L-WHT', size: 'L', color: 'Off White', stock: 18 },
      { id: 'v43', sku: 'FPP-M-BLK', size: 'M', color: 'Jet Black', stock: 20 },
      { id: 'v44', sku: 'FPP-L-BLK', size: 'L', color: 'Jet Black', stock: 15 },
    ],
    createdAt: '2025-02-20',
  },

  // ── Western Wear ──
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
      { id: 'v47', sku: 'BFD-L-PNK', size: 'L', color: 'Blush Pink', stock: 12 },
      { id: 'v48', sku: 'BFD-M-BLU', size: 'M', color: 'Powder Blue', stock: 8 },
    ],
    createdAt: '2025-03-10',
  },
  {
    id: 'p13',
    name: 'Summer Breeze Maxi Dress',
    description: 'Lightweight maxi dress perfect for summer. Features a V-neckline, flutter sleeves, and flowing skirt.',
    category: 'western-one-piece',
    basePrice: 1199,
    discountPercent: 15,
    images: ['/images/western-dress.png'],
    isActive: true,
    fabric: 'Cotton Voile',
    careInstructions: 'Machine wash gentle, line dry',
    tags: ['new'],
    variants: [
      { id: 'v49', sku: 'SBM-S-YLW', size: 'S', color: 'Sunshine Yellow', stock: 6 },
      { id: 'v50', sku: 'SBM-M-YLW', size: 'M', color: 'Sunshine Yellow', stock: 10 },
      { id: 'v51', sku: 'SBM-L-YLW', size: 'L', color: 'Sunshine Yellow', stock: 8 },
    ],
    createdAt: '2025-03-15',
  },

  // ── Dupattas ──
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
      { id: 'v54', sku: 'SED-BLU', size: 'Free Size', color: 'Royal Blue', stock: 10 },
      { id: 'v55', sku: 'SED-GLD', size: 'Free Size', color: 'Gold', stock: 8 },
    ],
    createdAt: '2024-12-20',
  },
  {
    id: 'p15',
    name: 'Chiffon Printed Dupatta',
    description: 'Light and airy chiffon dupatta with vibrant prints. Perfect everyday accessory to elevate any outfit.',
    category: 'dupattas',
    basePrice: 349,
    discountPercent: 5,
    images: ['/images/dupatta-product.png'],
    isActive: true,
    fabric: 'Chiffon',
    careInstructions: 'Hand wash cold',
    tags: [],
    variants: [
      { id: 'v56', sku: 'CPD-PNK', size: 'Free Size', color: 'Rose Pink', stock: 20 },
      { id: 'v57', sku: 'CPD-PRP', size: 'Free Size', color: 'Purple', stock: 18 },
      { id: 'v58', sku: 'CPD-ORG', size: 'Free Size', color: 'Orange', stock: 14 },
    ],
    createdAt: '2025-01-25',
  },

  // ── Ethnic Wear ──
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
      { id: 'v61', sku: 'RBL-L-MRN', size: 'L', color: 'Maroon', stock: 4 },
      { id: 'v62', sku: 'RBL-M-RED', size: 'M', color: 'Red', stock: 3 },
    ],
    createdAt: '2025-02-14',
  },
  {
    id: 'p17',
    name: 'Traditional Banarasi Saree',
    description: 'Authentic Banarasi silk saree with golden zari weave. Rich traditional motifs with a modern touch.',
    category: 'ethnic-wear',
    basePrice: 1999,
    discountPercent: 20,
    images: ['/images/ethnic-wear.png'],
    isActive: true,
    fabric: 'Banarasi Silk',
    careInstructions: 'Dry clean only',
    tags: ['new'],
    variants: [
      { id: 'v63', sku: 'TBS-PNK', size: 'Free Size', color: 'Pink', stock: 6 },
      { id: 'v64', sku: 'TBS-BLU', size: 'Free Size', color: 'Royal Blue', stock: 5 },
      { id: 'v65', sku: 'TBS-GRN', size: 'Free Size', color: 'Green', stock: 4 },
    ],
    createdAt: '2025-03-05',
  },
  {
    id: 'p18',
    name: 'Zara Designer Long Kurti',
    description: 'Premium designer long kurti with modern cuts and contemporary print. Features stylish side slits and button detailing.',
    category: 'kurtis-long',
    basePrice: 1599,
    discountPercent: 25,
    images: ['/images/kurti-product.png'],
    isActive: true,
    fabric: 'Rayon',
    careInstructions: 'Machine wash cold, hang dry',
    tags: ['trending', 'new'],
    variants: [
      { id: 'v66', sku: 'ZDK-S-BLK', size: 'S', color: 'Black', stock: 8 },
      { id: 'v67', sku: 'ZDK-M-BLK', size: 'M', color: 'Black', stock: 12 },
      { id: 'v68', sku: 'ZDK-L-BLK', size: 'L', color: 'Black', stock: 10 },
      { id: 'v69', sku: 'ZDK-XL-BLK', size: 'XL', color: 'Black', stock: 6 },
    ],
    createdAt: '2025-03-20',
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(category: CategoryId): Product[] {
  return products.filter(p => p.category === category && p.isActive)
}

export function getProductsByCategoryGroup(group: string): Product[] {
  const groupPrefix = group.toLowerCase().replace(/\s+/g, '-')
  return products.filter(p => p.isActive && (
    p.category.startsWith(groupPrefix) ||
    (group === 'Kurtis' && p.category.startsWith('kurtis')) ||
    (group === 'Maternity Wear' && p.category.startsWith('maternity')) ||
    (group === 'Bottom Wear' && p.category.startsWith('bottom')) ||
    (group === 'Western Wear' && p.category.startsWith('western')) ||
    (group === 'Dupattas' && p.category === 'dupattas') ||
    (group === 'Ethnic Wear' && p.category === 'ethnic-wear')
  ))
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return products.filter(p =>
    p.isActive && (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    )
  )
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.isActive && p.tags.includes('bestseller'))
}

export function getNewArrivals(): Product[] {
  return products
    .filter(p => p.isActive)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
}

export function getTrendingProducts(): Product[] {
  return products.filter(p => p.isActive && p.tags.includes('trending'))
}
