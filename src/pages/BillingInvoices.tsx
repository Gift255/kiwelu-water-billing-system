import { useState } from "react";
import { FileText, Download, Send, Eye, Printer, DollarSign, CreditCard, Smartphone, Banknote, Receipt, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useDataStore, useInvoices, usePayments } from "@/hooks/useDataStore";
import { PaymentStatusDialog } from "@/components/payments/PaymentStatusDialog";
import { AddPaymentDialog } from "@/components/payments/AddPaymentDialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

const BillingInvoices = () => {
  const dataStore = useDataStore();
  const invoices = useInvoices();
  const payments = usePayments();
  const { hasPermission } = useAuth();
  
  // Invoice filters
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  
  // Payment filters
  const [paymentSearchTerm, setPaymentSearchTerm] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  const invoiceStats = dataStore.getInvoiceStats();
  const paymentStats = dataStore.getPaymentStats();
  
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paidAmount = invoices
    .filter(inv => inv.paymentStatus === 'paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pendingAmount = invoices
    .filter(inv => inv.paymentStatus === 'pending')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  const overdueAmount = invoices
    .filter(inv => {
      const dueDate = new Date(inv.dueDate);
      return inv.paymentStatus === 'pending' && dueDate < new Date();
    })
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(invoiceSearchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(invoiceSearchTerm.toLowerCase()) ||
                         invoice.customerId.toLowerCase().includes(invoiceSearchTerm.toLowerCase());
    
    const matchesPaymentStatus = selectedPaymentStatus === "all" || invoice.paymentStatus === selectedPaymentStatus;
    
    return matchesSearch && matchesPaymentStatus;
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(paymentSearchTerm.toLowerCase());
    
    const matchesMethod = selectedMethod === "all" || payment.method === selectedMethod;
    const matchesStatus = selectedStatus === "all" || payment.status === selectedStatus;
    
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-muted text-muted-foreground">Draft</Badge>;
      case "sent":
        return <Badge className="bg-info/10 text-info">Sent</Badge>;
      case "viewed":
        return <Badge className="bg-warning/10 text-warning">Viewed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success/10 text-success">Paid</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-destructive/10 text-destructive">Overdue</Badge>;
      case "partial":
        return <Badge className="bg-info/10 text-info">Partial</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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

  const getPaymentStatusBadge = (status: string) => {
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

  const handleSendInvoice = (invoiceId: string, customerName: string) => {
    toast.success(`Invoice sent to ${customerName}`);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.info(`Downloading invoice ${invoiceId}...`);
  };

  const handlePrintInvoice = (invoiceId: string) => {
    toast.info(`Printing invoice ${invoiceId}...`);
  };

  const handleGenerateReceipt = (paymentId: string) => {
    toast.info(`Generating receipt for payment ${paymentId}...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Billing & Payments</h1>
          <p className="text-muted-foreground">
            Manage invoices and payment records in one place
          </p>
        </div>
        <div className="flex gap-2">
          <AddPaymentDialog />
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Combined Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{invoiceStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-xs text-muted-foreground">TZS {Math.round(totalAmount / 1000)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{invoiceStats.paid}</p>
                <p className="text-sm text-muted-foreground">Paid Invoices</p>
                <p className="text-xs text-muted-foreground">TZS {Math.round(paidAmount / 1000)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{invoiceStats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xs text-muted-foreground">TZS {Math.round(pendingAmount / 1000)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{invoiceStats.overdue}</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-xs text-muted-foreground">TZS {Math.round(overdueAmount / 1000)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Invoices and Payments */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                  placeholder="Search invoices..."
                  value={invoiceSearchTerm}
                  onChange={(e) => setInvoiceSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payment Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</SelectItem>
                    <SelectItem value="previous">Previous Month</SelectItem>
                    <SelectItem value="all">All Periods</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Consumption</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div className="font-mono text-sm">{invoice.id}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{invoice.customerName}</div>
                            <div className="text-sm text-muted-foreground">{invoice.customerId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">TZS {invoice.totalAmount.toLocaleString()}</div>
                        </TableCell>
                        <TableCell>{invoice.consumption} m³</TableCell>
                        <TableCell className="text-sm">{invoice.issueDate}</TableCell>
                        <TableCell className="text-sm">{invoice.dueDate}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>{getPaymentBadge(invoice.paymentStatus)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadInvoice(invoice.id)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSendInvoice(invoice.id, invoice.customerName)}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handlePrintInvoice(invoice.id)}
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                            {hasPermission('payments') && (
                              <PaymentStatusDialog invoice={invoice} />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Payment Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                  placeholder="Search payments by customer, reference..."
                  value={paymentSearchTerm}
                  onChange={(e) => setPaymentSearchTerm(e.target.value)}
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
                        <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingInvoices;