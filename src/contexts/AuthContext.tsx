import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { toast } from '@/components/ui/sonner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'accountant' | 'meter_reader';
  phone?: string;
  created_at: string;
  last_login?: string;
  status: 'active' | 'inactive';
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (userData: Omit<User, 'id' | 'created_at'>) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and validate
    const token = localStorage.getItem('auth_token');
    if (token) {
      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
      
      // Load users if admin
      if (userData.role === 'admin') {
        loadUsers();
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      apiClient.clearToken();
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await apiClient.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login(email, password);
      setUser(response.user);
      
      // Load users if admin
      if (response.user.role === 'admin') {
        await loadUsers();
      }
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setUsers([]);
    }
  };

  const addUser = async (userData: Omit<User, 'id' | 'created_at'>) => {
    try {
      const newUser = await apiClient.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      toast.success(`User ${userData.name} created successfully`);
    } catch (error) {
      console.error('Failed to create user:', error);
      toast.error('Failed to create user');
      throw error;
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      const updatedUser = await apiClient.updateUser(id, updates);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      
      // Update current user if editing self
      if (user?.id === id) {
        setUser(updatedUser);
      }
      
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiClient.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const permissions = {
      admin: ['all'],
      accountant: ['billing', 'payments', 'invoices', 'reports', 'customers_view', 'approve_readings'],
      meter_reader: ['readings', 'customers_view']
    };
    
    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes('all') || userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      login,
      logout,
      addUser,
      updateUser,
      deleteUser,
      isAuthenticated: !!user,
      hasPermission,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};