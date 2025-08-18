// Format price as INR currency (₹)
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Truncate long strings (like product names)
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

// Calculate total price of cart items
export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};

// Capitalize the first letter of a string
export const capitalize = (str) => {
  if (typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Format date in readable format
export const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-IN', options);
};
