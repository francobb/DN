import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mpujqnqswddmjrzsqfiv.supabase.co"
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTg2NTA0MCwiZXhwIjoxOTU3NDQxMDQwfQ.4S6ZyPnZ-4tdM6W_VBLBHEVxvlqTflB-Q3Puw5gG8Yk'
// export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
//   localStorage: AsyncStorage as any,
//   detectSessionInUrl: false // Prevents Supabase from evaluating window.location.href, breaking mobile
// });
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY,  {
    localStorage: AsyncStorage as any,
    detectSessionInUrl: false // Prevents Supabase from evaluating window.location.href, breaking mobile
  });
