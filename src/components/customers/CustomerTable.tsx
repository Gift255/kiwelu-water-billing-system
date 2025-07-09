import { MapPin, Phone, Mail } from "lucide-react";
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
import { Customer, getCustomerStatusBadgeVariant, getBalanceColor } from "@/data/customerData";

interface CustomerTableProps {
  customers: Customer[];
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ customers }) => {
  const getStatusBadge = (status: string) => {
    const variant = getCustomerStatusBadgeVariant(status);
    const variantClasses = {
      success: "bg-success/10 text-success",
      destructive: "bg-destructive/10 text-destructive",
      muted: "bg-muted text-muted-foreground",
      secondary: ""
    };
    
    if (variant === "secondary") {
      return <Badge variant="secondary">{status}</Badge>;
    }
    
    return <Badge className={variantClasses[variant as keyof typeof variantClasses]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
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
                  <div className="flex items-center gap-1 text-sm">
                    <Mail className="w-3 h-3" />
                    {customer.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{customer.meterId}</Badge>
              </TableCell>
              <TableCell>{customer.zone}</TableCell>
              <TableCell>{getStatusBadge(customer.status)}</TableCell>
              <TableCell>
                <span className={getBalanceColor(customer.balance)}>
                  TZS {customer.balance.toLocaleString()}
                </span>
              </TableCell>
              <TableCell className="text-sm">{customer.lastReading}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <MapPin className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
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