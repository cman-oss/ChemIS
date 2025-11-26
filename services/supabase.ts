import { createClient } from '@supabase/supabase-js';

// These were provided in the prompt. For production, use environment variables.
const supabaseUrl = 'https://vgefgszqgpnwomhrtafz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZWZnc3pxZ3Bud29taHJ0YWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNDg1NTQsImV4cCI6MjA3ODgyNDU1NH0.rn-wgvJk7vtUO6OWnj5_ztUxKncr1dyk6Y6jzUZX5Cg';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);