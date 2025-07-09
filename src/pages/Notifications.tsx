import { Send, MessageSquare, Phone, Settings } from "lucide-react";
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
import { useSMSNotifications, useCustomers } from "@/hooks/useDataStore";
import { dataStore } from "@/data/globalData";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

const Notifications = () => {
  const notifications = useSMSNotifications();
  const customers = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [messageType, setMessageType] = useState("custom");
  const [recipientGroup, setRecipientGroup] = useState("all");
  const [customMessage, setCustomMessage] = useState("");
  
  const smsStats = {
    total: notifications.length,
    delivered: notifications.filter(n => n.status === 'delivered').length,
    failed: notifications.filter(n => n.status === 'failed').length,
    totalCost: notifications.reduce((sum, n) => sum + n.cost, 0)
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || notification.type === selectedType;
    const matchesStatus = selectedStatus === "all" || notification.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getRecipientsForGroup = (group: string) => {
    switch (group) {
      case "all":
        return customers;
      case "zone_a":
        return customers.filter(c => c.zone === "Zone A");
      case "zone_b":
        return customers.filter(c => c.zone === "Zone B");
      case "zone_c":
        return customers.filter(c => c.zone === "Zone C");
      case "overdue":
        return customers.filter(c => c.balance < 0);
      default:
        return customers;
    }
  };

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

  const handleSendSMS = () => {
    if (!customMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    const recipients = getRecipientsForGroup(recipientGroup);
    
    if (recipients.length === 0) {
      toast.error("No recipients found for selected group");
      return;
    }

    // Send SMS to all recipients
    recipients.forEach((customer, index) => {
      const notification = {
        id: `SMS-${Date.now()}-${index}`,
        recipient: `${customer.name} (${customer.phone})`,
        customerId: customer.id,
        message: customMessage,
        type: messageType as any,
        status: 'delivered' as const,
        sentDate: new Date().toISOString(),
        cost: 150
      };
      
      dataStore.sendSMS(notification);
    });

    toast.success(`SMS sent to ${recipients.length} recipients`);
    setCustomMessage("");
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
                <p className="text-2xl font-bold">{smsStats.total}</p>
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
                <p className="text-2xl font-bold">{smsStats.delivered}</p>
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
                <p className="text-2xl font-bold">{smsStats.failed}</p>
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
                <p className="text-2xl font-bold">TZS {Math.round(smsStats.totalCost / 1000)}K</p>
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
              <Select value={messageType} onValueChange={setMessageType}>
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
              
              <Select value={recipientGroup} onValueChange={setRecipientGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Recipient Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="zone_a">Zone A ({customers.filter(c => c.zone === "Zone A").length} customers)</SelectItem>
                  <SelectItem value="zone_b">Zone B ({customers.filter(c => c.zone === "Zone B").length} customers)</SelectItem>
                  <SelectItem value="zone_c">Zone C ({customers.filter(c => c.zone === "Zone C").length} customers)</SelectItem>
                  <SelectItem value="overdue">Overdue Accounts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="Enter your message here... (160 characters max)"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-20"
              maxLength={160}
            />

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {customMessage.length}/160 characters
              </div>
              <div className="text-sm text-muted-foreground">
                Estimated cost: TZS {(getRecipientsForGroup(recipientGroup).length * 150).toLocaleString()} 
                ({getRecipientsForGroup(recipientGroup).length} recipients × TZS 150)
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">Preview</Button>
              <Button 
                className="flex-1 bg-gradient-primary"
                onClick={handleSendSMS}
                disabled={!customMessage.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Send SMS
              </Button>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={selectedType} onValueChange={setSelectedType}>
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
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
                {filteredNotifications.map((notification) => (
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