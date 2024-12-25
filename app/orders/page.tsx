"use client"
import { Orders } from "@prisma/client";
import { useEffect, useState } from "react";
import OrderServices from "../services/orders-services/orders-services";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ExternalLink,
  File,
  Loader2,
  Search,
  RefreshCcw,
  Download,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "./components/date_picker";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DetailsForOrders from "./components/details_section";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import OrdersTable from "./components/table";
import PaginationWidget from "../components/pagination_widget";
import { useDebounce } from "use-debounce"; // Import use-debounce

export default function OrdersPage() {
  //* Data state variables
  const [ordersList, setOrdersList] = useState<Orders[]>([]);
  const [formData, setFormData] = useState({
    totalItem: 0,
    completedOrders: 0,
    pendingOrders: 0,
    canceledOrders: 0,
    totalVerifiedItems: 0,
    totalUnVerifiedItems: 0,
  });
  const [activePageIndex, setActivePageIndex] = useState(1);
  const [totalPagesCount, setTotalPagesCount] = useState(1);

  //* Search and filter state variables
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKey, setFilterKey] = useState("All");

  //* Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isToasted, setIsToasted] = useState(false);

  //* Instances
  const ordersServices = new OrderServices();

  //* Hooks
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  //* Constants
  const FILTERS_KEYS = ["All", "Completed", "Pending", "Canceled", "Verified", "UnVerified"];

  //* Debounce search query to avoid too many requests while typing
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500); // Delay input changes by 500ms

  //* Update state with response data
  const updateVars = (response: any) => {
    setTotalPagesCount(response.data.pagesCount);
    setOrdersList(response.data.data);

    setFormData({
      totalItem: response.data.totalItems,
      completedOrders: response.data.totalCompletedOrders,
      pendingOrders: response.data.totalPendingOrders,
      canceledOrders: response.data.totalCanceledOrders,
      totalVerifiedItems: response.data.totalVerifiedOrders,
      totalUnVerifiedItems: response.data.totalUnverifiedOrders,
    });
  };

  //* Load orders list with the current page index, search query, and filter
  async function loadOrdersList({
    pageIndex,
      searchQuery,
    isAutoReload = false
  }: {
    pageIndex: number;
          searchQuery?: string | null;
          isAutoReload?:boolean
  }) {
    if (!session) return;

    if (session.user.role !== "ADMIN" && session.user.role !== "SUB_ADMIN") {
      router.push("/unauthorized-access");
      return;
    }

      if (!isAutoReload) {
          setIsDataLoading(true)
          setActivePageIndex(pageIndex);
    }

    const response = await ordersServices.getOrdersListFromDb(pageIndex, searchQuery, filterKey);

    if (response.success) {
      if (!isToasted) {
        toast({
          title: response.message,
          description: `Total of ${response.data.data.length}`,
        });
        setIsToasted(true);
      }

      updateVars(response);
    } else {
      toast({
        title: response.message,
        description: response.data,
      });
    }
    setIsLoading(false);
    setIsDataLoading(false);
  }

  //* Initial data load on page load
  useEffect(() => {
      loadOrdersList({ pageIndex: 1 });
      
      const intervalId = setInterval(() => {
          loadOrdersList({ pageIndex: activePageIndex,isAutoReload:true })
          console.log("refetch...")
      }, 60000) // Poll every 1 minute (60000ms)
        // Clear interval on component unmount
        return () => clearInterval(intervalId) 
      
      
      
      
    //    // Listen to new orders via SSE
    // const eventSource = new EventSource("/api/sse")

    // eventSource.onmessage = (event) => {
    //   const newOrder = JSON.parse(event.data) as Orders
    //   setOrdersList((prevOrders) => [newOrder, ...prevOrders]) // Add new order to the top
    // }

    // eventSource.onerror = (error) => {
    //   console.error("SSE error:", error)
    //   eventSource.close()
    // }

    // // Cleanup when component unmounts
    // return () => {
    //   eventSource.close()
    // }
  }, [session, filterKey]); // Re-run when session or filterKey changes

  //* Handle search input change and update data accordingly
  useEffect(() => {
      loadOrdersList({ pageIndex: 1, searchQuery: debouncedSearchQuery});
  }, [debouncedSearchQuery]); // This effect runs when the debounced search query changes

  //* Loading state widget
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  //* Manage the page data change (pagination, etc.)
  const handleDisplayedDataChanged = async ({
    pageIndex,
    searchQuery,
  }: {
    pageIndex: number;
    searchQuery: string;
      }) => {
      
    await loadOrdersList({ pageIndex: pageIndex, searchQuery: searchQuery });
    setActivePageIndex(pageIndex);
  };

  return (
    <Card className="min-h-screen rounded-none border-0">
      <CardHeader className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-2xl font-medium">Orders Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Export All
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <File className="w-4 h-4" />
                  Save all as
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Save as PDF</DropdownMenuItem>
                <DropdownMenuItem>Save as JSON</DropdownMenuItem>
                <DropdownMenuItem>Save as Text</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="text-lg">Overview</Badge>
          </div>
          <div className="border rounded-lg">
            <DetailsForOrders formData={formData} />
          </div>
        </div>
      </CardHeader>

      <div className="flex items-center gap-2 px-6 py-4">
        <Badge className="text-lg">Orders</Badge>
      </div>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          {/* Search bar */}
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-9 w-[250px] shadow-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query directly
              />
            </div>
            {/* Refresh button */}
            <Button
              variant={"outline"}
              className=" px-2 shadow-none"
              onClick={() => {
                setIsDataLoading(true);
                loadOrdersList({ pageIndex: activePageIndex });
              }}
            >
              <RefreshCcw className="w-3 h-3 mr-1" />
            </Button>
            {/* Filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 shadow-none">
                  <Filter className="w-4 h-4" />
                  {filterKey}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {FILTERS_KEYS.map((key) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setFilterKey(key)}
                    className={filterKey === key ? "bg-secondary" : ""}
                  >
                    {key}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Pagination */}
          <div>
            {totalPagesCount > 1 && (
              <PaginationWidget
              activePageIndex={activePageIndex}
              handlePageChange={(pageIndex:number, searchParams:string) => handleDisplayedDataChanged({pageIndex,searchQuery:searchParams})}
                pagesCount={totalPagesCount}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </div>

        {/* Orders table */}
        <OrdersTable
          ordersList={ordersList}
          isDataLoading={isDataLoading}
        />
      </CardContent>
    </Card>
  );
}
