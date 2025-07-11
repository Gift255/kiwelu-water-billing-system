import { useState } from 'react';
import { Edit, DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dataStore, Invoice } from '@/data/globalData';
import { toast } from '@/components/ui/sonner';

interface PaymentStatusDialogProps {
  invoice: Invoice;
  onUpdate?: () => void;
}

export const PaymentStatusDialog: React.FC<PaymentStatusDialogProps> = ({ invoice, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    paymentStatus: invoice.paymentStatus,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    dataStore.updateInvoice(invoice.id, {
      paymentStatus: formData.paymentStatus as any
    });

    // Send SMS notification if status changed to paid
    if (formData.paymentStatus === 'paid' && invoice.paymentStatus !== 'paid') {
      const customer = dataStore.getCustomerById(invoice.customerId);
      if (customer) {
        const smsNotification = {
          id: `SMS-${Date.now()}`,
          recipient: customer.phone,
          customerId: customer.id,
          message: `Payment confirmed for invoice ${invoice.id}. Amount: TZS ${invoice.totalAmount.toLocaleString()}. Thank you!`,
          type: 'payment_confirmation' as const,
          status: 'delivered' as const,
          sentDate: new Date().toISOString(),
          cost: 150
        };
        dataStore.sendSMS(smsNotification);
      }
    }
    
    toast.success(`Invoice ${invoice.id} status updated to ${formData.paymentStatus}`);
    setOpen(false);
    if (onUpdate) onUpdate();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-success/10 text-success">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-warning/10 text-warning">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-destructive/10 text-destructive">Overdue</Badge>;
      case 'partial':
        return <Badge className="bg-info/10 text-info">Partial</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Update Payment Status">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Update Payment Status
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Invoice Details */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Invoice:</span>
                <span className="text-sm font-mono">{invoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Customer:</span>
                <span className="text-sm">{invoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Amount:</span>
                <span className="text-sm font-semibold">TZS {invoice.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Current Status:</span>
                {getStatusBadge(invoice.paymentStatus)}
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Due Date:</span>
                <span className="text-sm">{invoice.dueDate}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select 
                value={formData.paymentStatus} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, paymentStatus: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-warning" />
                      Pending
                    </div>
                  </SelectItem>
                  <SelectItem value="paid">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      Paid
                    </div>
                  </SelectItem>
                  <SelectItem value="partial">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-info" />
                      Partial Payment
                    </div>
                  </SelectItem>
                  <SelectItem value="overdue">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      Overdue
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes about this status change..."
                rows={3}
              />
            </div>

            {formData.paymentStatus === 'paid' && invoice.paymentStatus !== 'paid' && (
              <div className="p-3 bg-success/10 rounded-lg">
                <div className="flex items-center gap-2 text-success text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Payment confirmation SMS will be sent to customer
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-primary">
                Update Status
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};