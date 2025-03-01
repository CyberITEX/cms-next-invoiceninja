'use server';

// Server-side API configuration
const API_BASE_URL = process.env.INVOICE_NINJA_API_URL || 'https://billing.cyberitex.com/api/v1';
const API_TOKEN = process.env.INVOICE_NINJA_API_TOKEN;

/**
 * Get authentication headers for API requests
 */
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-API-TOKEN': API_TOKEN,
  };
}

/**
 * Handle API errors
 */
async function handleError(response) {
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

// Client endpoints
export async function getClients(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value);
  });
  
  const url = `${API_BASE_URL}/clients?${searchParams.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function getClient(id) {
  const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function createClient(data) {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function updateClient(id, data) {
  const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function deleteClient(id) {
  const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

// Product endpoints
export async function getProducts(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value);
  });
  
  const url = `${API_BASE_URL}/products?${searchParams.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function getProduct(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function createProduct(data) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function updateProduct(id, data) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

// Invoice endpoints
export async function getInvoices(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value);
  });
  
  const url = `${API_BASE_URL}/invoices?${searchParams.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function getInvoice(id) {
  const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function createInvoice(data) {
  const response = await fetch(`${API_BASE_URL}/invoices`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function updateInvoice(id, data) {
  const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function deleteInvoice(id) {
  const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function emailInvoice(id) {
  const response = await fetch(`${API_BASE_URL}/invoices/${id}/email`, {
    method: 'POST',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

// Recurring Invoice endpoints
export async function getRecurringInvoices(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value);
  });
  
  const url = `${API_BASE_URL}/recurring_invoices?${searchParams.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function getRecurringInvoice(id) {
  const response = await fetch(`${API_BASE_URL}/recurring_invoices/${id}`, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function createRecurringInvoice(data) {
  const response = await fetch(`${API_BASE_URL}/recurring_invoices`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function updateRecurringInvoice(id, data) {
  const response = await fetch(`${API_BASE_URL}/recurring_invoices/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function deleteRecurringInvoice(id) {
  const response = await fetch(`${API_BASE_URL}/recurring_invoices/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

// Payment endpoints
export async function getPayments(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value);
  });
  
  const url = `${API_BASE_URL}/payments?${searchParams.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function getPayment(id) {
  const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function createPayment(data) {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function updatePayment(id, data) {
  const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function deletePayment(id) {
  const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function processStripePayment(invoiceId, data) {
  const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/payment/stripe`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}

export async function processBraintreePayment(invoiceId, data) {
  const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/payment/braintree`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw await handleError(response);
  }
  
  return await response.json();
}