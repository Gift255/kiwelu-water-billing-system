import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerStats } from "@/components/customers/CustomerStats";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { customers, filterCustomers } from "@/data/customerData";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const filteredCustomers = filterCustomers(customers, searchTerm, selectedZone, selectedStatus);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
          <p className="text-muted-foreground">
            Manage customer information, meter assignments, and billing details
          </p>
        </div>
        <Button className="bg-gradient-primary shadow-medium">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <CustomerStats />

      {/* Filters and Search */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerFilters
            searchTerm={searchTerm}
            selectedZone={selectedZone}
            selectedStatus={selectedStatus}
            onSearchChange={setSearchTerm}
            onZoneChange={setSelectedZone}
            onStatusChange={setSelectedStatus}
          />

          <CustomerTable customers={filteredCustomers} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;