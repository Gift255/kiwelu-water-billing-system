import { Users, Droplets, FileText, DollarSign, AlertTriangle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RevenueChart, ConsumptionChart } from "@/components/dashboard/ChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomerStats, useReadingStats, useInvoiceStats, usePaymentStats } from "@/hooks/useApiData";

const Index = () => {
  const { data: customerStats, loading: customerLoading } = useCustomerStats();
  const { data: readingStats, loading: readingLoading } = useReadingStats();
  const { data: invoiceStats, loading: invoiceLoading } = useInvoiceStats();
  const { data: paymentStats, loading: paymentLoading } = usePaymentStats();

  const isLoading = customerLoading || readingLoading || invoiceLoading || paymentLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Kiwelu Water Billing System - Monitor your operations at a glance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shadow-soft">
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
          value={customerStats?.total?.toString() || '0'}
          change="+5.2%"
          changeType="positive"
          description="from last month"
          icon={<Users className="w-4 h-4 text-primary" />}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`TZS ${Math.round((paymentStats?.total_amount || 0) / 1000)}K`}
          change="+12.3%"
          changeType="positive"
          description="total collected"
          icon={<DollarSign className="w-4 h-4 text-primary" />}
        />
        <StatsCard
          title="Water Consumption"
          value={`${readingStats?.approved || 0} approved`}
          change="+8.1%"
          changeType="positive"
          description="this month"
          icon={<Droplets className="w-4 h-4 text-primary" />}
        />
        <StatsCard
          title="Pending Payments"
          value={invoiceStats?.overdue?.toString() || '0'}
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
                  <span className="font-medium">
                    {invoiceStats?.total > 0 ? Math.round((invoiceStats?.paid / invoiceStats?.total) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={invoiceStats?.total > 0 ? (invoiceStats?.paid / invoiceStats?.total) * 100 : 0} 
                  className="h-2" 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Target: 85%</span>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    {invoiceStats?.total > 0 && (invoiceStats?.paid / invoiceStats?.total) * 100 > 85 ? 'Above target' : 'Below target'}
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
                  <span className="font-medium">{readingStats?.approved || 0} / {readingStats?.total || 0}</span>
                </div>
                <Progress 
                  value={readingStats?.total > 0 ? (readingStats?.approved / readingStats?.total) * 100 : 0} 
                  className="h-2" 
                />
                <div className="text-xs text-muted-foreground">
                  {readingStats?.total > 0 ? Math.round((readingStats?.approved / readingStats?.total) * 100) : 0}% of readings validated
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