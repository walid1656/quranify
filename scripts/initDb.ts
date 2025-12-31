import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function initDatabase() {
  try {
    console.log('🔌 Connecting to Supabase...');
    
    // Test connection
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('*')
      .limit(1);

    console.log('✅ Connected to Supabase successfully');

    // Read SQL schema
    const schemaPath = path.join(path.dirname(import.meta.url).replace('file:///', ''), '../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    // Note: Direct SQL execution requires admin access
    // Instead, we'll use Supabase REST API to check tables exist and create if needed
    console.log('📊 Checking database schema...');

    const tableNames = [
      'users', 'teachers', 'students', 'courses', 'schedule',
      'achievements', 'student_courses', 'contact_messages'
    ];

    for (const tableName of tableNames) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error && error.code === 'PGRST103') {
        console.log(`⚠️  Table '${tableName}' does not exist`);
        console.log(`   Run the SQL in database/schema.sql in Supabase dashboard manually`);
      } else {
        console.log(`✅ Table '${tableName}' exists`);
      }
    }

    console.log('\n📋 Next steps:');
    console.log('1. Go to Supabase Dashboard (https://app.supabase.com)');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Create a new query and paste the contents of database/schema.sql');
    console.log('5. Run the query');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

initDatabase();
