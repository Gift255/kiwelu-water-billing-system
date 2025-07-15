// API client for backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me');
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
  }

  // Customer endpoints
  async getCustomers(params?: { zone?: string; status?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/customers${query ? `?${query}` : ''}`);
  }

  async getCustomer(id: string) {
    return this.request<any>(`/customers/${id}`);
  }

  async createCustomer(data: any) {
    return this.request<any>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(id: string, data: any) {
    return this.request<any>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomer(id: string) {
    return this.request<any>(`/customers/${id}`, { method: 'DELETE' });
  }

  async getCustomerStats() {
    return this.request<any>('/customers/stats/summary');
  }

  // Meter readings endpoints
  async getReadings(params?: { zone?: string; status?: string; period?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/readings${query ? `?${query}` : ''}`);
  }

  async createReading(data: any) {
    return this.request<any>('/readings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async approveReading(id: string, data: { status: string; rejection_reason?: string }) {
    return this.request<any>(`/readings/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getReadingStats() {
    return this.request<any>('/readings/stats/summary');
  }

  // Invoice endpoints
  async getInvoices(params?: { status?: string; payment_status?: string; period?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/invoices${query ? `?${query}` : ''}`);
  }

  async generateInvoices(data: { zone_filter?: string }) {
    return this.request<any>('/invoices/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInvoiceStatus(id: string, data: { payment_status: string }) {
    return this.request<any>(`/invoices/${id}/payment-status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getInvoiceStats() {
    return this.request<any>('/invoices/stats/summary');
  }

  // Payment endpoints
  async getPayments(params?: { method?: string; status?: string; customer_id?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/payments${query ? `?${query}` : ''}`);
  }

  async createPayment(data: any) {
    return this.request<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPaymentStats() {
    return this.request<any>('/payments/stats/summary');
  }

  // User endpoints
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async createUser(data: any) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request<any>(`/users/${id}`, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();