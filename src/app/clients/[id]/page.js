'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/ui/Modal';
import { clientsApi } from '@/lib/api';

export default function ClientDetailPage({ params }) {
  const router = useRouter();
  // const { id } = params;

  // Unwrap the params using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true);
        const response = await clientsApi.getClient(id);
        setClient(response.data);
      } catch (err) {
        console.error('Error fetching client:', err);
        setError('Failed to load client details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await clientsApi.deleteClient(id);
      router.push('/clients');
    } catch (err) {
      console.error('Error deleting client:', err);
      setError('Failed to delete client.');
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400">Loading client details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !client) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <svg className="h-12 w-12 text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg text-red-600 dark:text-red-400 mb-4">{error || 'Client not found.'}</p>
          <Button onClick={() => router.push('/clients')}>Back to Clients</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Client Details</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link href="/clients">
            <Button variant="secondary">
              Back to Clients
            </Button>
          </Link>
          <Link href={`/clients/${id}/edit`}>
            <Button>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Client
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{client.name}</h3>
                {client.company_name && (
                  <p className="text-gray-600 dark:text-gray-400">{client.company_name}</p>
                )}
                <div className="mt-2">
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    client.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {client.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Information</p>
                  <div className="mt-2 space-y-2">
                    {client.contact_name && (
                      <div className="flex">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{client.contact_name}</span>
                      </div>
                    )}
                    {client.email && (
                      <div className="flex">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{client.phone}</span>
                      </div>
                    )}
                    {client.website && (
                      <div className="flex">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <a 
                          href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {client.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="danger"
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Client
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(client.address1 || client.city || client.state || client.postal_code || client.country) ? (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Primary Address</p>
                      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        {client.address1 && <p>{client.address1}</p>}
                        {client.address2 && <p>{client.address2}</p>}
                        <p>
                          {client.city && `${client.city}, `}
                          {client.state && `${client.state} `}
                          {client.postal_code && client.postal_code}
                        </p>
                        {client.country && <p>{client.country}</p>}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">No address information provided.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ID Number</p>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {client.id_number || 'None'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">VAT Number</p>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {client.vat_number || 'None'}
                    </p>
                  </div>
                  {client.custom_value1 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Custom Field 1</p>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{client.custom_value1}</p>
                    </div>
                  )}
                  {client.custom_value2 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Custom Field 2</p>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{client.custom_value2}</p>
                    </div>
                  )}
                </div>

                {client.notes && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</p>
                    <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{client.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Client Activity</CardTitle>
                <Link href={`/invoices/create?client_id=${id}`}>
                  <Button size="sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Create Invoice
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <svg className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400">No invoices found for this client.</p>
                  <div className="mt-4">
                    <Link href={`/invoices/create?client_id=${id}`}>
                      <Button>Create First Invoice</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Client"
        message={`Are you sure you want to delete ${client.name}? This action cannot be undone and will remove all data associated with this client.`}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}