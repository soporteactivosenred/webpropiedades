/**
 * Database helper types for type-safe Supabase queries.
 * These types make it easier to work with the database schema types.
 */

import type { Database } from '@/types';

// Table names from our database schema
export type Tables = Database['public']['Tables'];
export type Views = Database['public']['Views'];
export type Functions = Database['public']['Functions'];
export type Enums = Database['public']['Enums'];

// Convenience type aliases
export type TableName = keyof Tables;
export type ViewName = keyof Views;

// Generic type for table row
export type Row<T extends TableName> = Tables[T]['Row'];

// Generic type for table insert
export type Insert<T extends TableName> = Tables[T]['Insert'];

// Generic type for table update
export type Update<T extends TableName> = Tables[T]['Update'];

// Generic type for table query result
export type QueryResult<T extends TableName> = Tables[T]['Row'][];
export type QuerySingleResult<T extends TableName> = Tables[T]['Row'] | null;

/**
 * Generic helper for building typed select queries.
 * 
 * @example
 * const { data, error } = await supabase
 *   .from('properties')
 *   .select('*')
 *   .eq('status', 'active')
 *   .returns<Row<'properties'>[]>()
 */
export type SelectResult<T extends TableName> = {
  data: Row<T>[] | null;
  error: import('@supabase/supabase-js').PostgrestError | null;
};

/**
 * Generic helper for building typed single result queries.
 * 
 * @example
 * const { data, error } = await supabase
 *   .from('properties')
 *   .select('*')
 *   .eq('slug', 'my-property')
 *   .single()
 *   .returns<Row<'properties'>>()
 */
export type SingleResult<T extends TableName> = {
  data: Row<T> | null;
  error: import('@supabase/supabase-js').PostgrestError | null;
};

/**
 * Auth user type with our profile extension
 */
export interface AuthUser {
  id: string;
  email: string;
  role?: 'admin' | 'agent' | 'user';
  profile?: Row<'profiles'>;
}

/**
 * Session response with user and profile
 */
export interface SessionWithProfile {
  user: AuthUser;
  session: import('@supabase/supabase-js').Session;
}

/**
 * API Response wrapper for consistent response format
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated response for list queries
 */
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Filter options for list queries
 */
export interface ListFilters {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Supabase error helper
 */
export function isSupabaseError(
  result: unknown
): result is { error: import('@supabase/supabase-js').PostgrestError } {
  return (
    typeof result === 'object' &&
    result !== null &&
    'error' in result &&
    (result as { error: unknown }).error !== null
  );
}

/**
 * Get error message from Supabase result
 */
export function getErrorMessage(
  result: { error: import('@supabase/supabase-js').PostgrestError | null }
): string | null {
  if (!result.error) return null;
  
  // Map common error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    '23505': 'Este registro ya existe',
    '23503': 'No se puede eliminar este registro porque está siendo usado',
    '23502': 'Falta un campo requerido',
    '42P01': 'Tabla no encontrada',
    '42501': 'No tienes permisos para realizar esta acción',
  };

  const code = result.error.code;
  return errorMessages[code] || result.error.message;
}