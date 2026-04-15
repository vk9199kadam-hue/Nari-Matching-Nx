import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

// Update variant stock
app.patch('/api/variants/:id/stock', async (req, res) => {
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

// Add new product with variants
app.post('/api/products', async (req, res) => {
  const p = req.body;
  try {
    // Insert Product
    await query(
      `INSERT INTO products (id, name, description, category_id, base_price, discount_percent, images, fabric, care_instructions, tags, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [p.id, p.name, p.description, p.category, p.basePrice, p.discountPercent, p.images, p.fabric, p.careInstructions, p.tags, p.isActive]
    );

    // Insert Variants
    for (const v of p.variants) {
      await query(
        `INSERT INTO product_variants (id, product_id, sku, size, color, stock, price_override)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [v.id, p.id, v.sku, v.size, v.color, v.stock, v.priceOverride || null]
      );
    }
    res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update product and variants
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const p = req.body;
  try {
    // Update Product
    await query(
      `UPDATE products SET name=$1, description=$2, category_id=$3, base_price=$4, discount_percent=$5, images=$6, fabric=$7, care_instructions=$8, tags=$9, is_active=$10
       WHERE id=$11`,
      [p.name, p.description, p.category, p.basePrice, p.discountPercent, p.images, p.fabric, p.careInstructions, p.tags, p.isActive, id]
    );

    // Simplistic variant update: Delete old and insert new (or could be improved to patch)
    await query('DELETE FROM product_variants WHERE product_id = $1', [id]);
    for (const v of p.variants) {
      await query(
        `INSERT INTO product_variants (id, product_id, sku, size, color, stock, price_override)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [v.id, id, v.sku, v.size, v.color, v.stock, v.priceOverride || null]
      );
    }
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
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
  console.log(`Server running on port ${port}`);
});
