export interface AppEnv {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
}

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawSupabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

export const ENV: AppEnv = {
  supabaseUrl: rawSupabaseUrl.trim(),
  supabaseAnonKey: rawSupabaseKey.trim(),
  apiBaseUrl: rawApiBaseUrl.trim(),
};

export interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

export function validateEnv(): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  if (!ENV.supabaseUrl) {
    missing.push('VITE_SUPABASE_URL');
  } else if (ENV.supabaseUrl.includes('placeholder') || ENV.supabaseUrl.includes('your-project')) {
    missing.push('VITE_SUPABASE_URL (has placeholder value)');
  } else if (!ENV.supabaseUrl.startsWith('https://') && !ENV.supabaseUrl.startsWith('http://')) {
    missing.push('VITE_SUPABASE_URL (must begin with https://)');
  }

  if (!ENV.supabaseAnonKey) {
    missing.push('VITE_SUPABASE_PUBLISHABLE_KEY');
  } else if (ENV.supabaseAnonKey.includes('placeholder') || ENV.supabaseAnonKey.includes('your-anon-key')) {
    missing.push('VITE_SUPABASE_PUBLISHABLE_KEY (has placeholder value)');
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}
