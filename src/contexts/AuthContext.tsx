import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'accountant' | 'meter_reader';
  phone?: string;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default users for demo
const defaultUsers: User[] = [
  {
    id: 'U001',
    name: 'Admin User',
    email: 'admin@kiwelu.com',
    role: 'admin',
    phone: '+255 712 000 001',
    createdAt: '2024-01-01',
    lastLogin: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 'U002',
    name: 'John Accountant',
    email: 'accountant@kiwelu.com',
    role: 'accountant',
    phone: '+255 712 000 002',
    createdAt: '2024-01-15',
    lastLogin: '2025-01-08',
    status: 'active'
  },
  {
    id: 'U003',
    name: 'Mary Reader',
    email: 'reader@kiwelu.com',
    role: 'meter_reader',
    phone: '+255 712 000 003',
    createdAt: '2024-02-01',
    lastLogin: '2025-01-07',
    status: 'active'
  }
];

// Demo credentials
const demoCredentials = {
  'admin@kiwelu.com': 'admin123',
  'accountant@kiwelu.com': 'account123',
  'reader@kiwelu.com': 'reader123'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(defaultUsers);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('kiwelu_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo authentication
    if (demoCredentials[email as keyof typeof demoCredentials] === password) {
      const foundUser = users.find(u => u.email === email);
      if (foundUser && foundUser.status === 'active') {
        const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
        setUser(updatedUser);
        localStorage.setItem('kiwelu_user', JSON.stringify(updatedUser));
        
        // Update user's last login
        setUsers(prev => prev.map(u => u.id === foundUser.id ? updatedUser : u));
        
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kiwelu_user');
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `U${String(users.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (user?.id === id) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('kiwelu_user', JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
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
      hasPermission
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