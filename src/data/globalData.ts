// Global data store for the water billing system
// In a real application, this would be replaced with a proper state management solution like Redux or Zustand

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  meterId: string;
  status: 'active' | 'suspended' | 'inactive';
  zone: string;
  balance: number;
  lastReading: string;
  gpsLocation: string;
  registrationDate: string;
  connectionType: 'residential' | 'commercial' | 'industrial';
}

export interface MeterReading {
  id: string;
  customerId: string;
  customerName: string;
  meterId: string;
  previousReading: number;
  currentReading: number;
  consumption: number;
  readingDate: string;
  collector: string;
  zone: string;
  status: 'validated' | 'pending' | 'flagged';
  photoUrl?: string;
  notes?: string;
  gpsLocation?: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  consumption: number;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'viewed';
  paymentStatus: 'pending' | 'paid' | 'overdue' | 'partial';
  billingPeriod: string;
  rateStructure: RateStructure[];
  baseCharge: number;
  taxes: number;
  totalAmount: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: 'cash' | 'bank_transfer' | 'mobile_money';
  reference: string;
  date: string;
  status: 'confirmed' | 'pending' | 'failed';
  collector: string;
  notes?: string;
}

export interface RateStructure {
  tier: string;
  minConsumption: number;
  maxConsumption: number;
  rate: number;
}

export interface SMSNotification {
  id: string;
  recipient: string;
  customerId: string;
  message: string;
  type: 'billing' | 'payment_confirmation' | 'reading_confirmation' | 'reminder' | 'custom';
  status: 'delivered' | 'pending' | 'failed';
  sentDate: string;
  cost: number;
}

// Global data store
class DataStore {
  private customers: Customer[] = [
    {
      id: "C001",
      name: "John Doe",
      phone: "+255 712 345 678",
      email: "john.doe@email.com",
      address: "Kimara, Dar es Salaam",
      meterId: "M001234",
      status: "active",
      zone: "Zone A",
      balance: -15000,
      lastReading: "2025-06-15",
      gpsLocation: "-6.7924,39.2083",
      registrationDate: "2024-01-15",
      connectionType: "residential"
    },
    {
      id: "C002", 
      name: "Sarah Johnson",
      phone: "+255 713 456 789",
      email: "sarah.j@email.com",
      address: "Mikocheni, Dar es Salaam",
      meterId: "M001235",
      status: "active",
      zone: "Zone B",
      balance: 5000,
      lastReading: "2025-06-14",
      gpsLocation: "-6.7751,39.2619",
      registrationDate: "2024-02-20",
      connectionType: "residential"
    },
    {
      id: "C003",
      name: "Michael Brown",
      phone: "+255 714 567 890",
      email: "mike.brown@email.com", 
      address: "Sinza, Dar es Salaam",
      meterId: "M001236",
      status: "suspended",
      zone: "Zone A",
      balance: -45000,
      lastReading: "2025-05-28",
      gpsLocation: "-6.7833,39.2500",
      registrationDate: "2023-11-10",
      connectionType: "residential"
    },
    {
      id: "C004",
      name: "Mary Wilson",
      phone: "+255 715 678 901",
      email: "mary.wilson@email.com",
      address: "Mbezi Beach, Dar es Salaam",
      meterId: "M001237",
      status: "active",
      zone: "Zone C",
      balance: -8500,
      lastReading: "2025-06-16",
      gpsLocation: "-6.8000,39.2700",
      registrationDate: "2024-03-05",
      connectionType: "residential"
    },
    {
      id: "C005",
      name: "David Chen",
      phone: "+255 716 789 012",
      email: "david.chen@email.com",
      address: "Masaki, Dar es Salaam",
      meterId: "M001238",
      status: "active",
      zone: "Zone B",
      balance: 12000,
      lastReading: "2025-06-17",
      gpsLocation: "-6.7600,39.2400",
      registrationDate: "2024-01-30",
      connectionType: "commercial"
    }
  ];

  private meterReadings: MeterReading[] = [
    {
      id: "R001",
      customerId: "C001",
      customerName: "John Doe",
      meterId: "M001234",
      previousReading: 1250,
      currentReading: 1275,
      consumption: 25,
      readingDate: "2025-06-15",
      collector: "Data Collector 1",
      zone: "Zone A",
      status: "validated",
      photoUrl: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=100&h=80",
      notes: "Normal reading, no issues",
      gpsLocation: "-6.7924,39.2083"
    },
    {
      id: "R002",
      customerId: "C002", 
      customerName: "Sarah Johnson",
      meterId: "M001235",
      previousReading: 980,
      currentReading: 1015,
      consumption: 35,
      readingDate: "2025-06-14",
      collector: "Data Collector 2",
      zone: "Zone B",
      status: "pending",
      photoUrl: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=100&h=80",
      notes: "Awaiting validation",
      gpsLocation: "-6.7751,39.2619"
    },
    {
      id: "R003",
      customerId: "C003",
      customerName: "Michael Brown",
      meterId: "M001236",
      previousReading: 1850,
      currentReading: 1820,
      consumption: -30,
      readingDate: "2025-06-13",
      collector: "Data Collector 1",
      zone: "Zone A",
      status: "flagged",
      photoUrl: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=100&h=80",
      notes: "Negative consumption - meter may be faulty",
      gpsLocation: "-6.7833,39.2500"
    },
    {
      id: "R004",
      customerId: "C004",
      customerName: "Mary Wilson",
      meterId: "M001237",
      previousReading: 2100,
      currentReading: 2145,
      consumption: 45,
      readingDate: "2025-06-16",
      collector: "Data Collector 3",
      zone: "Zone C",
      status: "validated",
      photoUrl: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=100&h=80",
      notes: "High consumption - customer notified",
      gpsLocation: "-6.8000,39.2700"
    },
    {
      id: "R005",
      customerId: "C005",
      customerName: "David Chen",
      meterId: "M001238",
      previousReading: 750,
      currentReading: 768,
      consumption: 18,
      readingDate: "2025-06-17",
      collector: "Data Collector 2",
      zone: "Zone B",
      status: "validated",
      photoUrl: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=100&h=80",
      notes: "Low consumption - normal for small household",
      gpsLocation: "-6.7600,39.2400"
    }
  ];

  private invoices: Invoice[] = [
    {
      id: "INV-2025-001234",
      customerId: "C001",
      customerName: "John Doe",
      amount: 22000,
      consumption: 25,
      issueDate: "2025-06-15",
      dueDate: "2025-07-15",
      status: "sent",
      paymentStatus: "pending",
      billingPeriod: "June 2025",
      rateStructure: [
        { tier: "0-10 m³", minConsumption: 0, maxConsumption: 10, rate: 800 },
        { tier: "11-20 m³", minConsumption: 11, maxConsumption: 20, rate: 1200 },
        { tier: "21-50 m³", minConsumption: 21, maxConsumption: 50, rate: 1800 }
      ],
      baseCharge: 2000,
      taxes: 2000,
      totalAmount: 22000
    },
    {
      id: "INV-2025-001235", 
      customerId: "C002",
      customerName: "Sarah Johnson",
      amount: 35000,
      consumption: 35,
      issueDate: "2025-06-14",
      dueDate: "2025-07-14",
      status: "sent",
      paymentStatus: "paid",
      billingPeriod: "June 2025",
      rateStructure: [
        { tier: "0-10 m³", minConsumption: 0, maxConsumption: 10, rate: 800 },
        { tier: "11-20 m³", minConsumption: 11, maxConsumption: 20, rate: 1200 },
        { tier: "21-50 m³", minConsumption: 21, maxConsumption: 50, rate: 1800 }
      ],
      baseCharge: 2000,
      taxes: 3000,
      totalAmount: 35000
    }
  ];

  private payments: Payment[] = [
    {
      id: "PAY-001234",
      invoiceId: "INV-2025-001235",
      customerId: "C002",
      customerName: "Sarah Johnson",
      amount: 35000,
      method: "mobile_money",
      reference: "MP25061412345",
      date: "2025-06-14",
      status: "confirmed",
      collector: "Accountant 1"
    },
    {
      id: "PAY-001235",
      invoiceId: "INV-2025-001234", 
      customerId: "C001",
      customerName: "John Doe",
      amount: 22000,
      method: "cash",
      reference: "CASH-25061501",
      date: "2025-06-15",
      status: "confirmed",
      collector: "Collector 2"
    }
  ];

  private smsNotifications: SMSNotification[] = [
    {
      id: "SMS-001234",
      recipient: "+255 712 345 678",
      customerId: "C001",
      message: "Your water bill for June 2025 is TZS 22,000. Due date: July 15, 2025.",
      type: "billing",
      status: "delivered",
      sentDate: "2025-06-15 14:30",
      cost: 150
    },
    {
      id: "SMS-001235",
      recipient: "+255 713 456 789",
      customerId: "C002",
      message: "Payment of TZS 35,000 received. Thank you for your payment.",
      type: "payment_confirmation",
      status: "delivered",
      sentDate: "2025-06-14 16:45",
      cost: 150
    }
  ];

  private rateStructure: RateStructure[] = [
    { tier: "0-10 m³", minConsumption: 0, maxConsumption: 10, rate: 800 },
    { tier: "11-20 m³", minConsumption: 11, maxConsumption: 20, rate: 1200 },
    { tier: "21-50 m³", minConsumption: 21, maxConsumption: 50, rate: 1800 },
    { tier: "50+ m³", minConsumption: 51, maxConsumption: Infinity, rate: 2500 }
  ];

  // Customer methods
  getCustomers(): Customer[] {
    return [...this.customers];
  }

  getCustomerById(id: string): Customer | undefined {
    return this.customers.find(c => c.id === id);
  }

  addCustomer(customer: Customer): void {
    this.customers.push(customer);
    this.notifyDataChange('customers');
  }

  updateCustomer(id: string, updates: Partial<Customer>): void {
    const index = this.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.customers[index] = { ...this.customers[index], ...updates };
      this.notifyDataChange('customers');
    }
  }

  deleteCustomer(id: string): void {
    this.customers = this.customers.filter(c => c.id !== id);
    this.notifyDataChange('customers');
  }

  // Meter reading methods
  getMeterReadings(): MeterReading[] {
    return [...this.meterReadings];
  }

  addMeterReading(reading: MeterReading): void {
    this.meterReadings.unshift(reading);
    // Update customer's last reading date
    this.updateCustomer(reading.customerId, { lastReading: reading.readingDate });
    this.notifyDataChange('meterReadings');
  }

  updateMeterReading(id: string, updates: Partial<MeterReading>): void {
    const index = this.meterReadings.findIndex(r => r.id === id);
    if (index !== -1) {
      this.meterReadings[index] = { ...this.meterReadings[index], ...updates };
      this.notifyDataChange('meterReadings');
    }
  }

  // Invoice methods
  getInvoices(): Invoice[] {
    return [...this.invoices];
  }

  generateInvoice(customerId: string, consumption: number): Invoice {
    const customer = this.getCustomerById(customerId);
    if (!customer) throw new Error('Customer not found');

    const invoiceId = `INV-2025-${String(this.invoices.length + 1).padStart(6, '0')}`;
    const amount = this.calculateBillAmount(consumption);
    const issueDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const invoice: Invoice = {
      id: invoiceId,
      customerId,
      customerName: customer.name,
      amount,
      consumption,
      issueDate,
      dueDate,
      status: 'draft',
      paymentStatus: 'pending',
      billingPeriod: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      rateStructure: this.rateStructure,
      baseCharge: 2000,
      taxes: Math.round(amount * 0.1),
      totalAmount: amount
    };

    this.invoices.push(invoice);
    this.notifyDataChange('invoices');
    return invoice;
  }

  updateInvoice(id: string, updates: Partial<Invoice>): void {
    const index = this.invoices.findIndex(i => i.id === id);
    if (index !== -1) {
      this.invoices[index] = { ...this.invoices[index], ...updates };
      this.notifyDataChange('invoices');
    }
  }

  // Payment methods
  getPayments(): Payment[] {
    return [...this.payments];
  }

  addPayment(payment: Payment): void {
    this.payments.unshift(payment);
    
    // Update invoice payment status
    const invoice = this.invoices.find(i => i.id === payment.invoiceId);
    if (invoice) {
      if (payment.amount >= invoice.totalAmount) {
        this.updateInvoice(invoice.id, { paymentStatus: 'paid' });
      } else {
        this.updateInvoice(invoice.id, { paymentStatus: 'partial' });
      }
    }

    // Update customer balance
    const customer = this.getCustomerById(payment.customerId);
    if (customer) {
      this.updateCustomer(customer.id, { 
        balance: customer.balance + payment.amount 
      });
    }

    this.notifyDataChange('payments');
  }

  // SMS methods
  getSMSNotifications(): SMSNotification[] {
    return [...this.smsNotifications];
  }

  sendSMS(notification: SMSNotification): void {
    this.smsNotifications.unshift(notification);
    this.notifyDataChange('smsNotifications');
  }

  // Utility methods
  calculateBillAmount(consumption: number): number {
    let amount = 2000; // Base charge
    let remainingConsumption = consumption;

    for (const tier of this.rateStructure) {
      if (remainingConsumption <= 0) break;
      
      const tierConsumption = Math.min(
        remainingConsumption, 
        tier.maxConsumption - tier.minConsumption + 1
      );
      
      amount += tierConsumption * tier.rate;
      remainingConsumption -= tierConsumption;
    }

    return Math.round(amount * 1.1); // Add 10% tax
  }

  getRateStructure(): RateStructure[] {
    return [...this.rateStructure];
  }

  updateRateStructure(rates: RateStructure[]): void {
    this.rateStructure = rates;
    this.notifyDataChange('rateStructure');
  }

  // Statistics methods
  getCustomerStats() {
    const total = this.customers.length;
    const active = this.customers.filter(c => c.status === 'active').length;
    const suspended = this.customers.filter(c => c.status === 'suspended').length;
    const inactive = this.customers.filter(c => c.status === 'inactive').length;
    
    return { total, active, suspended, inactive };
  }

  getReadingStats() {
    const total = this.meterReadings.length;
    const validated = this.meterReadings.filter(r => r.status === 'validated').length;
    const pending = this.meterReadings.filter(r => r.status === 'pending').length;
    const flagged = this.meterReadings.filter(r => r.status === 'flagged').length;
    
    return { total, validated, pending, flagged };
  }

  getInvoiceStats() {
    const total = this.invoices.length;
    const paid = this.invoices.filter(i => i.paymentStatus === 'paid').length;
    const pending = this.invoices.filter(i => i.paymentStatus === 'pending').length;
    const overdue = this.invoices.filter(i => {
      const dueDate = new Date(i.dueDate);
      return i.paymentStatus === 'pending' && dueDate < new Date();
    }).length;
    
    return { total, paid, pending, overdue };
  }

  getPaymentStats() {
    const totalAmount = this.payments
      .filter(p => p.status === 'confirmed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const cashAmount = this.payments
      .filter(p => p.method === 'cash' && p.status === 'confirmed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const mobileMoneyAmount = this.payments
      .filter(p => p.method === 'mobile_money' && p.status === 'confirmed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const bankTransferAmount = this.payments
      .filter(p => p.method === 'bank_transfer' && p.status === 'confirmed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    return { totalAmount, cashAmount, mobileMoneyAmount, bankTransferAmount };
  }

  // Event system for data changes
  private listeners: { [key: string]: (() => void)[] } = {};

  subscribe(event: string, callback: () => void): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  private notifyDataChange(event: string): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback());
    }
  }
}

// Export singleton instance
export const dataStore = new DataStore();

// Utility functions
export const getCustomerStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "suspended":
      return "destructive";
    case "inactive":
      return "muted";
    default:
      return "secondary";
  }
};

export const getBalanceColor = (balance: number) => {
  if (balance < 0) return "text-destructive font-medium";
  if (balance > 0) return "text-success font-medium";
  return "text-muted-foreground";
};

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "validated":
      return "success";
    case "pending":
      return "warning";
    case "flagged":
      return "destructive";
    default:
      return "secondary";
  }
};

export const getConsumptionColor = (consumption: number) => {
  if (consumption < 0) return "text-destructive font-medium";
  if (consumption > 50) return "text-warning font-medium";
  if (consumption === 0) return "text-muted-foreground";
  return "text-foreground";
};