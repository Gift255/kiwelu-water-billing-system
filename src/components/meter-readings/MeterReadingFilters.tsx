import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MeterReadingFiltersProps {
  selectedPeriod: string;
  selectedZone: string;
  selectedStatus: string;
  onPeriodChange: (value: string) => void;
  onZoneChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const MeterReadingFilters: React.FC<MeterReadingFiltersProps> = ({
  selectedPeriod,
  selectedZone,
  selectedStatus,
  onPeriodChange,
  onZoneChange,
  onStatusChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Billing Period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="current">June 2025</SelectItem>
          <SelectItem value="previous">May 2025</SelectItem>
          <SelectItem value="april">April 2025</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={selectedZone} onValueChange={onZoneChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Zones" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Zones</SelectItem>
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
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="flagged">Flagged</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};