'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { invoicesApi } from '@/lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('sk_test_51QvlDsFQtSIYgirFtAOC94OGJ0ampvGcYyOjOxlOjYLYfJS4lBEum5Ser8yaexrF59st8aGfvCodXbHj4Xqkk2id00oTBjYe4S');

export default function PayInvoicePage({ params }) {
  const router = useRouter();
  
  // Unwrap the params using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await invoicesApi.getInvoice(id);
        setInvoice(response.data);
      } catch (err) {
        setError('Could not load invoice. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Here you would integrate with your payment gateway
      // Example with Stripe:
      await invoicesApi.processStripePayment(invoice.id, {
        payment_method: paymentMethod,
        card_number: cardNumber,
        card_expiry: cardExpiry,
        card_cvv: cardCvv,
        amount: invoice.balance
      });
      
      // Redirect to success page
      router.push(`/invoices/pay/${id}/success`);
    } catch (err) {
      setError('Payment failed. Please check your details and try again.');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Pay Invoice #{invoice.number}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Invoice Amount:</span>
              <span className="font-bold">${parseFloat(invoice.amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Balance Due:</span>
              <span className="font-bold">${parseFloat(invoice.balance).toFixed(2)}</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="credit_card"
                    name="payment_method"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={() => setPaymentMethod('credit_card')}
                    className="mr-2"
                  />
                  <label htmlFor="credit_card">Credit Card</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="paypal"
                    name="payment_method"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="mr-2"
                  />
                  <label htmlFor="paypal">PayPal</label>
                </div>
              </div>
            </div>
            
            {paymentMethod === 'credit_card' && (
              <>
                <Input
                  label="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry (MM/YY)"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                  <Input
                    label="CVV"
                    value={cardCvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
              </>
            )}
            
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Processing...' : `Pay $${parseFloat(invoice.balance).toFixed(2)}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}