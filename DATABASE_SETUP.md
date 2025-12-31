# Quranify Database Setup Guide

## Supabase Configuration

Your environment variables are already set in `.env.local`:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `DATABASE_URL` - PostgreSQL connection string (pooling)
- `DIRECT_URL` - Direct PostgreSQL connection (for migrations)

## Creating Database Schema

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy the entire contents from `database/schema.sql`
6. Paste it into the query editor
7. Click **Run**

This will create all necessary tables, indexes, and RLS policies.

### Option 2: Using TypeScript Script

```bash
npm run init:db
```

This script will:
- Check your Supabase connection
- Verify if tables exist
- Display next steps if tables need to be created

## Database Tables

### users
- `id` (UUID) - Auth user ID
- `email`, `role`, `full_name`, `avatar_url`
- Used for authentication and user profiles

### teachers
- `id`, `user_id`, `name`, `specialization`, `rating`
- `hourly_rate`, `earnings`, `sessions_count`
- Tracks instructor information

### students
- `id`, `user_id`, `name`, `points`, `level`, `streak`, `rank`
- Tracks student progress and gamification data

### courses
- `id`, `title`, `category`, `description`, `lessons_count`
- Course catalog and details

### schedule
- `id`, `title`, `type`, `instructor_id`, `time`, `day`
- Class schedule and sessions

### achievements
- `id`, `student_id`, `title`, `unlocked`, `progress`
- Student achievements and badges

### student_courses
- Links students to courses (enrollment tracking)

### contact_messages
- Stores form submissions from contact forms

## Querying Data in React

Example using the Supabase client:

```typescript
import { supabase, getTeachers, addStudent } from '@/services/supabaseClient';

// Get all teachers
const { data: teachers, error } = await getTeachers();

// Add a new student
const { data, error } = await addStudent({
  user_id: userId,
  name: 'أحمد علي',
  points: 0,
  level: 1,
});

// Custom queries
const { data, error } = await supabase
  .from('students')
  .select('*')
  .eq('status', 'active');
```

## Authentication Setup

Add login/signup functionality:

```typescript
import { signUp, signIn } from '@/services/supabaseClient';

// Sign up
const { data, error } = await signUp('user@example.com', 'password');

// Sign in
const { data, error } = await signIn('user@example.com', 'password');
```

## Security (RLS Policies)

Row Level Security is enabled on all tables. Policies allow:
- Users to view their own profile
- Public viewing of courses, teachers, and schedule
- Anyone to submit contact messages
- Students to manage their enrollments

Adjust policies in the Supabase Dashboard under **Authentication > Policies** as needed.

## Troubleshooting

### Connection Error
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
- Check Supabase project status in dashboard

### Table Not Found
- Run the SQL schema from `database/schema.sql` in Supabase SQL Editor
- Ensure RLS is enabled and policies are set

### Authentication Failed
- Ensure email/password are correct
- Check if user exists in Supabase Auth

For more help: [Supabase Docs](https://supabase.com/docs)
