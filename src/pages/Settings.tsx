import { Settings as SettingsIcon, Save, Database, MessageSquare, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground">
            Configure billing rates, SMS credentials, and system preferences
          </p>
        </div>
        <Button className="bg-gradient-primary shadow-medium">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Billing Configuration */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Billing Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="billing-period">Current Billing Period</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="June 2025" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="june">June 2025</SelectItem>
                  <SelectItem value="july">July 2025</SelectItem>
                  <SelectItem value="august">August 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rate Structure (TZS per m³)</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="0-10 m³" value="800" />
                  <Input placeholder="11-20 m³" value="1200" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="21-50 m³" value="1800" />
                  <Input placeholder="50+ m³" value="2500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="late-fee">Late Payment Penalty (%)</Label>
              <Input id="late-fee" placeholder="5" value="5" />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="auto-billing" defaultChecked />
              <Label htmlFor="auto-billing">Auto-generate monthly bills</Label>
            </div>
          </CardContent>
        </Card>

        {/* SMS Configuration */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              SMS Configuration (Twilio)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twilio-sid">Account SID</Label>
              <Input id="twilio-sid" type="password" placeholder="AC..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twilio-token">Auth Token</Label>
              <Input id="twilio-token" type="password" placeholder="..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twilio-number">From Number</Label>
              <Input id="twilio-number" placeholder="+1234567890" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sms-cost">SMS Cost (TZS)</Label>
              <Input id="sms-cost" placeholder="150" value="150" />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="auto-sms" defaultChecked />
              <Label htmlFor="auto-sms">Auto-send bill notifications</Label>
            </div>

            <Button variant="outline" className="w-full">
              Test SMS Connection
            </Button>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Administrator Name</Label>
              <Input id="admin-name" placeholder="Admin User" value="Admin User" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-email">Administrator Email</Label>
              <Input id="admin-email" type="email" placeholder="admin@kiwelu.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" placeholder="60" value="60" />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="force-password" defaultChecked />
              <Label htmlFor="force-password">Force password change every 90 days</Label>
            </div>

            <Button variant="outline" className="w-full">
              Add New User
            </Button>
          </CardContent>
        </Card>

        {/* System Backup */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              System Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Backup Schedule</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Daily at 2:00 AM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily at 2:00 AM</SelectItem>
                  <SelectItem value="weekly">Weekly on Sunday</SelectItem>
                  <SelectItem value="monthly">Monthly on 1st</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backup-location">Backup Location</Label>
              <Input id="backup-location" placeholder="/backups/" value="/backups/" />
            </div>

            <div className="space-y-2">
              <Label>Last Backup</Label>
              <div className="text-sm text-muted-foreground">
                June 15, 2025 at 2:00 AM (Successful)
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="auto-backup" defaultChecked />
              <Label htmlFor="auto-backup">Enable automatic backups</Label>
            </div>

            <Button variant="outline" className="w-full">
              Create Backup Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-sm text-muted-foreground">System Version</Label>
              <div className="font-medium">Kiwelu v2.1.0</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Database Version</Label>
              <div className="font-medium">MySQL 8.0.34</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Last Updated</Label>
              <div className="font-medium">June 10, 2025</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Server Uptime</Label>
              <div className="font-medium">15 days, 8 hours</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Storage Used</Label>
              <div className="font-medium">2.8 GB / 50 GB</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">License</Label>
              <div className="font-medium">Enterprise License</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;