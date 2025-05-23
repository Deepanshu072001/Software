// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tyrsyszgbnarbvihshko.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5cnN5c3pnYm5hcmJ2aWhzaGtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MTE3ODksImV4cCI6MjA2MzE4Nzc4OX0.Zf5d_Iw1xgkEzJbgTZlUqlvDnA5IpWRyVuVPR8a_xaA';
export const supabase = createClient(supabaseUrl, supabaseKey);
