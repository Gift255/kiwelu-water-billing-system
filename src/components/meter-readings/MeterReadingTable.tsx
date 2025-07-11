import { Camera, MapPin, Eye, Edit, CheckCircle, AlertTriangle } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MeterReading, getConsumptionColor } from "@/data/meterReadingData";
import { MeterReadingApprovalDialog } from "./MeterReadingApprovalDialog";
import { useAuth } from "@/contexts/AuthContext";

interface MeterReadingTableProps {
  readings: MeterReading[];
}

export const MeterReadingTable: React.FC<MeterReadingTableProps> = ({ readings }) => {
  const { hasPermission } = useAuth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success/10 text-success">Approved</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning">Pending Approval</Badge>;
      case "rejected":
        return <Badge className="bg-destructive/10 text-destructive">Rejected</Badge>;
      case "flagged":
        return <Badge className="bg-destructive/10 text-destructive">Flagged</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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
                <div className="flex items-center gap-1">
                  {/* Photo Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" title="View Photo">
                        <Camera className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Meter Reading Photo</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <img 
                          src={reading.photoUrl} 
                          alt="Meter reading" 
                          className="w-full rounded-lg"
                        />
                        <div className="text-sm space-y-2">
                          <p><strong>Reading:</strong> {reading.currentReading} m³</p>
                          <p><strong>Date:</strong> {reading.readingDate}</p>
                          <p><strong>Collector:</strong> {reading.collector}</p>
                          {reading.notes && <p><strong>Notes:</strong> {reading.notes}</p>}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* GPS Location */}
                  {reading.gpsLocation && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      title="View Location"
                      onClick={() => window.open(`https://maps.google.com/?q=${reading.gpsLocation}`, '_blank')}
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Approval Actions - Only for Admin/Accountant */}
                  {(hasPermission('billing') || hasPermission('all')) && reading.status === 'pending' && (
                    <MeterReadingApprovalDialog reading={reading} />
                  )}

                  {/* Edit only for meter readers on their own readings */}
                  {hasPermission('readings') && reading.status === 'pending' && (
                    <Button variant="ghost" size="sm" title="Edit Reading">
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};