import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export const SupabaseDebugPanel: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [teachersRes, studentsRes, coursesRes] = await Promise.all([
        supabase.from('teachers').select('*'),
        supabase.from('students').select('*'),
        supabase.from('courses').select('*'),
      ]);

      if (teachersRes.error) throw teachersRes.error;
      if (studentsRes.error) throw studentsRes.error;
      if (coursesRes.error) throw coursesRes.error;

      setTeachers(teachersRes.data || []);
      setStudents(studentsRes.data || []);
      setCourses(coursesRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="fixed bottom-20 right-20 z-40 bg-white border-2 border-slate-200 rounded-lg p-4 max-w-md max-h-96 overflow-y-auto shadow-2xl">
      <h3 className="font-bold mb-3 text-right">Supabase Debug Panel</h3>
      
      {loading && <p className="text-sm text-slate-500">جاري التحميل...</p>}
      {error && <p className="text-xs text-rose-600 mb-2">❌ {error}</p>}

      {!loading && !error && (
        <>
          <div className="mb-4 text-xs text-right">
            <p className="font-bold text-emerald-600">✅ الاتصال نجح!</p>
            <p>المعلمون: {teachers.length}</p>
            <p>الطلاب: {students.length}</p>
            <p>الدورات: {courses.length}</p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="w-full px-3 py-2 bg-emerald-600 text-white text-xs rounded font-bold hover:bg-emerald-700 disabled:opacity-50"
          >
            إعادة تحميل
          </button>
        </>
      )}
    </div>
  );
};
