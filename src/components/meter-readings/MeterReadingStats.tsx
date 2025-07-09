import { Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    icon: Camera,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
    value: "1,156",
    label: "Readings Collected"
  },
  {
    icon: Camera,
    iconColor: "text-success",
    bgColor: "bg-success/10",
    value: "1,089",
    label: "Validated"
  },
  {
    icon: Camera,
    iconColor: "text-warning",
    bgColor: "bg-warning/10",
    value: "54",
    label: "Pending Review"
  },
  {
    icon: Camera,
    iconColor: "text-destructive",
    bgColor: "bg-destructive/10",
    value: "13",
    label: "Flagged"
  }
];

export const MeterReadingStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat, index) => (
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