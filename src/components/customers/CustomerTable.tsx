import { MapPin, Phone, Mail, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerMutations } from "@/hooks/useApiData";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  meter_number?: string;
  zone_name?: string;
  connection_type: string;
  status: 'active' | 'suspended' | 'inactive';
  balance: number;
  last_reading_date?: string;
}

interface CustomerTableProps {
  customers: Customer[];
  onUpdate: () => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onUpdate }) => {
  const { hasPermission } = useAuth();
  const { deleteCustomer, loading } = useCustomerMutations();

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-success/10 text-success",
      suspended: "bg-destructive/10 text-destructive",
      inactive: "bg-muted text-muted-foreground"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || ""}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getBalanceColor = (balance: number) => {
    if (balance < 0) return "text-destructive font-medium";
    if (balance > 0) return "text-success font-medium";
    return "text-muted-foreground";
  };

  const handleDeleteCustomer = async (customerId: string, customerName: string) => {
    if (confirm(`Are you sure you want to delete customer ${customerName}?`)) {
      try {
        await deleteCustomer(customerId);
        onUpdate();
      } catch (error) {
        // Error is handled by the mutation hook
      }
    }
  };

  const handleEditCustomer = (customerId: string) => {
    // In a real app, this would open an edit dialog
    console.log(`Edit customer ${customerId}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Meter ID</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Last Reading</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-muted-foreground">{customer.id}</div>
                  <div className="text-xs text-muted-foreground">{customer.address}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="w-3 h-3" />
                    {customer.phone}
                  </div>
                  {customer.email && (
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="w-3 h-3" />
                      {customer.email}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{customer.meter_number || 'N/A'}</Badge>
              </TableCell>
              <TableCell>{customer.zone_name || 'N/A'}</TableCell>
              <TableCell>{getStatusBadge(customer.status)}</TableCell>
              <TableCell>
                <span className={getBalanceColor(customer.balance)}>
                  TZS {customer.balance?.toLocaleString() || '0'}
                </span>
              </TableCell>
              <TableCell className="text-sm">{customer.last_reading_date || 'Never'}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <MapPin className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditCustomer(customer.id)}
                    disabled={!hasPermission('all')}
                    title={hasPermission('all') ? "Edit Customer" : "Only admins can edit customers"}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                    className="text-destructive hover:text-destructive"
                    disabled={!hasPermission('all') || loading}
                    title={hasPermission('all') ? "Delete Customer" : "Only admins can delete customers"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};