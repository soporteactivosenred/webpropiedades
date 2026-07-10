// Database types for Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: 'admin' | 'agent' | 'user';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'agent' | 'user';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'agent' | 'user';
          created_at?: string;
          updated_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          price: number;
          price_type: 'sale' | 'rent';
          property_type: 'house' | 'apartment' | 'land' | 'commercial' | 'office' | 'industrial';
          status: 'draft' | 'active' | 'sold' | 'rented';
          address: string;
          city: string;
          region: string;
          bedrooms: number | null;
          bathrooms: number | null;
          area: number | null;
          parking_spaces: number | null;
          features: string[];
          images: string[];
          latitude: number | null;
          longitude: number | null;
          year_built: number | null;
          agent_id: string | null;
          views: number;
          is_bank_liquidation: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          price: number;
          price_type: 'sale' | 'rent';
          property_type: 'house' | 'apartment' | 'land' | 'commercial' | 'office' | 'industrial';
          status?: 'draft' | 'active' | 'sold' | 'rented';
          address: string;
          city: string;
          region: string;
          bedrooms?: number | null;
          bathrooms?: number | null;
          area?: number | null;
          parking_spaces?: number | null;
          features?: string[];
          images?: string[];
          latitude?: number | null;
          longitude?: number | null;
          year_built?: number | null;
          agent_id?: string | null;
          views?: number;
          is_bank_liquidation?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          price?: number;
          price_type?: 'sale' | 'rent';
          property_type?: 'house' | 'apartment' | 'land' | 'commercial' | 'office' | 'industrial';
          status?: 'draft' | 'active' | 'sold' | 'rented';
          address?: string;
          city?: string;
          region?: string;
          bedrooms?: number | null;
          bathrooms?: number | null;
          area?: number | null;
          parking_spaces?: number | null;
          features?: string[];
          images?: string[];
          latitude?: number | null;
          longitude?: number | null;
          year_built?: number | null;
          agent_id?: string | null;
          views?: number;
          is_bank_liquidation?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string | null;
          property_id: string | null;
          source: 'website' | 'whatsapp' | 'referral' | 'social';
          status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message?: string | null;
          property_id?: string | null;
          source?: 'website' | 'whatsapp' | 'referral' | 'social';
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string | null;
          property_id?: string | null;
          source?: 'website' | 'whatsapp' | 'referral' | 'social';
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          featured_image: string | null;
          author_id: string | null;
          category: string | null;
          tags: string[];
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          featured_image?: string | null;
          author_id?: string | null;
          category?: string | null;
          tags?: string[];
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          featured_image?: string | null;
          author_id?: string | null;
          category?: string | null;
          tags?: string[];
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}