import { Users, Droplets, FileText, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RevenueChart, ConsumptionChart } from "@/components/dashboard/ChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Kiwelu Water Billing System - Monitor your operations at a glance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Customers"
          value="1,247"
          change="+5.2%"
          changeType="positive"
          description="from last month"
          icon={<Users className="w-4 h-4 text-primary" />}
        />
        <StatsCard
          title="Monthly Revenue"
          value="TZS 178M"
          change="+12.3%"
          changeType="positive"
          description="vs target TZS 170M"
          icon={<DollarSign className="w-4 h-4 text-primary" />}
        />
        <StatsCard
          title="Water Consumption"
          value="67,000L"
          change="+8.1%"
          changeType="positive"
          description="this month"
          icon={<Droplets className="w-4 h-4 text-primary" />}
        />
        <StatsCard
          title="Pending Payments"
          value="23"
          change="-15.2%"
          changeType="positive"
          description="overdue invoices"
          icon={<AlertTriangle className="w-4 h-4 text-primary" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <ConsumptionChart />
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Collection Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>This Month</span>
                  <span className="font-medium">89%</span>
                </div>
                <Progress value={89} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Target: 85%</span>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    +4% above target
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Meter Reading Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>June 2025</span>
                  <span className="font-medium">1,156 / 1,247</span>
                </div>
                <Progress value={93} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  93% of meters read this month
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge variant="secondary" className="bg-success/10 text-success">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SMS Gateway</span>
                  <Badge variant="secondary" className="bg-success/10 text-success">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup</span>
                  <Badge variant="secondary" className="bg-info/10 text-info">Daily</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
