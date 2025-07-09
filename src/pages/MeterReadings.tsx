import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeterReadingStats } from "@/components/meter-readings/MeterReadingStats";
import { MeterReadingTable } from "@/components/meter-readings/MeterReadingTable";
import { MeterReadingFilters } from "@/components/meter-readings/MeterReadingFilters";
import { readings } from "@/data/meterReadingData";

const MeterReadings: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  const filteredReadings = readings.filter(reading => {
    const matchesZone = !selectedZone || reading.zone === selectedZone;
    const matchesStatus = !selectedStatus || reading.status === selectedStatus;
    return matchesZone && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meter Readings</h1>
          <p className="text-muted-foreground">
            Record and manage monthly water meter readings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button className="bg-gradient-primary shadow-medium">
            <Plus className="w-4 h-4 mr-2" />
            Add Reading
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <MeterReadingStats />

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