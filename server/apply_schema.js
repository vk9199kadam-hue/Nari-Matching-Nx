import fs from 'fs';
import { query } from './db.js';

async function applySchema() {
  try {
    console.log('Applying schema...');
    const schema = fs.readFileSync('./schema.sql', 'utf-8');
    
    // Split commands by semicolon, ignoring empty lines or comments if needed
    // CockroachDB driver usually supports executing multiple statements at once as a single string
    await query(schema);
    
    console.log('Schema applied successfully, including users and orders tables!');
  } catch (err) {
    console.error('Failed to apply schema:', err);
  } finally {
    process.exit();
  }
}

applySchema();
