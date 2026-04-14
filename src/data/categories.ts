export type CategoryId =
  | 'kurtis-short'
  | 'kurtis-long'
  | 'maternity-feeding-gown'
  | 'maternity-feeding-kurti'
  | 'maternity-one-piece'
  | 'bottom-leggings'
  | 'bottom-cigar-pants'
  | 'bottom-12-kalis'
  | 'bottom-16-kalis'
  | 'bottom-plazos'
  | 'western-one-piece'
  | 'dupattas'
  | 'ethnic-wear'

export interface Category {
  id: CategoryId
  name: string
  group: string
  image: string
  count: number
}

export const categoryGroups = [
  { name: 'Kurtis', slug: 'kurtis' },
  { name: 'Maternity Wear', slug: 'maternity' },
  { name: 'Bottom Wear', slug: 'bottom' },
  { name: 'Western Wear', slug: 'western' },
  { name: 'Dupattas', slug: 'dupattas' },
  { name: 'Ethnic Wear', slug: 'ethnic' },
] as const

export const categories: Category[] = [
  { id: 'kurtis-short', name: 'Short Kurtis', group: 'Kurtis', image: '/images/kurti-product.png', count: 24 },
  { id: 'kurtis-long', name: 'Long Kurtis', group: 'Kurtis', image: '/images/kurti-product.png', count: 18 },
  { id: 'maternity-feeding-gown', name: 'Feeding Gowns', group: 'Maternity Wear', image: '/images/maternity-wear.png', count: 12 },
  { id: 'maternity-feeding-kurti', name: 'Feeding Kurtis', group: 'Maternity Wear', image: '/images/maternity-wear.png', count: 8 },
  { id: 'maternity-one-piece', name: 'Feeding One Piece', group: 'Maternity Wear', image: '/images/maternity-wear.png', count: 6 },
  { id: 'bottom-leggings', name: 'Leggings', group: 'Bottom Wear', image: '/images/bottom-wear.png', count: 30 },
  { id: 'bottom-cigar-pants', name: 'Cigar Pants', group: 'Bottom Wear', image: '/images/bottom-wear.png', count: 15 },
  { id: 'bottom-12-kalis', name: '12 Kalis', group: 'Bottom Wear', image: '/images/bottom-wear.png', count: 10 },
  { id: 'bottom-16-kalis', name: '16 Kalis', group: 'Bottom Wear', image: '/images/bottom-wear.png', count: 10 },
  { id: 'bottom-plazos', name: 'Plazos', group: 'Bottom Wear', image: '/images/bottom-wear.png', count: 20 },
  { id: 'western-one-piece', name: 'One Piece Dresses', group: 'Western Wear', image: '/images/western-dress.png', count: 16 },
  { id: 'dupattas', name: 'All Color Dupattas', group: 'Dupattas', image: '/images/dupatta-product.png', count: 25 },
  { id: 'ethnic-wear', name: 'Ethnic Wear', group: 'Ethnic Wear', image: '/images/ethnic-wear.png', count: 14 },
]

export function getCategoriesByGroup(group: string): Category[] {
  return categories.filter(c => c.group === group)
}

export function getCategoryById(id: CategoryId): Category | undefined {
  return categories.find(c => c.id === id)
}
