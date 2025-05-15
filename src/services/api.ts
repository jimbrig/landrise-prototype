import { Property, SearchFilters, SavedSearch } from '../types';
import { supabase } from '../lib/supabaseClient';

export const fetchProperties = async (filters?: SearchFilters): Promise<Property[]> => {
  let query = supabase.from('properties').select('*');

  if (filters) {
    if (filters.minPrice) query = query.gte('price', filters.minPrice);
    if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
    if (filters.minAcres) query = query.gte('acres', filters.minAcres);
    if (filters.maxAcres) query = query.lte('acres', filters.maxAcres);
    if (filters.state) query = query.eq('state', filters.state);
    if (filters.county) query = query.eq('county', filters.county);
    if (filters.zoning) query = query.eq('zoning', filters.zoning);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }

  return data || [];
};

export const saveSearch = async (search: Omit<SavedSearch, 'id' | 'user_id' | 'created_at'>): Promise<void> => {
  const { error } = await supabase
    .from('saved_searches')
    .insert([search]);

  if (error) {
    console.error('Error saving search:', error);
    throw error;
  }
};

// Convert property data to CSV format
const convertToCSV = (properties: Property[]): string => {
  // Define CSV headers based on property fields
  const headers = [
    'Address',
    'City',
    'State',
    'ZIP',
    'County',
    'Price',
    'Acres',
    'Zoning',
    'Latitude',
    'Longitude'
  ].join(',');

  // Convert each property to CSV row
  const rows = properties.map(property => [
    `"${property.address}"`,
    `"${property.city}"`,
    `"${property.state}"`,
    `"${property.zip}"`,
    `"${property.county}"`,
    property.price,
    property.acres,
    `"${property.zoning}"`,
    property.latitude,
    property.longitude
  ].join(','));

  // Combine headers and rows
  return [headers, ...rows].join('\n');
};

export const exportSearchResults = async (properties: Property[]): Promise<Blob> => {
  const csv = convertToCSV(properties);
  return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
};