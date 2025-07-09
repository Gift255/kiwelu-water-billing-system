import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { MeterReading, getStatusBadgeVariant, getConsumptionColor } from "@/data/meterReadingData";

interface MeterReadingTableProps {
  readings: MeterReading[];
}

export const MeterReadingTable: React.FC<MeterReadingTableProps> = ({ readings }) => {
  const getStatusBadge = (status: string) => {
    const variant = getStatusBadgeVariant(status);
    const variantClasses = {
      success: "bg-success/10 text-success",
      warning: "bg-warning/10 text-warning",
      destructive: "bg-destructive/10 text-destructive",
      secondary: ""
    };
    
    if (variant === "secondary") {
      return <Badge variant="secondary">{status}</Badge>;
    }
    
    return <Badge className={variantClasses[variant as keyof typeof variantClasses]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
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
          {readings.map((reading) => (
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
  );
};