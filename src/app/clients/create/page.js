'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ClientForm from '../components/ClientForm';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function CreateClientPage() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Client</h1>
        <div className="mt-4 sm:mt-0">
          <Link href="/clients">
            <Button variant="secondary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Clients
            </Button>
          </Link>
        </div>
      </div>

      <ClientForm />
    </DashboardLayout>
  );
}