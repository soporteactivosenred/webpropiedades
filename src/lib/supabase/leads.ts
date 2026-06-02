/**
 * Lead-related database helpers for Supabase.
 * These functions provide type-safe CRUD operations for leads/inquiries.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Lead, LeadInsert, LeadUpdate, LeadStatus } from '@/types';
import { getErrorMessage, isSupabaseError, PaginatedResponse, ListFilters } from './types';

/**
 * Get all leads with optional filters and pagination.
 */
export async function getLeads(
  client: SupabaseClient<Database>,
  filters?: ListFilters & { status?: LeadStatus; property_id?: string }
): Promise<{ data: PaginatedResponse<Lead> | null; error: string | null }> {
  let query = client.from('leads').select('*', { count: 'exact' });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.property_id) {
    query = query.eq('property_id', filters.property_id);
  }

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 20;
  const offset = (page - 1) * pageSize;

  query = query.range(offset, offset + pageSize - 1);

  const orderBy = filters?.orderBy || 'created_at';
  const orderDirection = filters?.orderDirection || 'desc';
  query = query.order(orderBy, { ascending: orderDirection === 'asc' });

  const result = await query.returns<Lead[]>();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  const count = result.count || 0;
  const totalPages = Math.ceil(count / pageSize);

  return {
    data: {
      data: result.data || [],
      count,
      page,
      pageSize,
      totalPages,
    },
    error: null,
  };
}

/**
 * Get new (unprocessed) leads count.
 */
export async function getNewLeadsCount(client: SupabaseClient<Database>) {
  const result = await client
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');

  if (isSupabaseError(result)) {
    return { data: 0, error: getErrorMessage(result) };
  }

  return { data: result.count || 0, error: null };
}

/**
 * Get a single lead by ID.
 */
export async function getLeadById(
  client: SupabaseClient<Database>,
  id: string
): Promise<{ data: Lead | null; error: string | null }> {
  const result = await client
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()
    .returns<Lead>();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Create a new lead from website inquiry.
 */
export async function createLead(
  client: SupabaseClient<Database>,
  data: Omit<LeadInsert, 'status'>
): Promise<{ data: Lead | null; error: string | null }> {
  const result = await client
    .from('leads')
    .insert({ ...data, status: 'new' } as LeadInsert)
    .select()
    .single()
    .returns<Lead>();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Create a lead from property inquiry (contact form on property page).
 */
export async function createPropertyLead(
  client: SupabaseClient<Database>,
  data: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
    property_id: string;
    source?: 'website' | 'whatsapp';
  }
): Promise<{ data: Lead | null; error: string | null }> {
  return createLead(client, {
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    property_id: data.property_id,
    source: data.source || 'website',
  });
}

/**
 * Update lead status.
 */
export async function updateLeadStatus(
  client: SupabaseClient<Database>,
  id: string,
  status: LeadStatus
): Promise<{ data: Lead | null; error: string | null }> {
  const result = await client
    .from('leads')
    .update({ status } as LeadUpdate)
    .eq('id', id)
    .select()
    .single()
    .returns<Lead>();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Update lead details.
 */
export async function updateLead(
  client: SupabaseClient<Database>,
  id: string,
  data: LeadUpdate
): Promise<{ data: Lead | null; error: string | null }> {
  const result = await client
    .from('leads')
    .update(data)
    .eq('id', id)
    .select()
    .single()
    .returns<Lead>();

  if (isSupabaseError(result)) {
    return { data: null, error: getErrorMessage(result) };
  }

  return { data: result.data, error: null };
}

/**
 * Delete a lead.
 */
export async function deleteLead(
  client: SupabaseClient<Database>,
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const result = await client
    .from('leads')
    .delete()
    .eq('id', id)
    .returns<Lead>();

  if (isSupabaseError(result)) {
    return { success: false, error: getErrorMessage(result) };
  }

  return { success: true, error: null };
}

/**
 * Get leads by source.
 */
export async function getLeadsBySource(
  client: SupabaseClient<Database>,
  source: 'website' | 'whatsapp' | 'referral' | 'social'
): Promise<{ data: Lead[]; error: string | null }> {
  const result = await client
    .from('leads')
    .select('*')
    .eq('source', source)
    .order('created_at', { ascending: false })
    .returns<Lead[]>();

  if (isSupabaseError(result)) {
    return { data: [], error: getErrorMessage(result) };
  }

  return { data: result.data || [], error: null };
}

/**
 * Get lead statistics.
 */
export async function getLeadStats(
  client: SupabaseClient<Database>
): Promise<{
  data: Record<LeadStatus, number> | null;
  error: string | null;
}> {
  const statuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'converted', 'lost'];
  const stats: Record<string, number> = {};

  for (const status of statuses) {
    const result = await client
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('status', status);

    if (isSupabaseError(result)) {
      return { data: null, error: getErrorMessage(result) };
    }

    stats[status] = result.count || 0;
  }

  return { data: stats as Record<LeadStatus, number>, error: null };
}

/**
 * Get leads with property info.
 */
export async function getLeadsWithProperty(
  client: SupabaseClient<Database>,
  filters?: ListFilters
): Promise<{ data: (Lead & { property?: { title: string; slug: string } | null })[]; error: string | null }> {
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 20;
  const offset = (page - 1) * pageSize;

  const result = await client
    .from('leads')
    .select(`
      *,
      property:properties(id, title, slug)
    `)
    .range(offset, offset + pageSize - 1)
    .order('created_at', { ascending: false })
    .returns<(Lead & { property?: { title: string; slug: string } | null })[]>();

  if (isSupabaseError(result)) {
    return { data: [], error: getErrorMessage(result) };
  }

  return { data: result.data || [], error: null };
}