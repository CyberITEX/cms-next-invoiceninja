'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { clientsApi } from '@/lib/api';

export default function ClientForm({ client = {}, isEditMode = false }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [formData, setFormData] = useState({
    name: client.name || '',
    contact_name: client.contact_name || '',
    email: client.email || '',
    phone: client.phone || '',
    company_name: client.company_name || '',
    website: client.website || '',
    address1: client.address1 || '',
    address2: client.address2 || '',
    city: client.city || '',
    state: client.state || '',
    postal_code: client.postal_code || '',
    country: client.country || '',
    is_active: client.is_active !== undefined ? client.is_active : true,
    id_number: client.id_number || '',
    vat_number: client.vat_number || '',
    custom_value1: client.custom_value1 || '',
    custom_value2: client.custom_value2 || '',
    notes: client.notes || '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setFormError('Client name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setFormError('');
      
      if (isEditMode) {
        await clientsApi.updateClient(client.id, formData);
      } else {
        await clientsApi.createClient(formData);
      }
      
      router.push('/clients');
      router.refresh();
    } catch (error) {
      console.error('Error saving client:', error);
      setFormError(
        error.message || 'An error occurred while saving the client. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Client' : 'Create New Client'}</CardTitle>
        </CardHeader>
        
        <CardContent>
          {formError && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Client Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              placeholder="Enter client name"
              error={!formData.name && formError ? 'Client name is required' : ''}
            />
            
            <Input
              label="Contact Name"
              name="contact_name"
              value={formData.contact_name}
              onChange={handleChange}
              fullWidth
              placeholder="Enter contact name"
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              placeholder="Enter email address"
            />
            
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              placeholder="Enter phone number"
            />
            
            <Input
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              fullWidth
              placeholder="Enter company name"
            />
            
            <Input
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              fullWidth
              placeholder="Enter website URL"
            />
            
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Address Information</h3>
            </div>
            
            <Input
              label="Address Line 1"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              fullWidth
              placeholder="Enter street address"
            />
            
            <Input
              label="Address Line 2"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              fullWidth
              placeholder="Enter apartment, suite, etc."
            />
            
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
              placeholder="Enter city"
            />
            
            <Input
              label="State/Province"
              name="state"
              value={formData.state}
              onChange={handleChange}
              fullWidth
              placeholder="Enter state or province"
            />
            
            <Input
              label="Postal Code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              fullWidth
              placeholder="Enter postal code"
            />
            
            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              fullWidth
              placeholder="Enter country"
            />
            
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Additional Information</h3>
            </div>
            
            <Input
              label="ID Number"
              name="id_number"
              value={formData.id_number}
              onChange={handleChange}
              fullWidth
              placeholder="Enter ID number"
            />
            
            <Input
              label="VAT Number"
              name="vat_number"
              value={formData.vat_number}
              onChange={handleChange}
              fullWidth
              placeholder="Enter VAT number"
            />
            
            <Select
              label="Status"
              name="is_active"
              value={formData.is_active ? 'true' : 'false'}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  is_active: e.target.value === 'true'
                }));
              }}
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' }
              ]}
              fullWidth
            />
            
            <div className="col-span-1 md:col-span-2">
              <Input
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                fullWidth
                placeholder="Enter notes about this client"
                as="textarea"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/clients')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Client' : 'Create Client'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}