import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { toast } from '@/components/ui/sonner';

// Generic hook for API data fetching
export function useApiData<T>(
  endpoint: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await endpoint();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// Specific hooks for different data types
export function useCustomers(filters?: { zone?: string; status?: string; search?: string }) {
  return useApiData(
    () => apiClient.getCustomers(filters),
    [filters?.zone, filters?.status, filters?.search]
  );
}

export function useCustomerStats() {
  return useApiData(() => apiClient.getCustomerStats());
}

export function useMeterReadings(filters?: { zone?: string; status?: string; period?: string }) {
  return useApiData(
    () => apiClient.getReadings(filters),
    [filters?.zone, filters?.status, filters?.period]
  );
}

export function useReadingStats() {
  return useApiData(() => apiClient.getReadingStats());
}

export function useInvoices(filters?: { status?: string; payment_status?: string; period?: string }) {
  return useApiData(
    () => apiClient.getInvoices(filters),
    [filters?.status, filters?.payment_status, filters?.period]
  );
}

export function useInvoiceStats() {
  return useApiData(() => apiClient.getInvoiceStats());
}

export function usePayments(filters?: { method?: string; status?: string; customer_id?: string }) {
  return useApiData(
    () => apiClient.getPayments(filters),
    [filters?.method, filters?.status, filters?.customer_id]
  );
}

export function usePaymentStats() {
  return useApiData(() => apiClient.getPaymentStats());
}

// Mutation hooks for data modification
export function useCustomerMutations() {
  const [loading, setLoading] = useState(false);

  const createCustomer = async (data: any) => {
    setLoading(true);
    try {
      const result = await apiClient.createCustomer(data);
      toast.success('Customer created successfully');
      return result;
    } catch (error) {
      toast.error('Failed to create customer');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (id: string, data: any) => {
    setLoading(true);
    try {
      const result = await apiClient.updateCustomer(id, data);
      toast.success('Customer updated successfully');
      return result;
    } catch (error) {
      toast.error('Failed to update customer');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    setLoading(true);
    try {
      await apiClient.deleteCustomer(id);
      toast.success('Customer deleted successfully');
    } catch (error) {
      toast.error('Failed to delete customer');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createCustomer, updateCustomer, deleteCustomer, loading };
}

export function useReadingMutations() {
  const [loading, setLoading] = useState(false);

  const createReading = async (data: any) => {
    setLoading(true);
    try {
      const result = await apiClient.createReading(data);
      toast.success('Reading added successfully');
      return result;
    } catch (error) {
      toast.error('Failed to add reading');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approveReading = async (id: string, data: { status: string; rejection_reason?: string }) => {
    setLoading(true);
    try {
      const result = await apiClient.approveReading(id, data);
      toast.success(`Reading ${data.status} successfully`);
      return result;
    } catch (error) {
      toast.error(`Failed to ${data.status} reading`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createReading, approveReading, loading };
}

export function useInvoiceMutations() {
  const [loading, setLoading] = useState(false);

  const generateInvoices = async (data: { zone_filter?: string }) => {
    setLoading(true);
    try {
      const result = await apiClient.generateInvoices(data);
      toast.success(`${result.count} invoices generated successfully`);
      return result;
    } catch (error) {
      toast.error('Failed to generate invoices');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceStatus = async (id: string, data: { payment_status: string }) => {
    setLoading(true);
    try {
      const result = await apiClient.updateInvoiceStatus(id, data);
      toast.success('Invoice status updated successfully');
      return result;
    } catch (error) {
      toast.error('Failed to update invoice status');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { generateInvoices, updateInvoiceStatus, loading };
}

export function usePaymentMutations() {
  const [loading, setLoading] = useState(false);

  const createPayment = async (data: any) => {
    setLoading(true);
    try {
      const result = await apiClient.createPayment(data);
      toast.success('Payment recorded successfully');
      return result;
    } catch (error) {
      toast.error('Failed to record payment');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createPayment, loading };
}