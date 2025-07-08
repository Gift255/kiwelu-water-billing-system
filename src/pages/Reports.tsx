import { BarChart3, Download, FileText, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RevenueChart, ConsumptionChart } from "@/components/dashboard/ChartCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Reports = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports for financial and operational insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Period
          </Button>
          <Button className="bg-gradient-primary shadow-medium">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Quick Report Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Revenue Report</p>
                <p className="text-xs text-muted-foreground">Monthly financial summary</p>
                <Badge className="mt-1 bg-success/10 text-success">Ready</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm font-medium">Customer Report</p>
                <p className="text-xs text-muted-foreground">Demographics & consumption</p>
                <Badge className="mt-1 bg-success/10 text-success">Ready</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium">Collection Report</p>
                <p className="text-xs text-muted-foreground">Payment efficiency metrics</p>
                <Badge className="mt-1 bg-success/10 text-success">Ready</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Consumption Report</p>
                <p className="text-xs text-muted-foreground">Usage patterns & trends</p>
                <Badge className="mt-1 bg-success/10 text-success">Ready</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Controls */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Generate Custom Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue Report</SelectItem>
                <SelectItem value="customers">Customer Report</SelectItem>
                <SelectItem value="collections">Collection Report</SelectItem>
                <SelectItem value="consumption">Consumption Report</SelectItem>
                <SelectItem value="overdue">Overdue Accounts</SelectItem>
                <SelectItem value="zone">Zone Performance</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Month</SelectItem>
                <SelectItem value="previous">Previous Month</SelectItem>
                <SelectItem value="quarter">Current Quarter</SelectItem>
                <SelectItem value="year">Current Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                <SelectItem value="csv">CSV Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button className="bg-gradient-primary">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline">
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <ConsumptionChart />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Collection Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Current Month</span>
                <span className="font-semibold">89%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Previous Month</span>
                <span className="font-semibold">84%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Year Average</span>
                <span className="font-semibold">86%</span>
              </div>
              <div className="pt-2">
                <Badge className="bg-success/10 text-success">+5% improvement</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Zone B</span>
                <div className="text-right">
                  <div className="font-semibold">95%</div>
                  <div className="text-xs text-muted-foreground">Collection rate</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Zone A</span>
                <div className="text-right">
                  <div className="font-semibold">91%</div>
                  <div className="text-xs text-muted-foreground">Collection rate</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Zone C</span>
                <div className="text-right">
                  <div className="font-semibold">87%</div>
                  <div className="text-xs text-muted-foreground">Collection rate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Avg. Consumption</span>
                <span className="font-semibold">24.5 m³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg. Bill Amount</span>
                <span className="font-semibold">TZS 29,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Payment Period</span>
                <span className="font-semibold">18 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Customer Growth</span>
                <span className="font-semibold text-success">+5.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;