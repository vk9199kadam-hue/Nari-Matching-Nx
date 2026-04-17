import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_please_change';

app.use(cors());
app.use(express.json());

// ── Authentication Endpoints ──

// Register new user
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const userExists = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) return res.status(400).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password_hash, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, phone',
      [name, email, passwordHash, phone]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    delete user.password_hash; // Don't send hash back
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Verify JWT middleware for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ── Orders Endpoints ──

// Create an order
app.post('/api/orders', authenticateToken, async (req, res) => {
  const { totalAmount, items, shippingAddress } = req.body;
  try {
    await query('BEGIN');
    
    const orderResult = await query(
      'INSERT INTO orders (user_id, total_amount, shipping_address) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, totalAmount, shippingAddress]
    );
    const order = orderResult.rows[0];

    for (const item of items) {
      await query(
        'INSERT INTO order_items (order_id, product_id, variant_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4, $5)',
        [order.id, item.product_id, item.variant_id, item.quantity, item.price]
      );
    }
    
    await query('COMMIT');
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
    await query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Database error during order creation' });
  }
});

// Get User's Orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching orders' });
  }
});

// ── Product Endpoints ──

// Get all products with variants
app.get('/api/products', async (req, res) => {
  try {
    const productsRes = await query('SELECT * FROM products WHERE is_active = true');
    const variantsRes = await query('SELECT * FROM product_variants');
    
    // Group variants by product_id
    const variantsMap = variantsRes.rows.reduce((acc, v) => {
      if (!acc[v.product_id]) acc[v.product_id] = [];
      acc[v.product_id].push({
        id: v.id,
        sku: v.sku,
        size: v.size,
        color: v.color,
        stock: v.stock,
        priceOverride: v.price_override
      });
      return acc;
    }, {});

    const products = productsRes.rows.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category_id,
      basePrice: parseFloat(p.base_price),
      discountPercent: p.discount_percent,
      images: p.images,
      fabric: p.fabric,
      careInstructions: p.care_instructions,
      tags: p.tags,
      createdAt: p.created_at,
      isActive: p.is_active,
      variants: variantsMap[p.id] || []
    }));

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update variant stock (Admin logic)
app.patch('/api/variants/:id/stock', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  
  const { id } = req.params;
  const { stock } = req.body;
  try {
    const result = await query('UPDATE product_variants SET stock = $1 WHERE id = $2 RETURNING *', [stock, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Variant not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add new product with variants (Admin)
app.post('/api/products', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  const p = req.body;
  try {
    await query('BEGIN');
    await query(
      `INSERT INTO products (id, name, description, category_id, base_price, discount_percent, images, fabric, care_instructions, tags, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [p.id, p.name, p.description, p.category, p.basePrice, p.discountPercent, p.images, p.fabric, p.careInstructions, p.tags, p.isActive]
    );

    for (const v of p.variants) {
      await query(
        `INSERT INTO product_variants (id, product_id, sku, size, color, stock, price_override)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [v.id, p.id, v.sku, v.size, v.color, v.stock, v.priceOverride || null]
      );
    }
    await query('COMMIT');
    res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
    await query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update product and variants (Admin)
app.put('/api/products/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  const { id } = req.params;
  const p = req.body;
  try {
    await query('BEGIN');
    await query(
      `UPDATE products SET name=$1, description=$2, category_id=$3, base_price=$4, discount_percent=$5, images=$6, fabric=$7, care_instructions=$8, tags=$9, is_active=$10
       WHERE id=$11`,
      [p.name, p.description, p.category, p.basePrice, p.discountPercent, p.images, p.fabric, p.careInstructions, p.tags, p.isActive, id]
    );

    await query('DELETE FROM product_variants WHERE product_id = $1', [id]);
    for (const v of p.variants) {
      await query(
        `INSERT INTO product_variants (id, product_id, sku, size, color, stock, price_override)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [v.id, id, v.sku, v.size, v.color, v.stock, v.priceOverride || null]
      );
    }
    await query('COMMIT');
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    await query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all users (Admin)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  try {
    // We fetch users and dynamically get their latest location from the orders table
    const result = await query(`
      SELECT u.id, u.name, u.email, u.phone, u.created_at,
             (SELECT shipping_address FROM orders o WHERE o.user_id = u.id ORDER BY created_at DESC LIMIT 1) as location
      FROM users u
      WHERE u.role = 'customer'
      ORDER BY u.created_at DESC
    `);
    
    // Parse the shipping address JSON if it exists to make it easier for frontend
    const users = result.rows.map(user => {
      let locationObj = null;
      if (user.location) {
        try { locationObj = JSON.parse(user.location); } catch(e) {}
      }
      return {
        ...user,
        location: locationObj ? `${locationObj.city}, ${locationObj.state}` : 'No orders yet'
      }
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching users' });
  }
});

// Delete product (Admin)
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

  const { id } = req.params;
  try {
    await query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port} with Authentication enabled`);
});

