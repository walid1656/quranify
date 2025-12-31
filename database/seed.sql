-- Seed Data for Quranify Platform

-- Insert Sample Teachers
INSERT INTO teachers (name, specialization, bio, rating, hourly_rate, sessions_count, earnings, status, joined_date) VALUES
('د. أحمد السقا', 'قراءات عشر', 'إجازة متصلة بالسند إلى رسول الله ﷺ.', 4.9, 25.00, 1240, 15400.00, 'active', '2022-05-10'),
('أ. مريم العوضي', 'تحفيظ أطفال', 'متخصصة في تعليم الأطفال والناشئة.', 4.8, 20.00, 850, 8200.00, 'active', '2023-01-15'),
('د. يوسف منصور', 'أستاذ أزهري', 'دكتوراة في علوم القرآن وتفسيره.', 5.0, 35.00, 2100, 21000.00, 'pending', '2024-02-20');

-- Insert Sample Students
INSERT INTO students (name, points, level, streak, rank, progress, status, joined_date) VALUES
('أحمد علي', 4250, 12, 7, 4, 65, 'active', '2023-01-12'),
('فاطمة خالد', 5800, 15, 12, 2, 40, 'active', '2023-05-20'),
('ياسين محمود', 1200, 5, 2, 18, 12, 'active', '2023-08-15'),
('ليلى مراد', 6100, 18, 30, 1, 85, 'active', '2023-11-05');

-- Insert Sample Courses
INSERT INTO courses (title, category, description, lessons_count, progress, next_lesson, created_by) VALUES
('إتقان التجويد (رواية حفص)', 'تجويد', 'دورة شاملة في أحكام التجويد العملية.', 24, 65, 'أحكام النون الساكنة', NULL),
('حفظ سورة البقرة', 'حفظ', 'خطة منهجية لحفظ وتثبيت سورة البقرة.', 50, 40, 'صفحة 45', NULL),
('القاعدة النورانية', 'تأسيس', 'التأسيس الصحيح لنطق الحروف والكلمات.', 18, 100, 'تم الإكمال', NULL),
('تفسير القرآن الكريم', 'تفسير', 'شرح تفسيري لآيات القرآن الكريم.', 30, 25, 'سورة يس', NULL);

-- Insert Sample Schedule
INSERT INTO schedule (title, type, instructor_id, instructor_name, time, day) VALUES
('حصة تجويد مباشرة', 'live', NULL, 'د. أحمد السقا', '04:00 م', 15),
('مراجعة الجزء الثلاثون', 'review', NULL, 'دراسة ذاتية', '08:30 م', 18),
('حفظ سورة الفاتحة', 'live', NULL, 'أ. مريم العوضي', '03:00 م', 20),
('تفسير الآيات', 'live', NULL, 'د. يوسف منصور', '06:00 م', 22);

-- Insert Sample Achievements
INSERT INTO achievements (student_id, title, description, unlocked, progress, total, unlocked_at) VALUES
(
  (SELECT id FROM students WHERE name = 'أحمد علي'),
  'قارئ مجتهد',
  'أتممت 10 ساعات من الحفظ المتواصل',
  true,
  10,
  10,
  '2024-05-12'
),
(
  (SELECT id FROM students WHERE name = 'أحمد علي'),
  'مرتل متقن',
  'حصلت على تقييم 5 نجوم في 5 حصص تجويد',
  true,
  5,
  5,
  '2024-05-15'
),
(
  (SELECT id FROM students WHERE name = 'ليلى مراد'),
  'حارس الكتاب',
  'حفظت أول جزئين من القرآن الكريم',
  true,
  2,
  2,
  '2024-06-01'
),
(
  (SELECT id FROM students WHERE name = 'ليلى مراد'),
  'السلسلة الذهبية',
  'حافظ على سلسلة نشاط لمدة 30 يوماً',
  true,
  30,
  30,
  '2024-06-15'
);

-- Insert Student Course Enrollments
INSERT INTO student_courses (student_id, course_id, progress, enrolled_at, completed_at) VALUES
(
  (SELECT id FROM students WHERE name = 'أحمد علي'),
  (SELECT id FROM courses WHERE title = 'إتقان التجويد (رواية حفص)'),
  65,
  '2024-01-10',
  NULL
),
(
  (SELECT id FROM students WHERE name = 'أحمد علي'),
  (SELECT id FROM courses WHERE title = 'حفظ سورة البقرة'),
  40,
  '2024-02-15',
  NULL
),
(
  (SELECT id FROM students WHERE name = 'ليلى مراد'),
  (SELECT id FROM courses WHERE title = 'القاعدة النورانية'),
  100,
  '2023-11-20',
  '2024-01-15'
),
(
  (SELECT id FROM students WHERE name = 'ليلى مراد'),
  (SELECT id FROM courses WHERE title = 'تفسير القرآن الكريم'),
  70,
  '2024-03-10',
  NULL
);
