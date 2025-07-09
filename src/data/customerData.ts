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
}

export const customers: Customer[] = [
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
    gpsLocation: "https://maps.google.com/?q=-6.7924,39.2083"
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
    gpsLocation: "https://maps.google.com/?q=-6.7751,39.2619"
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
    gpsLocation: "https://maps.google.com/?q=-6.7833,39.2500"
  }
];

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

export const filterCustomers = (
  customers: Customer[], 
  searchTerm: string, 
  selectedZone: string, 
  selectedStatus: string
) => {
  return customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.meterId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesZone = !selectedZone || selectedZone === "all" || customer.zone === selectedZone;
    const matchesStatus = !selectedStatus || selectedStatus === "all" || customer.status === selectedStatus;
    
    return matchesSearch && matchesZone && matchesStatus;
  });
};
