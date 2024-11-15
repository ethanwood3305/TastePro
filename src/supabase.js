import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://eolskonvagdxiimsdqlu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvbHNrb252YWdkeGlpbXNkcWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2ODM1MzIsImV4cCI6MjA0NzI1OTUzMn0.sfdEtHFGijOfPNidjnA0_2ODbO_pceB5MZcploiPALI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
    },
  });