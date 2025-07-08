import { Calculator, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const Billing = () => {
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
        <Button className="bg-gradient-primary shadow-medium">
          <Calculator className="w-4 h-4 mr-2" />
          Generate Bills
        </Button>
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
                <p className="text-2xl font-bold">1,247</p>
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
                <p className="text-2xl font-bold">1,089</p>
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
                <p className="text-2xl font-bold">158</p>
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
                <p className="text-2xl font-bold">TZS 178M</p>
                <p className="text-sm text-muted-foreground">Total Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Progress */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>June 2025 Billing Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Bills Generated</span>
              <span className="font-medium">1,089 / 1,247 (87%)</span>
            </div>
            <Progress value={87} className="h-3" />
            <div className="text-xs text-muted-foreground">
              158 customers pending meter readings
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
              <TableRow>
                <TableCell>INV-2025-001234</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">John Doe</div>
                    <div className="text-sm text-muted-foreground">C001</div>
                  </div>
                </TableCell>
                <TableCell>25 m³</TableCell>
                <TableCell className="font-medium">TZS 22,000</TableCell>
                <TableCell>2025-07-15</TableCell>
                <TableCell>
                  <Badge className="bg-success/10 text-success">Generated</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>INV-2025-001235</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">C002</div>
                  </div>
                </TableCell>
                <TableCell>35 m³</TableCell>
                <TableCell className="font-medium">TZS 35,000</TableCell>
                <TableCell>2025-07-15</TableCell>
                <TableCell>
                  <Badge className="bg-success/10 text-success">Generated</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;