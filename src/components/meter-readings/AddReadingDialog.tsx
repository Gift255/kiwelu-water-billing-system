import { useState } from "react";
import { Plus, Camera, MapPin, Search } from "lucide-react";
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
import { dataStore, MeterReading } from "@/data/globalData";
import { useCustomers } from "@/hooks/useDataStore";
import { toast } from "@/components/ui/sonner";

interface AddReadingDialogProps {
  onAddReading?: (reading: MeterReading) => void;
}

export const AddReadingDialog: React.FC<AddReadingDialogProps> = ({ onAddReading }) => {
  const customers = useCustomers();
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [formData, setFormData] = useState({
    currentReading: "",
    notes: "",
    collector: "Data Collector 1"
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.id.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.meterId.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const getLastReading = (customerId: string): number => {
    const readings = dataStore.getMeterReadings();
    const customerReadings = readings.filter(r => r.customerId === customerId);
    if (customerReadings.length === 0) return 0;
    return Math.max(...customerReadings.map(r => r.currentReading));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer || !formData.currentReading) {
      toast.error("Please select a customer and enter current reading");
      return;
    }

    const previousReading = getLastReading(selectedCustomer.id);
    const currentReading = parseInt(formData.currentReading);
    
    if (currentReading < previousReading) {
      toast.error("Current reading cannot be less than previous reading");
      return;
    }

    const newReading: MeterReading = {
      id: `R${Date.now()}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      meterId: selectedCustomer.meterId,
      previousReading,
      currentReading: parseInt(formData.currentReading),
      consumption: currentReading - previousReading,
      readingDate: new Date().toISOString().split('T')[0],
      collector: formData.collector,
      zone: selectedCustomer.zone,
      status: "pending" as const,
      notes: formData.notes,
      photoUrl: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=100&h=80",
      gpsLocation: selectedCustomer.gpsLocation
    };

    dataStore.addMeterReading(newReading);
    if (onAddReading) onAddReading(newReading);
    
    toast.success(`Reading added for ${selectedCustomer.name}`);
    
    setOpen(false);
    setSelectedCustomer(null);
    setCustomerSearch("");
    setFormData({
      currentReading: "",
      notes: "",
      collector: "Data Collector 1"
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary shadow-medium">
          <Plus className="w-4 h-4 mr-2" />
          Add Reading
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Meter Reading</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Search Customer</Label>
            <Input
              placeholder="Search by name, ID, or meter ID..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
            />
            {customerSearch && (
              <div className="max-h-32 overflow-y-auto border rounded-md">
                {filteredCustomers.map(customer => (
                  <div
                    key={customer.id}
                    className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setCustomerSearch("");
                    }}
                  >
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {customer.id} • {customer.meterId} • {customer.zone}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedCustomer && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="font-medium">{selectedCustomer.name}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedCustomer.id} • {selectedCustomer.meterId}
                </div>
                <div className="text-sm">
                  <Badge variant="outline">Last Reading: {getLastReading(selectedCustomer.id)} m³</Badge>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentReading">Current Reading (m³)</Label>
            <Input
              id="currentReading"
              type="number"
              value={formData.currentReading}
              onChange={(e) => setFormData(prev => ({ ...prev, currentReading: e.target.value }))}
              placeholder="1275"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collector">Data Collector</Label>
            <Select value={formData.collector} onValueChange={(value) => setFormData(prev => ({ ...prev, collector: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Data Collector 1">Data Collector 1</SelectItem>
                <SelectItem value="Data Collector 2">Data Collector 2</SelectItem>
                <SelectItem value="Data Collector 3">Data Collector 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes about this reading..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1">
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              <MapPin className="w-4 h-4 mr-2" />
              Get GPS
            </Button>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-primary">
              Add Reading
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};