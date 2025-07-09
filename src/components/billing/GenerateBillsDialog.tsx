import { useState } from "react";
import { Calculator, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import { Badge } from "@/components/ui/badge";
import { dataStore } from "@/data/globalData";
import { useCustomers, useMeterReadings } from "@/hooks/useDataStore";
import { toast } from "@/components/ui/sonner";

export const GenerateBillsDialog = () => {
  const customers = useCustomers();
  const readings = useMeterReadings();
  const [open, setOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const getValidatedReadings = () => {
    return readings.filter(r => r.status === 'validated');
  };

  const getCustomersWithReadings = () => {
    const validatedReadings = getValidatedReadings();
    const customersWithReadings = customers.filter(customer => 
      validatedReadings.some(reading => reading.customerId === customer.id) &&
      (selectedZone === "all" || customer.zone === selectedZone)
    );
    return customersWithReadings;
  };

  const handleGenerateBills = async () => {
    setGenerating(true);
    setProgress(0);
    
    const customersToProcess = getCustomersWithReadings();
    const validatedReadings = getValidatedReadings();
    const errors: string[] = [];
    let successful = 0;

    // Simulate bill generation process
    for (let i = 0; i < customersToProcess.length; i++) {
      const customer = customersToProcess[i];
      const customerReading = validatedReadings.find(r => r.customerId === customer.id);
      
      if (customerReading) {
        try {
          // Generate invoice for this customer
          const invoice = dataStore.generateInvoice(customer.id, customerReading.consumption);
          dataStore.updateInvoice(invoice.id, { status: 'sent' });
          
          // Send SMS notification
          const smsNotification = {
            id: `SMS-${Date.now()}-${i}`,
            recipient: customer.phone,
            customerId: customer.id,
            message: `Your water bill for ${invoice.billingPeriod} is TZS ${invoice.totalAmount.toLocaleString()}. Due date: ${invoice.dueDate}.`,
            type: 'billing' as const,
            status: 'delivered' as const,
            sentDate: new Date().toISOString(),
            cost: 150
          };
          dataStore.sendSMS(smsNotification);
          
          successful++;
        } catch (error) {
          errors.push(`${customer.name}: Failed to generate bill`);
        }
      } else {
        errors.push(`${customer.name}: No validated reading found`);
      }
      
      setProgress(((i + 1) / customersToProcess.length) * 100);
      
      // Add delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setResults({
      total: customersToProcess.length,
      successful,
      failed: customersToProcess.length - successful,
      errors
    });
    
    setGenerating(false);
    
    if (successful > 0) {
      toast.success(`Successfully generated ${successful} bills`);
    }
  };

  const handleConfirm = () => {
    setOpen(false);
    setResults(null);
    setProgress(0);
    setSelectedZone("all");
  };

  const customersWithReadings = getCustomersWithReadings();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary shadow-medium">
          <Calculator className="w-4 h-4 mr-2" />
          Generate Bills
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Generate Monthly Bills
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!results && (
            <>
              <div className="space-y-2">
                <Label>Select Zone</Label>
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    <SelectItem value="Zone A">Zone A</SelectItem>
                    <SelectItem value="Zone B">Zone B</SelectItem>
                    <SelectItem value="Zone C">Zone C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-2">Bill Generation Summary:</div>
                <div className="space-y-1 text-sm">
                  <div>Customers with validated readings: {customersWithReadings.length}</div>
                  <div>Billing period: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                  <div>Estimated SMS cost: TZS {(customersWithReadings.length * 150).toLocaleString()}</div>
                </div>
              </div>

              {generating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating bills...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </>
          )}

          {results && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{results.total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">{results.successful}</div>
                  <div className="text-xs text-muted-foreground">Generated</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">{results.failed}</div>
                  <div className="text-xs text-muted-foreground">Failed</div>
                </div>
              </div>

              {results.errors.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-destructive">Errors:</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {results.errors.map((error, index) => (
                      <div key={index} className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm text-success">
                  {results.successful} bills generated and SMS notifications sent
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)} 
              className="flex-1"
              disabled={generating}
            >
              Cancel
            </Button>
            {!results ? (
              <Button 
                onClick={handleGenerateBills} 
                disabled={customersWithReadings.length === 0 || generating}
                className="flex-1 bg-gradient-primary"
              >
                {generating ? "Generating..." : `Generate ${customersWithReadings.length} Bills`}
              </Button>
            ) : (
              <Button 
                onClick={handleConfirm}
                className="flex-1 bg-gradient-primary"
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};