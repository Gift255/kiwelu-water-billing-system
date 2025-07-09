import { DollarSign, CreditCard, Smartphone, Banknote, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { AddPaymentDialog } from "@/components/payments/AddPaymentDialog";
import { useDataStore, usePayments } from "@/hooks/useDataStore";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

const Payments = () => {
  const dataStore = useDataStore();
  const payments = usePayments();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  const paymentStats = dataStore.getPaymentStats();

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = selectedMethod === "all" || payment.method === selectedMethod;
    const matchesStatus = selectedStatus === "all" || payment.status === selectedStatus;
    
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="w-4 h-4" />;
      case "bank_transfer":
        return <CreditCard className="w-4 h-4" />;
      case "mobile_money":
        return <Smartphone className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "cash":
        return <Badge className="bg-success/10 text-success flex items-center gap-1">
          <Banknote className="w-3 h-3" /> Cash
        </Badge>;
      case "bank_transfer":
        return <Badge className="bg-info/10 text-info flex items-center gap-1">
          <CreditCard className="w-3 h-3" /> Bank Transfer
        </Badge>;
      case "mobile_money":
        return <Badge className="bg-warning/10 text-warning flex items-center gap-1">
          <Smartphone className="w-3 h-3" /> Mobile Money
        </Badge>;
      default:
        return <Badge variant="secondary">{method}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success/10 text-success">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning">Pending</Badge>;
      case "failed":
        return <Badge className="bg-destructive/10 text-destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleGenerateReceipt = (paymentId: string) => {
    // In a real app, this would generate and download a receipt
    toast.info(`Generating receipt for payment ${paymentId}...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
          <p className="text-muted-foreground">
            Track and manage customer payments across all channels
          </p>
        </div>
        <AddPaymentDialog />
      </div>

      {/* Payment Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">TZS {Math.round(paymentStats.totalAmount / 1000)}K</p>
                <p className="text-sm text-muted-foreground">Total Collected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Banknote className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">TZS {Math.round(paymentStats.cashAmount / 1000)}K</p>
                <p className="text-sm text-muted-foreground">Cash Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">TZS {Math.round(paymentStats.mobileMoneyAmount / 1000)}K</p>
                <p className="text-sm text-muted-foreground">Mobile Money</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">TZS {Math.round(paymentStats.bankTransferAmount / 1000)}K</p>
                <p className="text-sm text-muted-foreground">Bank Transfers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search payments by customer, reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Collector</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="font-mono text-sm">{payment.id}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.customerName}</div>
                        <div className="text-sm text-muted-foreground">{payment.customerId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">{payment.invoiceId}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">TZS {payment.amount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>{getMethodBadge(payment.method)}</TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">{payment.reference}</div>
                    </TableCell>
                    <TableCell className="text-sm">{payment.date}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-sm">{payment.collector}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleGenerateReceipt(payment.id)}
                        >
                          <Receipt className="w-4 h-4" />
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

export default Payments;