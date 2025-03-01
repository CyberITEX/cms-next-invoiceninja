'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { createClient, getClients, createInvoice } from '@/lib/server-actions';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('shopping-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.length === 0) {
          // Redirect to cart page if cart is empty
          router.push('/store/cart');
          return;
        }
        setCart(parsedCart);
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
        setError('Something went wrong with your cart. Please try again.');
      }
    } else {
      // Redirect to cart page if no cart exists
      router.push('/store/cart');
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTaxTotal = () => {
    return cart.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      return total + (itemTotal * (item.tax_rate / 100));
    }, 0);
  };

  const getTotal = () => {
    return getSubtotal() + getTaxTotal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      const requiredFields = [
        'name', 'email', 'address', 'city', 'state', 'zip', 'country', 'paymentMethod'
      ];
      
      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Validate payment fields
      if (formData.paymentMethod === 'credit_card') {
        if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv) {
          throw new Error('Please fill in all credit card details');
        }
        
        // Simple validation for card number (16 digits)
        if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
          throw new Error('Please enter a valid 16-digit card number');
        }
        
        // Simple validation for expiry (MM/YY)
        if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
          throw new Error('Please enter a valid expiry date (MM/YY)');
        }
        
        // Simple validation for CVV (3-4 digits)
        if (!/^\d{3,4}$/.test(formData.cardCvv)) {
          throw new Error('Please enter a valid CVV code');
        }
      }
      
      // First, create or find the client
      let clientId;
      try {
        // Check if client exists by email
        const clientsResponse = await getClients({ email: formData.email });
        if (clientsResponse.data && clientsResponse.data.length > 0) {
          // Use existing client
          clientId = clientsResponse.data[0].id;
        } else {
          // Create new client
          const clientData = {
            name: formData.name,
            email: formData.email,
            address1: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.zip,
            country: formData.country,
            is_active: true
          };
          
          const newClient = await createClient(clientData);
          clientId = newClient.data.id;
        }
      } catch (err) {
        console.error('Error with client creation/lookup:', err);
        throw new Error('Failed to process customer information');
      }
      
      // Create invoice
      const invoiceData = {
        client_id: clientId,
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'sent',
        terms: 'Due on Receipt',
        items: cart.map(item => ({
          product_id: item.id,
          description: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          tax_rate: item.tax_rate || 0
        })),
        subtotal: getSubtotal(),
        tax_total: getTaxTotal(),
        total: getTotal()
      };
      
      await createInvoice(invoiceData);
      
      // Process payment based on payment method
      if (formData.paymentMethod === 'credit_card') {
        // In a real app, this would integrate with a payment processor
        // For this demo, we'll just simulate a successful payment
        
        // Note: In a real application, you would use a server action to process the payment
        // that handles sensitive payment information securely
      }
      
      // Clear cart after successful checkout
      localStorage.removeItem('shopping-cart');
      
      // Redirect to success page
      router.push('/store/checkout/success');
      
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to process checkout. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="text-gray-900 dark:text-white font-medium">${getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-600 dark:text-gray-400">Tax</span>
                      <span className="text-gray-900 dark:text-white font-medium">${getTaxTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mt-4 pt-4 border-t">
                      <span className="text-lg font-medium text-gray-900 dark:text-white">Total</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">${getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/store/cart" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  ← Back to cart
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping & Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Full Name *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                      
                      <Input
                        label="Email Address *"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Shipping Address</h3>
                    
                    <Input
                      label="Address *"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your street address"
                      required
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="City *"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter your city"
                        required
                      />
                      
                      <Input
                        label="State/Province *"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter your state"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="ZIP/Postal Code *"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        placeholder="Enter your ZIP code"
                        required
                      />
                      
                      <Select
                        label="Country *"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        options={[
                          { value: 'US', label: 'United States' },
                          { value: 'CA', label: 'Canada' },
                          { value: 'UK', label: 'United Kingdom' },
                          { value: 'AU', label: 'Australia' }
                        ]}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Payment Method</h3>
                    
                    <Select
                      label="Payment Method *"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      options={[
                        { value: 'credit_card', label: 'Credit Card' },
                        { value: 'paypal', label: 'PayPal' }
                      ]}
                      required
                    />
                    
                    {formData.paymentMethod === 'credit_card' && (
                      <div className="space-y-4">
                        <Input
                          label="Card Number *"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Expiry Date (MM/YY) *"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            required
                          />
                          
                          <Input
                            label="CVV *"
                            name="cardCvv"
                            value={formData.cardCvv}
                            onChange={handleChange}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-6 flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : `Pay $${getTotal().toFixed(2)}`}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}