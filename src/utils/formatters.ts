/**
 * Formats a number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formats a number with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Formats acres with appropriate suffix
 */
export const formatAcres = (acres: number): string => {
  return `${acres.toFixed(1)} ${acres === 1 ? 'acre' : 'acres'}`;
};

/**
 * Formats a date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Truncates text to a specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Formats price per acre
 */
export const formatPricePerAcre = (price: number, acres: number): string => {
  if (!acres) return 'N/A';
  const pricePerAcre = Math.round(price / acres);
  return formatCurrency(pricePerAcre) + '/acre';
};