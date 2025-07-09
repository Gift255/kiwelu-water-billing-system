import { useState } from "react";
import { Plus, DollarSign, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dataStore, Payment } from "@/data/globalData";
import { useInvoices } from "@/hooks/useDataStore";
import { toast } from "@/components/ui/sonner";

export const AddPaymentDialog = () => {
  const invoices = useInvoices();
  const [open, setOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    method: "cash" as "cash" | "bank_transfer" | "mobile_money",
    reference: "",
    notes: "",
    collector: "Accountant 1"
  });

  const unpaidInvoices = invoices.filter(inv => 
    inv.paymentStatus === 'pending' || inv.paymentStatus === 'partial'
  );

  const filteredInvoices = unpaidInvoices.filter(invoice =>
    invoice.customerName.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
    invoice.id.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
    invoice.customerId.toLowerCase().includes(invoiceSearch.toLowerCase())
  );

  const generateReference = (method: string) => {
    const prefix = method === 'cash' ? 'CASH' : 
                  method === 'bank_transfer' ? 'BT' : 'MP';
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000);
    return `${prefix}${date}${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInvoice || !formData.amount) {
      toast.error("Please select an invoice and enter payment amount");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      toast.error("Payment amount must be greater than 0");
      return;
    }

    if (amount > selectedInvoice.totalAmount) {
      toast.error("Payment amount cannot exceed invoice amount");
      return;
    }

    const newPayment: Payment = {
      id: `PAY-${Date.now()}`,
      invoiceId: selectedInvoice.id,
      customerId: selectedInvoice.customerId,
      customerName: selectedInvoice.customerName,
      amount,
      method: formData.method,
      reference: formData.reference || generateReference(formData.method),
      date: new Date().toISOString().split('T')[0],
      status: "confirmed",
      collector: formData.collector,
      notes: formData.notes
    };

    dataStore.addPayment(newPayment);
    
    // Send payment confirmation SMS
    const customer = dataStore.getCustomerById(selectedInvoice.customerId);
    if (customer) {
      const smsNotification = {
        id: `SMS-${Date.now()}`,
        recipient: customer.phone,
        customerId: customer.id,
        message: `Payment of TZS ${amount.toLocaleString()} received for invoice ${selectedInvoice.id}. Thank you!`,
        type: 'payment_confirmation' as const,
        status: 'delivered' as const,
        sentDate: new Date().toISOString(),
        cost: 150
      };
      dataStore.sendSMS(smsNotification);
    }
    
    toast.success(`Payment of TZS ${amount.toLocaleString()} recorded successfully`);
    
    setOpen(false);
    setSelectedInvoice(null);
    setInvoiceSearch("");
    setFormData({
      amount: "",
      method: "cash",
      reference: "",
      notes: "",
      collector: "Accountant 1"
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary shadow-medium">
          <Plus className="w-4 h-4 mr-2" />
          Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Record Payment
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Search Invoice</Label>
            <Input
              placeholder="Search by customer name, invoice ID..."
              value={invoiceSearch}
              onChange={(e) => setInvoiceSearch(e.target.value)}
            />
            {invoiceSearch && (
              <div className="max-h-32 overflow-y-auto border rounded-md">
                {filteredInvoices.map(invoice => (
                  <div
                    key={invoice.id}
                    className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setInvoiceSearch("");
                      setFormData(prev => ({ ...prev, amount: invoice.totalAmount.toString() }));
                    }}
                  >
                    <div className="font-medium">{invoice.customerName}</div>
                    <div className="text-sm text-muted-foreground">
                      {invoice.id} • TZS {invoice.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Due: {invoice.dueDate}
                    </div>
                  </div>
                ))}
                {filteredInvoices.length === 0 && (
                  <div className="p-2 text-sm text-muted-foreground">
                    No unpaid invoices found
                  </div>
                )}
              </div>
            )}
            {selectedInvoice && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="font-medium">{selectedInvoice.customerName}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedInvoice.id} • {selectedInvoice.customerId}
                </div>
                <div className="text-sm">
                  <Badge variant="outline">Amount: TZS {selectedInvoice.totalAmount.toLocaleString()}</Badge>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount (TZS)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="22000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select value={formData.method} onValueChange={(value: any) => setFormData(prev => ({ ...prev, method: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference Number</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              placeholder={generateReference(formData.method)}
            />
            <div className="text-xs text-muted-foreground">
              Leave empty to auto-generate
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collector">Collected By</Label>
            <Select value={formData.collector} onValueChange={(value) => setFormData(prev => ({ ...prev, collector: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Accountant 1">Accountant 1</SelectItem>
                <SelectItem value="Accountant 2">Accountant 2</SelectItem>
                <SelectItem value="Collector 1">Collector 1</SelectItem>
                <SelectItem value="Collector 2">Collector 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes about this payment..."
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-primary">
              Record Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};