import bcrypt from 'bcrypt';
import { query } from './db.js';

async function createAdmin() {
  const email = 'admin@shopcaper.com';
  const password = 'admin'; // Same as old local password

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await query(
      `INSERT INTO users (name, email, password_hash, phone, role) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO UPDATE SET role = 'admin'`,
      ['ShopCaper Admin', email, passwordHash, '0000000000', 'admin']
    );
    console.log('Admin account successfully injected into CockroachDB!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin:', error);
    process.exit(1);
  }
}

createAdmin();
