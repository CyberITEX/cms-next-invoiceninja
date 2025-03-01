'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ClientCard({ client }) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-4">
            <div className="h-16 w-16 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-xl font-semibold">
              {client.name ? client.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{client.name}</h3>
              {client.company_name && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{client.company_name}</p>
              )}
            </div>
          </div>
          
          <div className="flex-grow space-y-3 mb-6">
            <div className="flex">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {client.email || 'No email provided'}
              </span>
            </div>
            
            <div className="flex">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {client.phone || 'No phone provided'}
              </span>
            </div>
            
            <div className="flex">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {client.address1 ? (
                  <>
                    {client.address1}
                    {client.address2 && <>, ${client.address2}</>}
                    {client.city && <>, ${client.city}</>}
                    {client.state && <>, ${client.state}</>}
                    {client.postal_code && <> ${client.postal_code}</>}
                    {client.country && <>, ${client.country}</>}
                  </>
                ) : (
                  'No address provided'
                )}
              </span>
            </div>
            
            <div className="mt-2">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                client.is_active
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {client.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href={`/clients/${client.id}`}>
              <Button variant="secondary" size="sm">View Details</Button>
            </Link>
            <Link href={`/clients/${client.id}/edit`}>
              <Button size="sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}