import { useState } from "react";
import { Plus, Upload, Camera, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock meter reading data
const readings = [
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

const MeterReadings: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  const filteredReadings = readings.filter(reading => {
    const matchesZone = !selectedZone || reading.zone === selectedZone;
    const matchesStatus = !selectedStatus || reading.status === selectedStatus;
    return matchesZone && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "validated":
        return <Badge className="bg-success/10 text-success">Validated</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning">Pending</Badge>;
      case "flagged":
        return <Badge className="bg-destructive/10 text-destructive">Flagged</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getConsumptionColor = (consumption: number) => {
    if (consumption < 0) return "text-destructive font-medium";
    if (consumption > 50) return "text-warning font-medium";
    return "text-foreground";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meter Readings</h1>
          <p className="text-muted-foreground">
            Record and manage monthly water meter readings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button className="bg-gradient-primary shadow-medium">
            <Plus className="w-4 h-4 mr-2" />
            Add Reading
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,156</p>
                <p className="text-sm text-muted-foreground">Readings Collected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,089</p>
                <p className="text-sm text-muted-foreground">Validated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">54</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">13</p>
                <p className="text-sm text-muted-foreground">Flagged</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Reading List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Meter Reading Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Billing Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">June 2025</SelectItem>
                <SelectItem value="previous">May 2025</SelectItem>
                <SelectItem value="april">April 2025</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Zones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Zones</SelectItem>
                <SelectItem value="Zone A">Zone A</SelectItem>
                <SelectItem value="Zone B">Zone B</SelectItem>
                <SelectItem value="Zone C">Zone C</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="validated">Validated</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Readings Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Meter ID</TableHead>
                  <TableHead>Previous</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Consumption</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Collector</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReadings.map((reading) => (
                  <TableRow key={reading.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reading.customerName}</div>
                        <div className="text-sm text-muted-foreground">{reading.customerId}</div>
                        <div className="text-xs text-muted-foreground">{reading.zone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{reading.meterId}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{reading.previousReading.toLocaleString()}</TableCell>
                    <TableCell className="font-mono font-medium">{reading.currentReading.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={getConsumptionColor(reading.consumption)}>
                        {reading.consumption > 0 ? '+' : ''}{reading.consumption} m³
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{reading.readingDate}</TableCell>
                    <TableCell className="text-sm">{reading.collector}</TableCell>
                    <TableCell>{getStatusBadge(reading.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Camera className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeterReadings;