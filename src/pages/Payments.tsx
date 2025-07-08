import { DollarSign, Plus, CreditCard, Smartphone, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const payments = [
  {
    id: "PAY-001234",
    invoiceId: "INV-2025-001235",
    customerId: "C002",
    customerName: "Sarah Johnson",
    amount: 35000,
    method: "mobile_money",
    reference: "MP25061412345",
    date: "2025-06-14",
    status: "confirmed",
    collector: "Accountant 1"
  },
  {
    id: "PAY-001235",
    invoiceId: "INV-2025-001234", 
    customerId: "C001",
    customerName: "John Doe",
    amount: 22000,
    method: "cash",
    reference: "CASH-25061501",
    date: "2025-06-15",
    status: "confirmed",
    collector: "Collector 2"
  },
  {
    id: "PAY-001236",
    invoiceId: "INV-2025-001236",
    customerId: "C003",
    customerName: "Michael Brown",
    amount: 20000,
    method: "bank_transfer",
    reference: "BT25061398765",
    date: "2025-06-13",
    status: "pending",
    collector: "Accountant 1"
  }
];

const Payments = () => {
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
        <Button className="bg-gradient-primary shadow-medium">
          <Plus className="w-4 h-4 mr-2" />
          Record Payment
        </Button>
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
                <p className="text-2xl font-bold">TZS 158M</p>
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
                <p className="text-2xl font-bold">TZS 89M</p>
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
                <p className="text-2xl font-bold">TZS 54M</p>
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
                <p className="text-2xl font-bold">TZS 15M</p>
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
              className="flex-1"
            />
            <Select>
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
            <Select>
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
                {payments.map((payment) => (
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
                        <Button variant="ghost" size="sm">
                          Receipt
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