import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, Edit, Trash2, Eye, Download, ArrowUpDown, 
   PackageCheck, PackageSearch, PackageX, User2, 
  Calendar, Smartphone, CircleCheck, Package, ReceiptEuro, 
  Loader2
} from "lucide-react";
import { Orders } from '@prisma/client';

// Define the possible order status types
type OrderStatus = "PENDING" | "COMPLETED" | "CANCELED";

// Props interface for the OrdersTable component
interface OrdersTableProps {
  ordersList: Orders[];
  isDataLoading:boolean
}

// Type definition for sorting configuration
interface SortConfig {
  key: keyof Orders | null;
  direction: 'asc' | 'desc';
}



// Centralized configuration for order status styling and icons
// This makes it easier to maintain and update status-related UI elements
const statusConfig = {
  PENDING: {
    className: "border-orange-200 text-orange-700 bg-orange-50 p-1",
    icon: PackageSearch
  },
  COMPLETED: {
    className: "border-indigo-200 text-indigo-700 bg-indigo-50 p-1",
    icon: PackageCheck
  },
  CANCELED: {
    className: "border-gray-200 text-gray-700 bg-gray-50 p-1",
    icon: PackageX
  }
} as const;




/**
 * Formats a date into a readable string format (DD MMM, YYYY)
 * @param date - Date to format
 * @returns Formatted date string
 */
const formatDate = (date: Date | string): string => {
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, "0");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  
  return `${day} ${month}, ${year}`;
};




/**
 * OrdersTable Component
 * Displays a table of orders with sorting, selection, and action capabilities
 */
export default function OrdersTable({ ordersList,isDataLoading }: OrdersTableProps) {
  // State for tracking selected orders
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  // State for tracking current sort configuration
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const selectedCount = selectedOrders.size;

    
    
  // Helper functions for status badge styling and icons
  const getStatusBadgeVariant = (status: OrderStatus) => statusConfig[status].className;
  const GetStatusBadgeIcon = (status: OrderStatus) => statusConfig[status].icon;

    
    
    
  /**
   * Toggles selection of all orders
   * If all are selected, deselects all. If some or none are selected, selects all.
   */
  const toggleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.size === ordersList.length 
        ? new Set() 
        : new Set(ordersList.map(order => order.id))
    );
  };

    
    
    
  /**
   * Toggles selection of a single order
   * @param orderId - ID of the order to toggle
   */
  const toggleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    newSelected.has(orderId) ? newSelected.delete(orderId) : newSelected.add(orderId);
    setSelectedOrders(newSelected);
  };

    
    
    
  /**
   * Handles sorting when a column header is clicked
   * @param key - The column key to sort by
   */
  const handleSort = (key: keyof Orders) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

    
    
    
  /**
   * Renders a column header button with sort functionality
   * @param label - Button label
   * @param icon - Icon component to display
   * @param sortKey - Key to sort by when clicked
   */
  const renderHeaderButton = (label: string, icon: React.ReactNode, sortKey: keyof Orders) => (
    <Button 
      variant="ghost" 
      className="font-medium p-0 h-auto" 
      onClick={() => handleSort(sortKey)}
    >
      {icon}
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  /**
   * Formats a currency amount according to locale and currency code
   * @param amount - Amount to format
   * @param currency - Currency code (default: DZD)
   */
  const formatCurrency = (amount: number, currency: string = 'DZD') => {
    return new Intl.NumberFormat("en-DZ", {
      style: "currency",
      currency
    }).format(amount);
  };
  
  if (isDataLoading) {
    return <div className='flex items-center justify-center h-screen'>
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  }

  return (
    <div className="space-y-4 bg-gray-50">
      {/* Selection toolbar - Only shows when items are selected */}
      {selectedCount > 0 && (
        <div className="bg-gray-50 px-4 py-2 rounded-md flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedCount} order{selectedCount > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Main orders table */}
      <Table className="bg-background">
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-gray-50">
            {/* Checkbox column for bulk selection */}
            <TableHead className="w-[50px]">
              <Checkbox
                className="border-gray-400 shadow-none"
                checked={selectedOrders.size === ordersList.length}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            {/* Sortable columns */}
            <TableHead>{renderHeaderButton("Customer", <User2 />, 'name')}</TableHead>
            <TableHead>{renderHeaderButton("Date", <Calendar />, 'createdAt')}</TableHead>
            {/* Regular columns */}
            <TableHead>
              <div className="flex gap-1">
                <Smartphone size={18} />
                Phone
              </div>
            </TableHead>
            <TableHead>
              <div className="flex gap-1">
                <CircleCheck size={18} />
                Verified
              </div>
            </TableHead>
            <TableHead>
              <div className="flex gap-1">
                <Package size={18} />
                Items
              </div>
            </TableHead>
            <TableHead>
              <div className="flex gap-1">
                <PackageSearch size={18} />
                Status
              </div>
            </TableHead>
            <TableHead>
              <div className="flex gap-1 justify-end">
                <ReceiptEuro size={18} />
                Total
              </div>
            </TableHead>
            <TableHead className="w-[70px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Map through orders and render each row */}
          {ordersList.map((order) => (
            <TableRow key={order.id} className="hover:bg-gray-400/5">
              {/* Selection checkbox */}
              <TableCell>
                <Checkbox
                  className="border-gray-400 shadow-none"
                  checked={selectedOrders.has(order.id)}
                  onCheckedChange={() => toggleOrderSelection(order.id)}
                />
              </TableCell>
              {/* Customer information */}
              <TableCell>
                <div className="font-medium">{order.name}</div>
                <div className="text-xs text-muted-foreground">{order.email}</div>
              </TableCell>
              {/* Order date */}
              <TableCell className="text-muted-foreground font-semibold text-sm">
                {formatDate(order.createdAt)}
              </TableCell>
              {/* Phone number */}
              <TableCell>
                <div className="font-medium text-sm">{order.phoneNumber}</div>
              </TableCell>
              {/* Verification status */}
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={`${order.verified ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-red-50 text-red-700 border-red-200"} flex gap-1 w-fit`}
                >
                  <div className={`rounded-full w-2 h-2 ${order.verified ? "bg-blue-700" : "bg-red-700"}`} />
                  {order.verified ? "Verified" : "Not Verified"}
                </Badge>
              </TableCell>
              {/* Number of items */}
              <TableCell>
                <Badge variant="secondary">
                  {order.orderMetaData.productsMetaDataList.length} {
                    order.orderMetaData.productsMetaDataList.length > 1 ? "items" : "item"
                  }
                </Badge>
              </TableCell>
              {/* Order status */}
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={`${getStatusBadgeVariant(order.status as OrderStatus)} flex gap-1 w-fit rounded-lg text-xs`}
                >
                  {React.createElement(GetStatusBadgeIcon(order.status as OrderStatus), { size: 18 })}
                  {order.status.toLowerCase()}
                </Badge>
              </TableCell>
              {/* Order total */}
              <TableCell className="text-right font-semibold">
                {formatCurrency(
                  order.orderMetaData?.totalPrice || 0,
                  order.orderMetaData?.currency
                )}
              </TableCell>
              {/* Action dropdown menu */}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Order
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}