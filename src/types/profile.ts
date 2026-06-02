import type { Database } from './database';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type UserRole = 'admin' | 'agent' | 'user';

export interface ProfileWithStats extends Profile {
  properties_count?: number;
  leads_count?: number;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  agent: 'Agente',
  user: 'Usuario',
};