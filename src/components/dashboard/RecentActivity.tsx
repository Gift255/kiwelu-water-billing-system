import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "reading" | "payment" | "alert" | "success";
  title: string;
  description: string;
  time: string;
  amount?: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "payment",
    title: "Payment Received",
    description: "Customer #1234 - John Doe",
    time: "2 minutes ago",
    amount: "TZS 45,000"
  },
  {
    id: "2",
    type: "reading",
    title: "Meter Reading Added",
    description: "Zone A - 15 readings uploaded",
    time: "15 minutes ago"
  },
  {
    id: "3",
    type: "alert",
    title: "Overdue Payment Alert",
    description: "Customer #5678 - 30 days overdue",
    time: "1 hour ago",
    amount: "TZS 23,500"
  },
  {
    id: "4",
    type: "success",
    title: "Invoice Generated",
    description: "Monthly billing completed for Zone B",
    time: "2 hours ago"
  },
  {
    id: "5",
    type: "payment",
    title: "Payment Received",
    description: "Customer #9012 - Sarah Johnson",
    time: "3 hours ago",
    amount: "TZS 67,200"
  }
];

export function RecentActivity() {
  const getIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <DollarSign className="w-4 h-4 text-success" />;
      case "reading":
        return <Droplets className="w-4 h-4 text-info" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-success" />;
      default:
        return <Droplets className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case "payment":
        return "bg-success/10 text-success";
      case "reading":
        return "bg-info/10 text-info";
      case "alert":
        return "bg-warning/10 text-warning";
      case "success":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0 mt-1">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <div className="flex items-center gap-2">
                    {activity.amount && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.amount}
                      </Badge>
                    )}
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getStatusColor(activity.type)}`}
                    >
                      {activity.type}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}