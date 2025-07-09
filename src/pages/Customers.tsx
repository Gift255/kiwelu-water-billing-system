
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerStats } from "@/components/customers/CustomerStats";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { AddCustomerDialog } from "@/components/customers/AddCustomerDialog";
import { useCustomers } from "@/hooks/useDataStore";
import { Customer } from "@/data/globalData";

const Customers = () => {
  const customers = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZone, setSelectedZone] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filterCustomers = (
    customers: Customer[], 
    searchTerm: string, 
    selectedZone: string, 
    selectedStatus: string
  ) => {
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm) ||
                           customer.meterId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesZone = selectedZone === "all" || !selectedZone || customer.zone === selectedZone;
      const matchesStatus = selectedStatus === "all" || !selectedStatus || customer.status === selectedStatus;
      
      return matchesSearch && matchesZone && matchesStatus;
    });
  };

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
        <AddCustomerDialog />
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
