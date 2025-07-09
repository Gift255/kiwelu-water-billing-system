import { Users, UserCheck, UserX, UserMinus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDataStore } from "@/hooks/useDataStore";

export const CustomerStats = () => {
  const dataStore = useDataStore();
  const stats = dataStore.getCustomerStats();

  const statCards = [
    {
      icon: Users,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      value: stats.total.toString(),
      label: "Total Customers"
    },
    {
      icon: UserCheck,
      iconColor: "text-success",
      bgColor: "bg-success/10",
      value: stats.active.toString(),
      label: "Active"
    },
    {
      icon: UserX,
      iconColor: "text-warning",
      bgColor: "bg-warning/10",
      value: stats.suspended.toString(),
      label: "Suspended"
    },
    {
      icon: UserMinus,
      iconColor: "text-muted-foreground",
      bgColor: "bg-muted/50",
      value: stats.inactive.toString(),
      label: "Inactive"
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