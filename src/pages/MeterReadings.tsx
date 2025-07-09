import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeterReadingStats } from "@/components/meter-readings/MeterReadingStats";
import { MeterReadingTable } from "@/components/meter-readings/MeterReadingTable";
import { MeterReadingFilters } from "@/components/meter-readings/MeterReadingFilters";
import { AddReadingDialog } from "@/components/meter-readings/AddReadingDialog";
import { readings as initialReadings, filterReadings, MeterReading } from "@/data/meterReadingData";

const MeterReadings: React.FC = () => {
  const [readings, setReadings] = useState<MeterReading[]>(initialReadings);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  const filteredReadings = filterReadings(readings, selectedZone, selectedStatus, selectedPeriod);

  const handleAddReading = (newReading: MeterReading) => {
    setReadings(prev => [newReading, ...prev]);
  };

  const handleBulkUpload = () => {
    // In a real app, this would open a file upload dialog
    console.log("Opening bulk upload dialog...");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meter Readings</h1>
          <p className="text-muted-foreground">
            Record and manage monthly water meter readings with photo verification
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBulkUpload}>
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <AddReadingDialog onAddReading={handleAddReading} />
        </div>
      </div>

      {/* Stats Cards */}
      <MeterReadingStats readings={readings} />

      {/* Filters and Reading List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Meter Reading Records</CardTitle>
        </CardHeader>
        <CardContent>
          <MeterReadingFilters
            selectedPeriod={selectedPeriod}
            selectedZone={selectedZone}
            selectedStatus={selectedStatus}
            onPeriodChange={setSelectedPeriod}
            onZoneChange={setSelectedZone}
            onStatusChange={setSelectedStatus}
          />

          <MeterReadingTable readings={filteredReadings} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MeterReadings;