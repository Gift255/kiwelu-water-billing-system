import { FileText, Download, Send, Eye, Printer } from "lucide-react";
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
import { useDataStore, useInvoices } from "@/hooks/useDataStore";
import { PaymentStatusDialog } from "@/components/payments/PaymentStatusDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

const Invoices = () => {
  const dataStore = useDataStore();
  const invoices = useInvoices();
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  
  const invoiceStats = dataStore.getInvoiceStats();
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
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPaymentStatus = selectedPaymentStatus === "all" || invoice.paymentStatus === selectedPaymentStatus;
    
    return matchesSearch && matchesPaymentStatus;
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

  const handleSendInvoice = (invoiceId: string, customerName: string) => {
    // In a real app, this would send the invoice via email/SMS
    toast.success(`Invoice sent to ${customerName}`);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // In a real app, this would generate and download a PDF
    toast.info(`Downloading invoice ${invoiceId}...`);
  };

  const handlePrintInvoice = (invoiceId: string) => {
    // In a real app, this would open print dialog
    toast.info(`Printing invoice ${invoiceId}...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoice Management</h1>
          <p className="text-muted-foreground">
            View, download, and manage customer invoices
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button className="bg-gradient-primary shadow-medium">
            <Send className="w-4 h-4 mr-2" />
            Send Reminders
          </Button>
        </div>
      </div>

      {/* Invoice Stats */}
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
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{invoiceStats.paid}</p>
                <p className="text-sm text-muted-foreground">Paid</p>
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

      {/* Invoice List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Invoice Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select>
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
            <Select>
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
    </div>
  );
};

export default Invoices;