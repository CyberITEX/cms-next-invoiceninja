'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { clientsApi, invoicesApi, paymentsApi } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    clientCount: 0,
    invoiceCount: 0,
    totalOutstanding: 0,
    totalPaid: 0,
    isLoading: true,
    error: null
  });

  const [recentActivity, setRecentActivity] = useState({
    invoices: [],
    payments: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch summary data
        const [clientsResponse, invoicesResponse, paymentsResponse] = await Promise.all([
          clientsApi.getClients({ per_page: 1 }),
          invoicesApi.getInvoices({ per_page: 1 }),
          paymentsApi.getPayments({ per_page: 5 }),
        ]);

        // Get count information from responses
        const clientCount = clientsResponse.meta ? clientsResponse.meta.total : 0;
        const invoiceCount = invoicesResponse.meta ? invoicesResponse.meta.total : 0;
        
        // Get recent invoices
        const recentInvoicesResponse = await invoicesApi.getInvoices({ 
          per_page: 5,
          sort: 'date',
          sort_dir: 'desc'
        });

        // Calculate totals
        let totalOutstanding = 0;
        let totalPaid = 0;

        if (invoicesResponse.data && invoicesResponse.data.length > 0) {
          // You might need to make an additional API call to get full summary data
          // This is a placeholder calculation
          totalOutstanding = invoicesResponse.data
            .filter(invoice => invoice.status !== 'paid')
            .reduce((sum, invoice) => sum + parseFloat(invoice.balance), 0);
            
          totalPaid = paymentsResponse.data
            .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
        }

        // Update stats
        setStats({
          clientCount,
          invoiceCount,
          totalOutstanding,
          totalPaid,
          isLoading: false,
          error: null
        });

        // Update recent activity
        setRecentActivity({
          invoices: recentInvoicesResponse.data || [],
          payments: paymentsResponse.data || [],
          isLoading: false,
          error: null
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load dashboard statistics'
        }));
        
        setRecentActivity(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load recent activity'
        }));
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'viewed':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link href="/invoices/create">
            <Button>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mr-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</div>
                {stats.isLoading ? (
                  <div className="mt-1 h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{stats.clientCount}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mr-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Invoices</div>
                {stats.isLoading ? (
                  <div className="mt-1 h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{stats.invoiceCount}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 mr-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Outstanding</div>
                {stats.isLoading ? (
                  <div className="mt-1 h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(stats.totalOutstanding)}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 mr-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Received</div>
                {stats.isLoading ? (
                  <div className="mt-1 h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(stats.totalPaid)}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.error ? (
              <div className="py-6 text-center">
                <svg className="h-10 w-10 mx-auto text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 dark:text-red-400">{recentActivity.error}</p>
              </div>
            ) : recentActivity.invoices.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">No recent invoices found.</p>
                <Link href="/invoices/create" className="mt-4 inline-block">
                  <Button size="sm">Create Invoice</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.invoices.map((invoice) => (
                  <Link key={invoice.id} href={`/invoices/${invoice.id}`}>
                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Invoice #{invoice.number}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {invoice.client.name}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(invoice.status)}`}>
                              {invoice.status}
                            </span>
                            <p className="ml-4 text-sm font-medium text-gray-900 dark:text-white">
                              {formatCurrency(invoice.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.error ? (
              <div className="py-6 text-center">
                <svg className="h-10 w-10 mx-auto text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 dark:text-red-400">{recentActivity.error}</p>
              </div>
            ) : recentActivity.payments.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">No recent payments found.</p>
                <Link href="/payments/create" className="mt-4 inline-block">
                  <Button size="sm">Record Payment</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.payments.map((payment) => (
                  <Link key={payment.id} href={`/payments/${payment.id}`}>
                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {payment.client.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {payment.invoice ? `Invoice #${payment.invoice.number}` : 'General Payment'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatCurrency(payment.amount)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                              {new Date(payment.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <Link href="/clients/create">
              <CardContent className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mr-4">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Add New Client</div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a new client profile</div>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card>
            <Link href="/invoices/create">
              <CardContent className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mr-4">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Create Invoice</div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">Generate a new invoice</div>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card>
            <Link href="/payments/create">
              <CardContent className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 mr-4">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Record Payment</div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">Record a client payment</div>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}