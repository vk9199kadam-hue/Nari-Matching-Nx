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
    const result = await query(
      'UPDATE product_variants SET stock = $1 WHERE id = $2 RETURNING *',
      [stock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
