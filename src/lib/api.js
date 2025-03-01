/**
 * API client for interacting with the backend services
 * Using async/await for server-side compatibility
 */

// Base API URL - can be configured based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://billing.cyberitex.com/api/v1';
const API_TOKEN = process.env.INVOICE_NINJA_API_TOKEN;

/**
 * Make an API request with proper error handling
 * 
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - The response data
 */
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set default headers if not provided
  if (!options.headers) {
    options.headers = {
      'Content-Type': 'application/json',
      'X-API-TOKEN': API_TOKEN,
    };
  }

  try {
    const response = await fetch(url, options);
    
    // Handle non-2xx status codes
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    // Parse JSON response
    return await response.json();
  } catch (error) {
    console.error(`API request error: ${error.message}`);
    throw error;
  }
}

/**
 * Client API functions
 */
export const clients = {
  /**
   * Get all clients
   * @returns {Promise<Array>} List of clients
   */
  getAll: async () => {
    return await fetchApi('/clients');
  },
  
  /**
   * Get a single client by ID
   * @param {string} id - Client ID
   * @returns {Promise<Object>} Client details
   */
  getById: async (id) => {
    return await fetchApi(`/clients/${id}`);
  },
  
  /**
   * Create a new client
   * @param {Object} data - Client data
   * @returns {Promise<Object>} Created client
   */
  create: async (data) => {
    return await fetchApi('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Update an existing client
   * @param {string} id - Client ID
   * @param {Object} data - Updated client data
   * @returns {Promise<Object>} Updated client
   */
  update: async (id, data) => {
    return await fetchApi(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Delete a client
   * @param {string} id - Client ID
   * @returns {Promise<Object>} Result of deletion
   */
  delete: async (id) => {
    return await fetchApi(`/clients/${id}`, {
      method: 'DELETE',
    });
  }
};

/**
 * Invoice API functions
 */
export const invoices = {
  /**
   * Get all invoices
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} List of invoices
   */
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await fetchApi(`/invoices${queryString ? `?${queryString}` : ''}`);
  },
  
  /**
   * Get a single invoice by ID
   * @param {string} id - Invoice ID
   * @returns {Promise<Object>} Invoice details
   */
  getById: async (id) => {
    return await fetchApi(`/invoices/${id}`);
  },
  
  /**
   * Create a new invoice
   * @param {Object} data - Invoice data
   * @returns {Promise<Object>} Created invoice
   */
  create: async (data) => {
    return await fetchApi('/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Update an existing invoice
   * @param {string} id - Invoice ID
   * @param {Object} data - Updated invoice data
   * @returns {Promise<Object>} Updated invoice
   */
  update: async (id, data) => {
    return await fetchApi(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Delete an invoice
   * @param {string} id - Invoice ID
   * @returns {Promise<Object>} Result of deletion
   */
  delete: async (id) => {
    return await fetchApi(`/invoices/${id}`, {
      method: 'DELETE',
    });
  }
};

/**
 * Product API functions
 */
export const products = {
  /**
   * Get all products
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} List of products
   */
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await fetchApi(`/products${queryString ? `?${queryString}` : ''}`);
  },
  
  /**
   * Get a single product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product details
   */
  getById: async (id) => {
    return await fetchApi(`/products/${id}`);
  },
  
  /**
   * Create a new product
   * @param {Object} data - Product data
   * @returns {Promise<Object>} Created product
   */
  create: async (data) => {
    return await fetchApi('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Update an existing product
   * @param {string} id - Product ID
   * @param {Object} data - Updated product data
   * @returns {Promise<Object>} Updated product
   */
  update: async (id, data) => {
    return await fetchApi(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Delete a product
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Result of deletion
   */
  delete: async (id) => {
    return await fetchApi(`/products/${id}`, {
      method: 'DELETE',
    });
  }
};

/**
 * Payment API functions
 */
export const payments = {
  /**
   * Get all payments
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} List of payments
   */
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await fetchApi(`/payments${queryString ? `?${queryString}` : ''}`);
  },
  
  /**
   * Get a single payment by ID
   * @param {string} id - Payment ID
   * @returns {Promise<Object>} Payment details
   */
  getById: async (id) => {
    return await fetchApi(`/payments/${id}`);
  },
  
  /**
   * Create a new payment
   * @param {Object} data - Payment data
   * @returns {Promise<Object>} Created payment
   */
  create: async (data) => {
    return await fetchApi('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Update an existing payment
   * @param {string} id - Payment ID
   * @param {Object} data - Updated payment data
   * @returns {Promise<Object>} Updated payment
   */
  update: async (id, data) => {
    return await fetchApi(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Delete a payment
   * @param {string} id - Payment ID
   * @returns {Promise<Object>} Result of deletion
   */
  delete: async (id) => {
    return await fetchApi(`/payments/${id}`, {
      method: 'DELETE',
    });
  }
};

/**
 * Recurring Invoices API functions
 */
export const recurringInvoices = {
  /**
   * Get all recurring invoices
   * @returns {Promise<Array>} List of recurring invoices
   */
  getAll: async () => {
    return await fetchApi('/recurring-invoices');
  },
  
  /**
   * Get a single recurring invoice by ID
   * @param {string} id - Recurring invoice ID
   * @returns {Promise<Object>} Recurring invoice details
   */
  getById: async (id) => {
    return await fetchApi(`/recurring-invoices/${id}`);
  },
  
  /**
   * Create a new recurring invoice
   * @param {Object} data - Recurring invoice data
   * @returns {Promise<Object>} Created recurring invoice
   */
  create: async (data) => {
    return await fetchApi('/recurring-invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Update an existing recurring invoice
   * @param {string} id - Recurring invoice ID
   * @param {Object} data - Updated recurring invoice data
   * @returns {Promise<Object>} Updated recurring invoice
   */
  update: async (id, data) => {
    return await fetchApi(`/recurring-invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Delete a recurring invoice
   * @param {string} id - Recurring invoice ID
   * @returns {Promise<Object>} Result of deletion
   */
  delete: async (id) => {
    return await fetchApi(`/recurring-invoices/${id}`, {
      method: 'DELETE',
    });
  }
};

// Export a default object with all API functions
export default {
  clients,
  invoices,
  products,
  payments,
  recurringInvoices
};