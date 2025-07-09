import { FileText, AlertCircle, CheckCircle, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { GenerateBillsDialog } from "@/components/billing/GenerateBillsDialog";
import { useDataStore, useInvoices, useMeterReadings } from "@/hooks/useDataStore";

const Billing = () => {
  const dataStore = useDataStore();
  const invoices = useInvoices();
  const readings = useMeterReadings();
  
  const invoiceStats = dataStore.getInvoiceStats();
  const readingStats = dataStore.getReadingStats();
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Billing Management</h1>
          <p className="text-muted-foreground">
            Generate and manage monthly water bills for customers
          </p>
        </div>
        <GenerateBillsDialog />
      </div>

      {/* Billing Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{invoiceStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Bills</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{invoiceStats.paid}</p>
                <p className="text-sm text-muted-foreground">Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{invoiceStats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">TZS {Math.round(totalAmount / 1000)}K</p>
                <p className="text-sm text-muted-foreground">Total Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Progress */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Billing Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Bills Generated</span>
              <span className="font-medium">
                {invoiceStats.total} / {readingStats.validated} 
                ({readingStats.validated > 0 ? Math.round((invoiceStats.total / readingStats.validated) * 100) : 0}%)
              </span>
            </div>
            <Progress 
              value={readingStats.validated > 0 ? (invoiceStats.total / readingStats.validated) * 100 : 0} 
              className="h-3" 
            />
            <div className="text-xs text-muted-foreground">
              {readingStats.pending} readings pending validation
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Rate Structure */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Current Rate Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Tiered billing rates effective from April 2025
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Consumption Tier</TableHead>
                  <TableHead>Rate per m³</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>0 - 10 m³</TableCell>
                  <TableCell className="font-medium">TZS 800</TableCell>
                  <TableCell>Basic household consumption</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>11 - 20 m³</TableCell>
                  <TableCell className="font-medium">TZS 1,200</TableCell>
                  <TableCell>Standard household consumption</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>21 - 50 m³</TableCell>
                  <TableCell className="font-medium">TZS 1,800</TableCell>
                  <TableCell>High household consumption</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>50+ m³</TableCell>
                  <TableCell className="font-medium">TZS 2,500</TableCell>
                  <TableCell>Commercial/Industrial rate</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bills Generated */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Recently Generated Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Consumption</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.slice(0, 5).map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.customerName}</div>
                      <div className="text-sm text-muted-foreground">{invoice.customerId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.consumption} m³</TableCell>
                  <TableCell className="font-medium">TZS {invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>
                    <Badge className="bg-success/10 text-success">
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;