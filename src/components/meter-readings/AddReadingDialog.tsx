import { useState } from "react";
import { Plus, Camera, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface AddReadingDialogProps {
  onAddReading: (reading: any) => void;
}

export const AddReadingDialog: React.FC<AddReadingDialogProps> = ({ onAddReading }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: "",
    meterId: "",
    currentReading: "",
    notes: "",
    collector: "Data Collector 1"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would make an API call
    const newReading = {
      id: `R${Date.now()}`,
      customerId: formData.customerId,
      customerName: "New Customer", // Would be fetched from customer data
      meterId: formData.meterId,
      previousReading: 1000, // Would be fetched from last reading
      currentReading: parseInt(formData.currentReading),
      consumption: parseInt(formData.currentReading) - 1000,
      readingDate: new Date().toISOString().split('T')[0],
      collector: formData.collector,
      zone: "Zone A", // Would be determined from customer data
      status: "pending" as const,
      notes: formData.notes,
      photoUrl: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=100&h=80"
    };

    onAddReading(newReading);
    setOpen(false);
    setFormData({
      customerId: "",
      meterId: "",
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
            <Label htmlFor="customerId">Customer ID</Label>
            <Input
              id="customerId"
              value={formData.customerId}
              onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
              placeholder="C001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meterId">Meter ID</Label>
            <Input
              id="meterId"
              value={formData.meterId}
              onChange={(e) => setFormData(prev => ({ ...prev, meterId: e.target.value }))}
              placeholder="M001234"
              required
            />
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