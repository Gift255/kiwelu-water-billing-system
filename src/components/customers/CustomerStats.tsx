import { Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    icon: Phone,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
    value: "1,247",
    label: "Total Customers"
  },
  {
    icon: Phone,
    iconColor: "text-success",
    bgColor: "bg-success/10",
    value: "1,198",
    label: "Active"
  },
  {
    icon: Phone,
    iconColor: "text-warning",
    bgColor: "bg-warning/10",
    value: "37",
    label: "Suspended"
  },
  {
    icon: Phone,
    iconColor: "text-muted-foreground",
    bgColor: "bg-muted/50",
    value: "12",
    label: "Inactive"
  }
];

export const CustomerStats = () => {
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