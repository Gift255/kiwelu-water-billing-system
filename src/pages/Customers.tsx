import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerStats } from "@/components/customers/CustomerStats";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { AddCustomerDialog } from "@/components/customers/AddCustomerDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomers } from "@/hooks/useApiData";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZone, setSelectedZone] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filters = {
    search: searchTerm || undefined,
    zone: selectedZone !== "all" ? selectedZone : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
  };

  const { data: customers, loading, error, refetch } = useCustomers(filters);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
            <p className="text-muted-foreground">
              Manage customer information, meter assignments, and billing details
            </p>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shadow-soft">
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Customer Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
            <p className="text-muted-foreground">
              Manage customer information, meter assignments, and billing details
            </p>
          </div>
          <AddCustomerDialog onSuccess={refetch} />
        </div>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="text-center text-destructive">
              <p>Error loading customers: {error}</p>
              <button onClick={refetch} className="mt-2 text-primary hover:underline">
                Try again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <AddCustomerDialog onSuccess={refetch} />
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

          <CustomerTable customers={customers || []} onUpdate={refetch} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;