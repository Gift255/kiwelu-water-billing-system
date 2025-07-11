import { useState } from "react";
import { CheckCircle, XCircle, User, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { dataStore, MeterReading } from "@/data/globalData";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface MeterReadingApprovalDialogProps {
  reading: MeterReading;
  onUpdate?: () => void;
}

export const MeterReadingApprovalDialog: React.FC<MeterReadingApprovalDialogProps> = ({ 
  reading, 
  onUpdate 
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = () => {
    if (!user) return;

    dataStore.updateMeterReading(reading.id, {
      status: 'approved',
      approvedBy: user.name,
      approvedDate: new Date().toISOString().split('T')[0]
    });

    // Send SMS notification to meter reader
    const smsNotification = {
      id: `SMS-${Date.now()}`,
      recipient: "+255 712 000 003", // Meter reader phone
      customerId: reading.customerId,
      message: `Your meter reading for ${reading.customerName} (${reading.currentReading} m³) has been approved by ${user.name}.`,
      type: 'reading_confirmation' as const,
      status: 'delivered' as const,
      sentDate: new Date().toISOString(),
      cost: 150
    };
    dataStore.sendSMS(smsNotification);

    toast.success(`Reading approved for ${reading.customerName}`);
    setOpen(false);
    if (onUpdate) onUpdate();
  };

  const handleReject = () => {
    if (!user || !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    dataStore.updateMeterReading(reading.id, {
      status: 'rejected',
      approvedBy: user.name,
      approvedDate: new Date().toISOString().split('T')[0],
      rejectionReason: rejectionReason.trim()
    });

    // Send SMS notification to meter reader
    const smsNotification = {
      id: `SMS-${Date.now()}`,
      recipient: "+255 712 000 003", // Meter reader phone
      customerId: reading.customerId,
      message: `Your meter reading for ${reading.customerName} has been rejected by ${user.name}. Reason: ${rejectionReason.trim()}`,
      type: 'reading_confirmation' as const,
      status: 'delivered' as const,
      sentDate: new Date().toISOString(),
      cost: 150
    };
    dataStore.sendSMS(smsNotification);

    toast.success(`Reading rejected for ${reading.customerName}`);
    setOpen(false);
    setRejectionReason("");
    if (onUpdate) onUpdate();
  };

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Review Reading">
          <User className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Review Meter Reading
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Reading Details */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Customer:</span>
                <span className="text-sm">{reading.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Meter ID:</span>
                <span className="text-sm font-mono">{reading.meterId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Previous Reading:</span>
                <span className="text-sm">{reading.previousReading} m³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Current Reading:</span>
                <span className="text-sm font-semibold">{reading.currentReading} m³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Consumption:</span>
                <span className="text-sm font-semibold">{reading.consumption} m³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Collector:</span>
                <span className="text-sm">{reading.collector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Date:</span>
                <span className="text-sm">{reading.readingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Status:</span>
                {getStatusBadge(reading.status)}
              </div>
              {reading.notes && (
                <div className="pt-2">
                  <span className="text-sm font-medium">Notes:</span>
                  <p className="text-sm text-muted-foreground mt-1">{reading.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Photo Preview */}
          {reading.photoUrl && (
            <div className="space-y-2">
              <Label>Meter Photo</Label>
              <img 
                src={reading.photoUrl} 
                alt="Meter reading" 
                className="w-full rounded-lg border"
              />
            </div>
          )}

          {/* Approval Actions */}
          {reading.status === 'pending' && (
            <div className="space-y-4">
              {action === 'reject' && (
                <div className="space-y-2">
                  <Label htmlFor="rejectionReason">Reason for Rejection</Label>
                  <Textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejecting this reading..."
                    rows={3}
                    required
                  />
                </div>
              )}

              <div className="flex gap-2">
                {action === null && (
                  <>
                    <Button 
                      onClick={() => setAction('approve')}
                      className="flex-1 bg-success hover:bg-success/90"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      onClick={() => setAction('reject')}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}

                {action === 'approve' && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => setAction(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleApprove}
                      className="flex-1 bg-success hover:bg-success/90"
                    >
                      Confirm Approval
                    </Button>
                  </>
                )}

                {action === 'reject' && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setAction(null);
                        setRejectionReason("");
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleReject}
                      variant="destructive"
                      className="flex-1"
                      disabled={!rejectionReason.trim()}
                    >
                      Confirm Rejection
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Already Processed */}
          {reading.status !== 'pending' && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                {reading.status === 'approved' ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : reading.status === 'rejected' ? (
                  <XCircle className="w-4 h-4 text-destructive" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-warning" />
                )}
                <span>
                  This reading has been {reading.status}
                  {reading.approvedBy && ` by ${reading.approvedBy}`}
                  {reading.approvedDate && ` on ${reading.approvedDate}`}
                </span>
              </div>
              {reading.rejectionReason && (
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Reason:</strong> {reading.rejectionReason}
                </p>
              )}
            </div>
          )}

          {reading.status === 'pending' && action === null && (
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)} 
              className="w-full"
            >
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};