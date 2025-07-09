import { useState } from "react";
import { Plus, User, Phone, Mail, MapPin } from "lucide-react";
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
import { dataStore, Customer } from "@/data/globalData";
import { toast } from "@/components/ui/sonner";

export const AddCustomerDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    zone: "",
    connectionType: "residential" as "residential" | "commercial" | "industrial"
  });

  const generateCustomerId = () => {
    const customers = dataStore.getCustomers();
    const lastId = customers.length > 0 ? 
      Math.max(...customers.map(c => parseInt(c.id.substring(1)))) : 0;
    return `C${String(lastId + 1).padStart(3, '0')}`;
  };

  const generateMeterId = () => {
    const customers = dataStore.getCustomers();
    const lastMeterId = customers.length > 0 ? 
      Math.max(...customers.map(c => parseInt(c.meterId.substring(1)))) : 1233;
    return `M${String(lastMeterId + 1).padStart(6, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || !formData.zone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newCustomer: Customer = {
      id: generateCustomerId(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      meterId: generateMeterId(),
      status: "active",
      zone: formData.zone,
      balance: 0,
      lastReading: "Never",
      gpsLocation: "",
      registrationDate: new Date().toISOString().split('T')[0],
      connectionType: formData.connectionType
    };

    dataStore.addCustomer(newCustomer);
    
    toast.success(`Customer ${newCustomer.name} added successfully!`);
    
    setOpen(false);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      zone: "",
      connectionType: "residential"
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary shadow-medium">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Add New Customer
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+255 712 345 678"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="john.doe@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Street, Ward, District"
              rows={2}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zone">Zone *</Label>
              <Select value={formData.zone} onValueChange={(value) => setFormData(prev => ({ ...prev, zone: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zone A">Zone A</SelectItem>
                  <SelectItem value="Zone B">Zone B</SelectItem>
                  <SelectItem value="Zone C">Zone C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="connectionType">Connection Type</Label>
              <Select value={formData.connectionType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, connectionType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <p className="font-medium">Auto-generated:</p>
            <p>Customer ID: {generateCustomerId()}</p>
            <p>Meter ID: {generateMeterId()}</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-primary">
              Add Customer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};