export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderItem {
  productId: string
  productName: string
  variantId: string
  size: string
  color: string
  quantity: number
  price: number
  image: string
}

export interface OrderAddress {
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

export interface Order {
  id: string
  userId: string
  customerEmail: string
  customerName: string
  items: OrderItem[]
  address: OrderAddress
  totalAmount: number
  discountApplied: number
  paymentStatus: PaymentStatus
  fulfillmentStatus: OrderStatus
  trackingInfo?: string
  createdAt: string
}

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: 'u1',
    customerEmail: 'priya@example.com',
    customerName: 'Priya Sharma',
    items: [
      { productId: 'p1', productName: 'Ananya Floral Short Kurti', variantId: 'v2', size: 'M', color: 'Rose Pink', quantity: 2, price: 639, image: '/images/kurti-product.png' },
      { productId: 'p7', productName: 'Classic Stretch Leggings', variantId: 'v25', size: 'M', color: 'Jet Black', quantity: 1, price: 379, image: '/images/bottom-wear.png' },
    ],
    address: { fullName: 'Priya Sharma', phone: '9876543210', line1: '42, Rose Garden Society', line2: 'Near City Mall', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015' },
    totalAmount: 1657,
    discountApplied: 181,
    paymentStatus: 'paid',
    fulfillmentStatus: 'shipped',
    trackingInfo: 'SHIP-2025-0042',
    createdAt: '2025-03-28T10:30:00Z',
  },
  {
    id: 'ORD-002',
    userId: 'u2',
    customerEmail: 'meera@example.com',
    customerName: 'Meera Patel',
    items: [
      { productId: 'p16', productName: 'Royal Bridal Lehenga Set', variantId: 'v60', size: 'M', color: 'Maroon', quantity: 1, price: 2099, image: '/images/ethnic-wear.png' },
    ],
    address: { fullName: 'Meera Patel', phone: '9988776655', line1: '15, Shanti Nagar', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    totalAmount: 2099,
    discountApplied: 900,
    paymentStatus: 'paid',
    fulfillmentStatus: 'processing',
    createdAt: '2025-04-01T14:15:00Z',
  },
  {
    id: 'ORD-003',
    userId: 'u3',
    customerEmail: 'anita@example.com',
    customerName: 'Anita Gupta',
    items: [
      { productId: 'p4', productName: 'Bloom Comfort Feeding Gown', variantId: 'v15', size: 'M', color: 'Lavender', quantity: 1, price: 1079, image: '/images/maternity-wear.png' },
      { productId: 'p14', productName: 'Silk Embroidered Dupatta', variantId: 'v52', size: 'Free Size', color: 'Deep Red', quantity: 1, price: 449, image: '/images/dupatta-product.png' },
    ],
    address: { fullName: 'Anita Gupta', phone: '9123456789', line1: '8, Green Park Colony', city: 'Delhi', state: 'Delhi', pincode: '110016' },
    totalAmount: 1528,
    discountApplied: 170,
    paymentStatus: 'paid',
    fulfillmentStatus: 'delivered',
    createdAt: '2025-03-15T09:45:00Z',
  },
  {
    id: 'ORD-004',
    userId: 'u4',
    customerEmail: 'sneha@example.com',
    customerName: 'Sneha Reddy',
    items: [
      { productId: 'p12', productName: 'Bella Floral One Piece Dress', variantId: 'v46', size: 'M', color: 'Blush Pink', quantity: 1, price: 1124, image: '/images/western-dress.png' },
    ],
    address: { fullName: 'Sneha Reddy', phone: '9876512340', line1: '23, Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033' },
    totalAmount: 1124,
    discountApplied: 375,
    paymentStatus: 'pending',
    fulfillmentStatus: 'processing',
    createdAt: '2025-04-10T16:20:00Z',
  },
]
