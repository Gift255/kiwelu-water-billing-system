import { Camera, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MeterReading } from "@/data/globalData";

interface MeterReadingStatsProps {
  readings?: MeterReading[];
}

export const MeterReadingStats: React.FC<MeterReadingStatsProps> = ({ readings = [] }) => {
  const stats = {
    total: readings.length,
    approved: readings.filter(r => r.status === 'approved').length,
    pending: readings.filter(r => r.status === 'pending').length,
    rejected: readings.filter(r => r.status === 'rejected').length,
    flagged: readings.filter(r => r.status === 'flagged').length
  };

  const statCards = [
    {
      icon: Camera,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      value: stats.total.toString(),
      label: "Readings Collected"
    },
    {
      icon: CheckCircle,
      iconColor: "text-success",
      bgColor: "bg-success/10",
      value: stats.approved.toString(),
      label: "Approved"
    },
    {
      icon: Clock,
      iconColor: "text-warning",
      bgColor: "bg-warning/10",
      value: stats.pending.toString(),
      label: "Pending Approval"
    },
    {
      icon: AlertTriangle,
      iconColor: "text-destructive",
      bgColor: "bg-destructive/10",
      value: (stats.rejected + stats.flagged).toString(),
      label: "Rejected/Flagged"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};