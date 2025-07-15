import { useState } from "react";
import { Plus, User } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerMutations } from "@/hooks/useApiData";

interface AddCustomerDialogProps {
  onSuccess: () => void;
}

export const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({ onSuccess }) => {
  const { hasPermission } = useAuth();
  const { createCustomer, loading } = useCustomerMutations();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    zone_id: "",
    connection_type: "residential" as "residential" | "commercial" | "industrial"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || !formData.zone_id) {
      return;
    }

    try {
      await createCustomer(formData);
      setOpen(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        zone_id: "",
        connection_type: "residential"
      });
      onSuccess();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-primary shadow-medium"
          disabled={!hasPermission('all')}
          title={hasPermission('all') ? "Add Customer" : "Only admins can add customers"}
        >
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
              <Label htmlFor="zone_id">Zone *</Label>
              <Select value={formData.zone_id} onValueChange={(value) => setFormData(prev => ({ ...prev, zone_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ZONE_A">Zone A</SelectItem>
                  <SelectItem value="ZONE_B">Zone B</SelectItem>
                  <SelectItem value="ZONE_C">Zone C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="connection_type">Connection Type</Label>
              <Select value={formData.connection_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, connection_type: value }))}>
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

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Customer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};