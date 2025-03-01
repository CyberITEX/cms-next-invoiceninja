// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_INVOICE_NINJA_API_URL || 'https://billing.cyberitex.com/api/v1';
const API_TOKEN = process.env.INVOICE_NINJA_API_TOKEN;


/**
 * Base API client for making requests to the InvoiceNinja API
 */
class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Get authentication headers for API requests
   */
  getHeaders() {
    console.log("API_TOKEN", API_TOKEN);
    return {
      'Content-Type': 'application/json',
      'X-API-TOKEN': API_TOKEN,
    };
  }

  /**
   * Make a GET request to the API
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => 
      url.searchParams.append(key, params[key])
    );
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw await this.handleError(response);
    }
    
    return await response.json();
  }

  /**
   * Make a POST request to the API
   */
  async post(endpoint, data = {}) {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw await this.handleError(response);
    }
    
    return await response.json();
  }

  /**
   * Make a PUT request to the API
   */
  async put(endpoint, data = {}) {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw await this.handleError(response);
    }
    
    return await response.json();
  }

  /**
   * Make a DELETE request to the API
   */
  async delete(endpoint) {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw await this.handleError(response);
    }
    
    return await response.json();
  }

  /**
   * Handle API errors
   */
  async handleError(response) {
    let errorMessage;
    
    try {
      const data = await response.json();
      errorMessage = data.message || `Error: ${response.status}`;
    } catch (e) {
      errorMessage = `Error: ${response.status} ${response.statusText}`;
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    return error;
  }
}

// Create API services for different entities
const apiClient = new ApiClient();

export const clientsApi = {
  // Get all clients
  getClients: (params = {}) => apiClient.get('clients', params),
  
  // Get a single client by ID
  getClient: (id) => apiClient.get(`clients/${id}`),
  
  // Create a new client
  createClient: (data) => apiClient.post('clients', data),
  
  // Update an existing client
  updateClient: (id, data) => apiClient.put(`clients/${id}`, data),
  
  // Delete a client
  deleteClient: (id) => apiClient.delete(`clients/${id}`),
};

export const productsApi = {
  // Get all products
  getProducts: (params = {}) => apiClient.get('products', params),
  
  // Get a single product by ID
  getProduct: (id) => apiClient.get(`products/${id}`),
  
  // Create a new product
  createProduct: (data) => apiClient.post('products', data),
  
  // Update an existing product
  updateProduct: (id, data) => apiClient.put(`products/${id}`, data),
  
  // Delete a product
  deleteProduct: (id) => apiClient.delete(`products/${id}`),
};

export const invoicesApi = {
  // Get all invoices
  getInvoices: (params = {}) => apiClient.get('invoices', params),
  
  // Get a single invoice by ID
  getInvoice: (id) => apiClient.get(`invoices/${id}`),
  
  // Create a new invoice
  createInvoice: (data) => apiClient.post('invoices', data),
  
  // Update an existing invoice
  updateInvoice: (id, data) => apiClient.put(`invoices/${id}`, data),
  
  // Delete an invoice
  deleteInvoice: (id) => apiClient.delete(`invoices/${id}`),
  
  // Send an invoice by email
  emailInvoice: (id) => apiClient.post(`invoices/${id}/email`),
};

export const recurringInvoicesApi = {
  // Get all recurring invoices
  getRecurringInvoices: (params = {}) => apiClient.get('recurring_invoices', params),
  
  // Get a single recurring invoice by ID
  getRecurringInvoice: (id) => apiClient.get(`recurring_invoices/${id}`),
  
  // Create a new recurring invoice
  createRecurringInvoice: (data) => apiClient.post('recurring_invoices', data),
  
  // Update an existing recurring invoice
  updateRecurringInvoice: (id, data) => apiClient.put(`recurring_invoices/${id}`, data),
  
  // Delete a recurring invoice
  deleteRecurringInvoice: (id) => apiClient.delete(`recurring_invoices/${id}`),
};

export const paymentsApi = {
  // Get all payments
  getPayments: (params = {}) => apiClient.get('payments', params),
  
  // Get a single payment by ID
  getPayment: (id) => apiClient.get(`payments/${id}`),
  
  // Create a new payment
  createPayment: (data) => apiClient.post('payments', data),
  
  // Update an existing payment
  updatePayment: (id, data) => apiClient.put(`payments/${id}`, data),
  
  // Delete a payment
  deletePayment: (id) => apiClient.delete(`payments/${id}`),
  
  // Process payment with Stripe
  processStripePayment: (invoiceId, data) => 
    apiClient.post(`invoices/${invoiceId}/payment/stripe`, data),
  
  // Process payment with Braintree
  processBraintreePayment: (invoiceId, data) => 
    apiClient.post(`invoices/${invoiceId}/payment/braintree`, data),
};

// Export the API client for direct use if needed
export default apiClient;