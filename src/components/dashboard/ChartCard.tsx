import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 120000, target: 150000 },
  { month: "Feb", revenue: 135000, target: 150000 },
  { month: "Mar", revenue: 148000, target: 150000 },
  { month: "Apr", revenue: 162000, target: 160000 },
  { month: "May", revenue: 155000, target: 160000 },
  { month: "Jun", revenue: 178000, target: 170000 },
];

const consumptionData = [
  { month: "Jan", consumption: 45000 },
  { month: "Feb", consumption: 52000 },
  { month: "Mar", consumption: 48000 },
  { month: "Apr", consumption: 61000 },
  { month: "May", consumption: 55000 },
  { month: "Jun", consumption: 67000 },
];

export function RevenueChart() {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" className="text-muted-foreground" />
            <YAxis className="text-muted-foreground" />
            <Tooltip 
              formatter={(value: number) => [`TZS ${value.toLocaleString()}`, ""]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))" }}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="hsl(var(--muted-foreground))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "hsl(var(--muted-foreground))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ConsumptionChart() {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Water Consumption</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={consumptionData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" className="text-muted-foreground" />
            <YAxis className="text-muted-foreground" />
            <Tooltip 
              formatter={(value: number) => [`${value.toLocaleString()} L`, ""]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Bar 
              dataKey="consumption" 
              fill="hsl(var(--accent))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}