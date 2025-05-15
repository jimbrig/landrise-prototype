import { Property } from '../types';

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