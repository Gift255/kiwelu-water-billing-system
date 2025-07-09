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

export const filterReadings = (
  readings: MeterReading[],
  selectedZone: string,
  selectedStatus: string,
  selectedPeriod: string
) => {
  return readings.filter(reading => {
    const matchesZone = selectedZone === "all" || !selectedZone || reading.zone === selectedZone;
    const matchesStatus = selectedStatus === "all" || !selectedStatus || reading.status === selectedStatus;
    // For period filtering, you could add date range logic here
    return matchesZone && matchesStatus;
  });
};

export const calculateReadingStats = (readings: MeterReading[]) => {
  const total = readings.length;
  const validated = readings.filter(r => r.status === 'validated').length;
  const pending = readings.filter(r => r.status === 'pending').length;
  const flagged = readings.filter(r => r.status === 'flagged').length;
  
  return { total, validated, pending, flagged };
};