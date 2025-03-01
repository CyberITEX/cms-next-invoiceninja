'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { invoices, clients, products } from '@/lib/api';

export default function NewInvoice() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    client_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft',
    notes: '',
    terms: 'Net 30',
    items: [{ product_id: '', description: '', quantity: 1, unit_price: 0, tax_rate: 0 }]
  });
  const [clientOptions, setClientOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [total, setTotal] = useState(0);

  // Fetch clients for the dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await clients.getAll();
        setClientOptions(clientsData);
      } catch (err) {
        console.error('Failed to fetch clients:', err);
        setError('Failed to load clients. Please try again.');
      }
    };

    fetchClients();
  }, []);

  // Fetch products for the dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await products.getAll();
        setProductOptions(productsData);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again.');
      }
    };

    fetchProducts();
  }, []);

  // Calculate totals when items change
  useEffect(() => {
    const calcSubtotal = formData.items.reduce(
      (sum, item) => sum + (parseFloat(item.unit_price) || 0) * (parseFloat(item.quantity) || 0),
      0
    );
    
    const calcTaxTotal = formData.items.reduce(
      (sum, item) => {
        const itemTotal = (parseFloat(item.unit_price) || 0) * (parseFloat(item.quantity) || 0);
        return sum + itemTotal * (parseFloat(item.tax_rate) || 0) / 100;
      },
      0
    );
    
    setSubtotal(calcSubtotal);
    setTaxTotal(calcTaxTotal);
    setTotal(calcSubtotal + calcTaxTotal);
  }, [formData.items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    
    // If product_id changes, update description, unit_price, and tax_rate
    if (field === 'product_id' && value) {
      const selectedProduct = productOptions.find(p => p.id === value);
      if (selectedProduct) {
        updatedItems[index].description = selectedProduct.description || '';
        updatedItems[index].unit_price = selectedProduct.price || 0;
        updatedItems[index].tax_rate = selectedProduct.tax_rate || 0;
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: '', description: '', quantity: 1, unit_price: 0, tax_rate: 0 }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      return; // Keep at least one item
    }
    
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.client_id || !formData.issue_date || !formData.due_date) {
        throw new Error('Please fill in all required fields');
      }

      // Validate items
      if (formData.items.some(item => !item.description || item.quantity <= 0 || item.unit_price <= 0)) {
        throw new Error('Please ensure all invoice items have a description, quantity, and price');
      }

      // Prepare invoice data for submission
      const invoiceData = {
        ...formData,
        items: formData.items.map(item => ({
          ...item,
          quantity: parseInt(item.quantity, 10),
          unit_price: parseFloat(item.unit_price),
          tax_rate: parseFloat(item.tax_rate)
        })),
        subtotal,
        tax_total: taxTotal,
        total
      };

      await invoices.create(invoiceData);
      router.push('/invoices');
      router.refresh(); // Refresh the page to show the latest data
    } catch (err) {
      console.error('Failed to create invoice:', err);
      setError(err.message || 'Failed to create invoice. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">New Invoice</h1>
        <Link
          href="/invoices"
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition"
        >
          Cancel
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Client Selection */}
          <div className="md:col-span-2">
            <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-1">
              Client *
            </label>
            <select
              id="client_id"
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a client</option>
              {clientOptions.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="partial">Partially Paid</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Issue Date */}
          <div>
            <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700 mb-1">
              Issue Date *
            </label>
            <input
              type="date"
              id="issue_date"
              name="issue_date"
              value={formData.issue_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Terms */}
          <div>
            <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">
              Terms
            </label>
            <select
              id="terms"
              name="terms"
              value={formData.terms}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 45">Net 45</option>
              <option value="Net 60">Net 60</option>
              <option value="Due on Receipt">Due on Receipt</option>
            </select>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-700 mb-3">Invoice Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-sm font-medium text-gray-500">Product</th>
                  <th scope="col" className="px-3 py-2 text-left text-sm font-medium text-gray-500">Description</th>
                  <th scope="col" className="px-3 py-2 text-left text-sm font-medium text-gray-500">Quantity</th>
                  <th scope="col" className="px-3 py-2 text-left text-sm font-medium text-gray-500">Unit Price</th>
                  <th scope="col" className="px-3 py-2 text-left text-sm font-medium text-gray-500">Tax %</th>
                  <th scope="col" className="px-3 py-2 text-left text-sm font-medium text-gray-500">Total</th>
                  <th scope="col" className="px-3 py-2 text-left text-sm font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2">
                      <select
                        value={item.product_id}
                        onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                        className="w-full p-1 text-sm border border-gray-300 rounded-md"
                      >
                        <option value="">Select a product</option>
                        {productOptions.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full p-1 text-sm border border-gray-300 rounded-md"
                        placeholder="Item description"
                        required
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-20 p-1 text-sm border border-gray-300 rounded-md"
                        required
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                        className="w-24 p-1 text-sm border border-gray-300 rounded-md"
                        required
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.tax_rate}
                        onChange={(e) => handleItemChange(index, 'tax_rate', e.target.value)}
                        className="w-16 p-1 text-sm border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="px-3 py-2 text-sm">
                      ${((item.unit_price * item.quantity) + (item.unit_price * item.quantity * (item.tax_rate / 100))).toFixed(2)}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                        disabled={formData.items.length === 1}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button
            type="button"
            onClick={addItem}
            className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            + Add Item
          </button>
        </div>

        {/* Invoice Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="text-sm font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tax:</span>
              <span className="text-sm font-medium">${taxTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-base font-medium">Total:</span>
              <span className="text-base font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Additional notes for the client..."
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/invoices"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
}