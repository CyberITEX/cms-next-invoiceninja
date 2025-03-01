'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/ui/Modal';
import { paymentsApi } from '@/lib/api';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const response = await paymentsApi.getPayments();
        setPayments(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Failed to load payments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleDeleteClick = (payment) => {
    setSelectedPayment(payment);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPayment) return;
    
    try {
      setIsDeleting(true);
      await paymentsApi.deletePayment(selectedPayment.id);
      setPayments(payments.filter(payment => payment.id !== selectedPayment.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Error deleting payment:', err);
      setError('Failed to delete payment. Please try again later.');
    } finally {
      setIsDeleting(false);
      setSelectedPayment(null);
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'paypal':
        return 'PayPal';
      case 'stripe':
        return 'Stripe';
      case 'braintree':
        return 'Braintree';
      case 'cash':
        return 'Cash';
      case 'check':
        return 'Check';
      case 'crypto':
        return 'Cryptocurrency';
      default:
        return method ? method.replace('_', ' ') : 'Other';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
        return (
          <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'bank_transfer':
        return (
          <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        );
      case 'paypal':
        return (
          <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.58 2.975-2.477 6.17-8.233 6.17h-2.19c-1.571 0-2.9 1.145-3.149 2.698L6.02 20.225l-.042.213h2.68a.641.641 0 0 0 .633-.74l.999-6.309c.076-.479.518-.822 1.036-.822h2.19c5.659 0 9.064-2.945 10.001-9.096.317-2.01-.012-3.366-.984-4.313l-.311.839z"/>
          </svg>
        );
      case 'stripe':
        return (
          <svg className="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.479 9.883c-1.918 0-3.318.98-3.318 2.429 0 2.352 3.094 1.962 3.094 2.972 0 .4-.348.667-1.059.667-.95 0-2.034-.307-2.923-.708l-.516 2.38c.886.365 1.984.634 3.275.634 2.09 0 3.474-.98 3.474-2.45 0-2.452-3.112-2.012-3.112-3.001 0-.329.307-.633.997-.633.809 0 1.74.204 2.49.55l.496-2.329c-.77-.307-1.78-.511-2.898-.511zM24 16c0 4.418-7.163 8-16 8S-8 20.418-8 16s7.163-8 16-8 16 3.582 16 8z"/>
          </svg>
        );
      case 'braintree':
        return (
          <svg className="h-5 w-5 text-teal-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.75 6.24c-.55 0-1.06.12-1.5.32v-4.4c0-.48-.37-1.04-.85-1.24-.48-.2-1.03-.03-1.37.36l-8.5 10.12c-.35.41-.35 1.03 0 1.44l8.5 10.12c.34.4.89.57 1.37.36.48-.2.85-.76.85-1.24v-4.4c.44.2.95.32 1.5.32 1.75 0 3.25-1.57 3.25-3.32V9.56c0-1.75-1.5-3.32-3.25-3.32z"/>
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
        <div className="mt-4 sm:mt-0">
          <Link href="/payments/create">
            <Button>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Record Payment
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center">
              <svg className="animate-spin h-10 w-10 mx-auto text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <p className="text-gray-600 dark:text-gray-400">Loading payments...</p>
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <svg className="h-10 w-10 mx-auto text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 dark:text-red-400 mb-2 font-semibold">{error}</p>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  paymentsApi.getPayments()
                    .then(response => {
                      setPayments(response.data);
                      setIsLoading(false);
                    })
                    .catch(err => {
                      console.error('Error fetching payments:', err);
                      setError('Failed to load payments. Please try again later.');
                      setIsLoading(false);
                    });
                }}
              >
                Try Again
              </Button>
            </div>
          ) : payments.length === 0 ? (
            <div className="py-10 text-center">
              <svg className="h-10 w-10 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 mb-4">No payments found.</p>
              <Link href="/payments/create">
                <Button size="sm">Record Your First Payment</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Invoice
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Client
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Method
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {payment.invoice ? payment.invoice.number : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{payment.client.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{payment.client.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          ${parseFloat(payment.amount).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getPaymentMethodIcon(payment.payment_method)}
                          <span className="ml-2 text-sm text-gray-900 dark:text-white">
                            {getPaymentMethodLabel(payment.payment_method)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(payment.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/payments/${payment.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          View
                        </Link>
                        <Link 
                          href={`/payments/${payment.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(payment)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Payment"
        message={`Are you sure you want to delete this payment of $${selectedPayment?.amount?.toFixed(2)}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}