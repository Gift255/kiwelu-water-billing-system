import { Bell, Send, MessageSquare, Phone, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const notifications = [
  {
    id: "SMS-001234",
    recipient: "John Doe (+255 712 345 678)",
    message: "Your water bill for June 2025 is TZS 22,000. Due date: July 15, 2025.",
    type: "billing",
    status: "delivered",
    sentDate: "2025-06-15 14:30",
    cost: 150
  },
  {
    id: "SMS-001235",
    recipient: "Sarah Johnson (+255 713 456 789)",
    message: "Payment of TZS 35,000 received. Thank you for your payment.",
    type: "payment_confirmation",
    status: "delivered",
    sentDate: "2025-06-14 16:45",
    cost: 150
  },
  {
    id: "SMS-001236",
    recipient: "Michael Brown (+255 714 567 890)",
    message: "Meter reading recorded: 1820 m³. Your bill will be generated soon.",
    type: "reading_confirmation",
    status: "failed",
    sentDate: "2025-06-13 10:20",
    cost: 0
  }
];

const Notifications = () => {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "billing":
        return <Badge className="bg-primary/10 text-primary">Billing</Badge>;
      case "payment_confirmation":
        return <Badge className="bg-success/10 text-success">Payment</Badge>;
      case "reading_confirmation":
        return <Badge className="bg-info/10 text-info">Reading</Badge>;
      case "reminder":
        return <Badge className="bg-warning/10 text-warning">Reminder</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-success/10 text-success">Delivered</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning">Pending</Badge>;
      case "failed":
        return <Badge className="bg-destructive/10 text-destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SMS Notifications</h1>
          <p className="text-muted-foreground">
            Send automated SMS notifications to customers via Twilio
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            SMS Settings
          </Button>
          <Button className="bg-gradient-primary shadow-medium">
            <Send className="w-4 h-4 mr-2" />
            Send SMS
          </Button>
        </div>
      </div>

      {/* SMS Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">2,847</p>
                <p className="text-sm text-muted-foreground">SMS Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">2,798</p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">49</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">TZS 427K</p>
                <p className="text-sm text-muted-foreground">SMS Costs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Send SMS */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Send SMS Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Message Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="billing">Billing Notification</SelectItem>
                  <SelectItem value="payment">Payment Confirmation</SelectItem>
                  <SelectItem value="reminder">Payment Reminder</SelectItem>
                  <SelectItem value="reading">Reading Confirmation</SelectItem>
                  <SelectItem value="custom">Custom Message</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Recipient Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="zone_a">Zone A</SelectItem>
                  <SelectItem value="zone_b">Zone B</SelectItem>
                  <SelectItem value="overdue">Overdue Accounts</SelectItem>
                  <SelectItem value="custom">Custom Selection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="Enter your message here... (160 characters max)"
              className="min-h-20"
            />

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Estimated cost: TZS 187,000 (1,247 recipients × TZS 150)
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Preview</Button>
                <Button className="bg-gradient-primary">
                  <Send className="w-4 h-4 mr-2" />
                  Send SMS
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS History */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>SMS History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search by recipient or message..."
              className="flex-1"
            />
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Message Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="payment_confirmation">Payment</SelectItem>
                <SelectItem value="reading_confirmation">Reading</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SMS ID</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div className="font-mono text-sm">{notification.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{notification.recipient}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm max-w-xs truncate">{notification.message}</div>
                    </TableCell>
                    <TableCell>{getTypeBadge(notification.type)}</TableCell>
                    <TableCell>{getStatusBadge(notification.status)}</TableCell>
                    <TableCell className="text-sm">{notification.sentDate}</TableCell>
                    <TableCell className="text-sm">
                      {notification.cost > 0 ? `TZS ${notification.cost}` : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Resend
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;