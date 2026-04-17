-- ── Schema for ShopCaper CockroachDB ──

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id STRING PRIMARY KEY,
    name STRING NOT NULL,
    "group" STRING NOT NULL,
    image STRING,
    count INT DEFAULT 0
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id STRING PRIMARY KEY,
    name STRING NOT NULL,
    description TEXT,
    category_id STRING REFERENCES categories(id),
    base_price DECIMAL(10,2) NOT NULL,
    discount_percent INT DEFAULT 0,
    images STRING[], -- CockroachDB/Postgres Array type
    is_active BOOLEAN DEFAULT true,
    fabric STRING,
    care_instructions TEXT,
    tags STRING[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Variant Table (Reflects the "Part / Compartment" structure)
CREATE TABLE IF NOT EXISTS product_variants (
    id STRING PRIMARY KEY,
    product_id STRING REFERENCES products(id) ON DELETE CASCADE,
    sku STRING UNIQUE,
    size STRING,
    color STRING,
    stock INT NOT NULL DEFAULT 0,
    price_override DECIMAL(10,2)
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name STRING NOT NULL,
    email STRING UNIQUE NOT NULL,
    password_hash STRING NOT NULL,
    phone STRING,
    role STRING DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status STRING DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id STRING REFERENCES products(id),
    variant_id STRING REFERENCES product_variants(id),
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10,2) NOT NULL
);

-- ── Initial Category Seed ──
INSERT INTO categories (id, name, "group", image) VALUES
('kurtis-short', 'Short Kurtis', 'Kurtis', '/images/kurti-product.png'),
('kurtis-long', 'Long Kurtis', 'Kurtis', '/images/kurti-product.png'),
('maternity-feeding-gown', 'Feeding Gowns', 'Maternity Wear', '/images/maternity-wear.png'),
('maternity-feeding-kurti', 'Feeding Kurtis', 'Maternity Wear', '/images/maternity-wear.png'),
('maternity-one-piece', 'Feeding One Piece', 'Maternity Wear', '/images/maternity-wear.png'),
('bottom-leggings', 'Leggings', 'Bottom Wear', '/images/bottom-wear.png'),
('bottom-cigar-pants', 'Cigar Pants', 'Bottom Wear', '/images/bottom-wear.png'),
('bottom-12-kalis', '12 Kalis', 'Bottom Wear', '/images/bottom-wear.png'),
('bottom-16-kalis', '16 Kalis', 'Bottom Wear', '/images/bottom-wear.png'),
('bottom-plazos', 'Plazos', 'Bottom Wear', '/images/bottom-wear.png'),
('western-one-piece', 'One Piece Dresses', 'Western Wear', '/images/western-dress.png'),
('dupattas', 'All Color Dupattas', 'Dupattas', '/images/dupatta-product.png'),
('ethnic-wear', 'Ethnic Wear', 'Ethnic Wear', '/images/ethnic-wear.png')
ON CONFLICT (id) DO NOTHING;
