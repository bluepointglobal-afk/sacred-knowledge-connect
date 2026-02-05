import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wmhieeqtuewvagwrphte.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtaGllZXF0dWV3dmFnd3JwaHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMzcyNDksImV4cCI6MjA4MTkxMzI0OX0.hMpRuBRxESrXzd--TGLiKfPdr1EjOrtoBoYkdX5ZuM8'
);

(async () => {
  try {
    const { data, error } = await supabase
      .from('teacher_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Query error:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      const cols = Object.keys(data[0]);
      console.log('✅ Columns in teacher_profiles:');
      console.log(cols.join('\n'));
      
      const newCols = ['payout_method', 'timezone', 'teaching_languages', 'regional_specialization'];
      const applied = newCols.filter(c => cols.includes(c));
      console.log('\n✅ Migration columns found:', applied.length, '/', newCols.length);
    } else {
      console.log('⚠️ No data in teacher_profiles (table may be empty but columns exist)');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
