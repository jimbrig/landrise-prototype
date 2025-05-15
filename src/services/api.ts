import { supabase } from "../lib/supabaseClient";
import { Property, SearchFilters } from "../types";

// Helper function for simulating API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchProperties = async (filters?: SearchFilters) => {
  let query = supabase.from("properties").select("*");

  if (filters) {
    if (filters.location.state) {
      query = query.eq('state', filters.location.state);
    }
    if (filters.location.county) {
      query = query.eq('county', filters.location.county);
    }
    if (filters.location.city) {
      query = query.eq('city', filters.location.city);
    }
    if (filters.priceRange.min !== null) {
      query = query.gte('price', filters.priceRange.min);
    }
    if (filters.priceRange.max !== null) {
      query = query.lte('price', filters.priceRange.max);
    }
    if (filters.sizeRange.min !== null) {
      query = query.gte('acres', filters.sizeRange.min);
    }
    if (filters.sizeRange.max !== null) {
      query = query.lte('acres', filters.sizeRange.max);
    }
    if (filters.zoning.length > 0) {
      query = query.in('zoning', filters.zoning);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching properties:', error);
    return { data: [], count: 0 };
  }

  return { data: data || [], count: data?.length || 0 };
};

export const fetchPropertyById = async (id: string) => {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error('Error fetching property:', error);
    return null;
  }

  return data;
};

export const fetchRegionBoundaries = async (state: string): Promise<GeoJSON.FeatureCollection> => {
  const { data, error } = await supabase
    .from("region_boundaries")
    .select("*")
    .eq("state", state);

  if (error) {
    console.error('Error fetching region boundaries:', error);
    return {
      type: 'FeatureCollection',
      features: []
    };
  }

  return {
    type: 'FeatureCollection',
    features: data || []
  };
};

export const saveSearch = async (search: { name: string; filters: any }) => {
  const { data, error } = await supabase
    .from("saved_searches")
    .insert([
      {
        name: search.name,
        filters: search.filters,
        user_id: supabase.auth.getUser().then(({ data }) => data.user?.id)
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error saving search:', error);
    throw error;
  }

  return data;
};

export const exportSearchResults = async (properties: Property[]): Promise<Blob> => {
  // Convert properties to CSV format
  const headers = ['Address', 'City', 'State', 'Price', 'Acres', 'Zoning'];
  const rows = properties.map(property => [
    property.address,
    property.city,
    property.state,
    property.price,
    property.acres,
    property.zoning
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};