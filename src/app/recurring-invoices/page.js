'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/ui/Modal';
import { recurringInvoicesApi } from '@/lib/api';

export default function RecurringInvoicesPage() {
  const [recurringInvoices, setRecurringInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchRecurringInvoices = async () => {
      try {
        setIsLoading(true);
        const response = await recurringInvoicesApi.getRecurringInvoices();
        setRecurringInvoices(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching recurring invoices:', err);
        setError('Failed to load recurring invoices. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecurringInvoices();
  }, []);

  const handleDeleteClick = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedInvoice) return;
    
    try {
      setIsDeleting(true);
      await recurringInvoicesApi.deleteRecurringInvoice(selectedInvoice.id);
      setRecurringInvoices(recurringInvoices.filter(invoice => invoice.id !== selectedInvoice.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Error deleting recurring invoice:', err);
      setError('Failed to delete recurring invoice. Please try again later.');
    } finally {
      setIsDeleting(false);
      setSelectedInvoice(null);
    }
  };

  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case 'WEEKLY':
        return 'Weekly';
      case 'TWO_WEEKS':
        return 'Every 2 Weeks';
      case 'FOUR_WEEKS':
        return 'Every 4 Weeks';
      case 'MONTHLY':
        return 'Monthly';
      case 'TWO_MONTHS':
        return 'Every 2 Months';
      case 'THREE_MONTHS':
        return 'Quarterly';
      case 'SIX_MONTHS':
        return 'Every 6 Months';
      case 'ANNUALLY':
        return 'Annually';
      case 'TWO_YEARS':
        return 'Every 2 Years';
      default:
        return 'Custom';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recurring Invoices</h1>
        <div className="mt-4 sm:mt-0">
          <Link href="/recurring-invoices/create">
            <Button>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Recurring Invoice
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recurring Invoice List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center">
              <svg className="animate-spin h-10 w-10 mx-auto text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <p className="text-gray-600 dark:text-gray-400">Loading recurring invoices...</p>
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
                  recurringInvoicesApi.getRecurringInvoices()
                    .then(response => {
                      setRecurringInvoices(response.data);
                      setIsLoading(false);
                    })
                    .catch(err => {
                      console.error('Error fetching recurring invoices:', err);
                      setError('Failed to load recurring invoices. Please try again later.');
                      setIsLoading(false);
                    });
                }}
              >
                Try Again
              </Button>
            </div>
          ) : recurringInvoices.length === 0 ? (
            <div className="py-10 text-center">
              <svg className="h-10 w-10 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 mb-4">No recurring invoices found.</p>
              <Link href="/recurring-invoices/create">
                <Button size="sm">Create Your First Recurring Invoice</Button>
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
                      Frequency
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Next Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Status
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
                  {recurringInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{invoice.client.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{invoice.client.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          ${parseFloat(invoice.amount).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {getFrequencyLabel(invoice.frequency)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {invoice.next_send_date ? new Date(invoice.next_send_date).toLocaleDateString() : 'Not scheduled'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/recurring-invoices/${invoice.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          View
                        </Link>
                        <Link 
                          href={`/recurring-invoices/${invoice.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(invoice)}
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
        title="Delete Recurring Invoice"
        message={`Are you sure you want to delete this recurring invoice for ${selectedInvoice?.client?.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}