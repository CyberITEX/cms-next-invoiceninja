'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ClientList from './components/ClientList';
import { clientsApi } from '@/lib/api';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const response = await clientsApi.getClients();
        setClients(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleDeleteClient = async (id) => {
    try {
      await clientsApi.deleteClient(id);
      setClients(clients.filter(client => client.id !== id));
    } catch (err) {
      console.error('Error deleting client:', err);
      setError('Failed to delete client. Please try again later.');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clients</h1>
        <div className="mt-4 sm:mt-0">
          <Link href="/clients/create">
            <Button>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Client
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center">
              <svg className="animate-spin h-10 w-10 mx-auto text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <p className="text-gray-600 dark:text-gray-400">Loading clients...</p>
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
                  clientsApi.getClients()
                    .then(response => {
                      setClients(response.data);
                      setIsLoading(false);
                    })
                    .catch(err => {
                      console.error('Error fetching clients:', err);
                      setError('Failed to load clients. Please try again later.');
                      setIsLoading(false);
                    });
                }}
              >
                Try Again
              </Button>
            </div>
          ) : clients.length === 0 ? (
            <div className="py-10 text-center">
              <svg className="h-10 w-10 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 mb-4">No clients found.</p>
              <Link href="/clients/create">
                <Button size="sm">Add Your First Client</Button>
              </Link>
            </div>
          ) : (
            <ClientList clients={clients} onDelete={handleDeleteClient} />
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}