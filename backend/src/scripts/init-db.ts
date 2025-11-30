import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

const initDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');

    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    await pool.query(schema);

    console.log('✅ Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

initDatabase();
