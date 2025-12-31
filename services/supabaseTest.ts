import { supabase, getTeachers, getStudents, getCourses } from '../services/supabaseClient';

export async function testSupabaseConnection() {
  try {
    console.log('🧪 Testing Supabase connection...');

    // Test 1: Get auth user
    const { data: user, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.log('ℹ️  No authenticated user (expected for guest)');
    } else {
      console.log('✅ Auth working:', user?.user?.email);
    }

    // Test 2: Query teachers
    const { data: teachers, error: teachersError } = await getTeachers();
    if (teachersError) {
      console.warn('⚠️  Could not fetch teachers:', teachersError.message);
    } else {
      console.log(`✅ Teachers query works (${teachers?.length || 0} records)`);
    }

    // Test 3: Query students
    const { data: students, error: studentsError } = await getStudents();
    if (studentsError) {
      console.warn('⚠️  Could not fetch students:', studentsError.message);
    } else {
      console.log(`✅ Students query works (${students?.length || 0} records)`);
    }

    // Test 4: Query courses
    const { data: courses, error: coursesError } = await getCourses();
    if (coursesError) {
      console.warn('⚠️  Could not fetch courses:', coursesError.message);
    } else {
      console.log(`✅ Courses query works (${courses?.length || 0} records)`);
    }

    console.log('\n✅ Supabase connection test complete!');
    return true;
  } catch (error) {
    console.error('❌ Supabase test failed:', error);
    return false;
  }
}
