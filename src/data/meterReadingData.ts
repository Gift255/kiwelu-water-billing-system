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
  photoUrl: string;
}

export const readings: MeterReading[] = [
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
    photoUrl: "/api/placeholder/100/80"
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
    photoUrl: "/api/placeholder/100/80"
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
    photoUrl: "/api/placeholder/100/80"
  }
];

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
  return "text-foreground";
};