'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function CheckoutSuccessPage() {
  // Clear cart on successful checkout
  useEffect(() => {
    localStorage.removeItem('shopping-cart');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Confirmed!</h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for your purchase. Your order has been received and is now being processed.
            You will receive an email confirmation shortly.
          </p>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">
              Order #INV-{Math.floor(100000 + Math.random() * 900000)}
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
              <Link href="/store">
                <Button>
                  Continue Shopping
                </Button>
              </Link>
              
              <Link href="/invoices">
                <Button variant="secondary">
                  View Invoices
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}