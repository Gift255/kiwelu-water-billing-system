import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerFiltersProps {
  searchTerm: string;
  selectedZone: string;
  selectedStatus: string;
  onSearchChange: (value: string) => void;
  onZoneChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  searchTerm,
  selectedZone,
  selectedStatus,
  onSearchChange,
  onZoneChange,
  onStatusChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, ID, phone, or meter ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={selectedZone} onValueChange={onZoneChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Zones" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Zones</SelectItem>
          <SelectItem value="Zone A">Zone A</SelectItem>
          <SelectItem value="Zone B">Zone B</SelectItem>
          <SelectItem value="Zone C">Zone C</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};