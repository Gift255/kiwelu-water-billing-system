import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeterReadingStats } from "@/components/meter-readings/MeterReadingStats";
import { MeterReadingTable } from "@/components/meter-readings/MeterReadingTable";
import { MeterReadingFilters } from "@/components/meter-readings/MeterReadingFilters";
import { AddReadingDialog } from "@/components/meter-readings/AddReadingDialog";
import { BulkUploadDialog } from "@/components/meter-readings/BulkUploadDialog";
import { useMeterReadings } from "@/hooks/useDataStore";
import { MeterReading } from "@/data/globalData";

const MeterReadings: React.FC = () => {
  const readings = useMeterReadings();
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  const filterReadings = (
    readings: MeterReading[],
    selectedZone: string,
    selectedStatus: string,
    selectedPeriod: string
  ) => {
    return readings.filter(reading => {
      const matchesZone = selectedZone === "all" || !selectedZone || reading.zone === selectedZone;
      const matchesStatus = selectedStatus === "all" || !selectedStatus || reading.status === selectedStatus;
      // For period filtering, you could add date range logic here
      return matchesZone && matchesStatus;
    });
  };

  const filteredReadings = filterReadings(readings, selectedZone, selectedStatus, selectedPeriod);

  const handleBulkUpload = (newReadings: MeterReading[]) => {
    // Readings are automatically added to the store via the dialog
    console.log("Bulk upload completed:", newReadings.length, "readings");
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
          <BulkUploadDialog onBulkUpload={handleBulkUpload} />
          <AddReadingDialog />
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