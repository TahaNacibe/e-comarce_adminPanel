"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, MoreVertical, Search, Eye, EyeOff, ArrowUpDown, Package } from 'lucide-react';

// UI Components
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

// Custom Components
import ProductsDetailsSheet from './components/detailsSheet';
import { Product } from './types/pageTypes';
import PaginationWidget from '../components/pagination_widget';

// consts for easy access
const IMAGE_WIDTH = 48;
const IMAGE_HEIGHT = 48;
const COLUMNS_SPAN = 5;
const LOW_STOCK_THRESHOLD = 10;


// Sub-components for better organization
const ProductImage = ({ url, alt }: { url: string, alt: string }) => {
  const [imageUrl, setUrl] = useState(url);

  return (
    <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted">
    <Image
      src={imageUrl}
      alt={alt}
      width={IMAGE_WIDTH}
      height={IMAGE_HEIGHT}
      onError={(e) => setUrl("/image_placeholder.jpg")}
      className="object-cover h-full w-full"
    />
  </div>
  )
}
  
const ProductTags = ({tags}:{tags:Product["tags"]}) =>(
  <div className="flex gap-2 mt-1">
    {tags.map((tag) => (
      <Badge key={tag.id} variant="outline" className="text-xs">
        {tag.name}
      </Badge>
    ))}
  </div>
);


const PriceDisplay = ({ price, discountPrice, isInDiscount, formatCurrency }
    : { price: number, discountPrice?: number, isInDiscount: boolean, formatCurrency: (amount: number) => string }) => (
  <div className="flex flex-col">
    {isInDiscount && discountPrice ? (
      <>
        <span className="text-sm line-through text-muted-foreground">
          {formatCurrency(price)}
        </span>
        <span className="text-green-600 font-medium">
          {formatCurrency(discountPrice)}
        </span>
      </>
    ) : (
      <span className="font-medium">{formatCurrency(price)}</span>
    )}
  </div>
);

const InventoryStatus = ({ stockCount, soldCount }: { stockCount: number; soldCount: number }) => {
    
  //* getStatusBadge function return the stock case badge
  const getStatusBadge = (count: number) => {
    if (count === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (count < LOW_STOCK_THRESHOLD) return <Badge variant="destructive">Low Stock</Badge>;
    return <Badge>In Stock</Badge>;
  };

  //* ui tree
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="font-medium">{stockCount}</span>
        {getStatusBadge(stockCount)}
      </div>
      <span className="text-xs text-muted-foreground">
        {soldCount} sold
      </span>
    </div>
  );
};

const LoadingRow = () => (
  <TableRow>
    <TableCell colSpan={COLUMNS_SPAN}>
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    </TableCell>
  </TableRow>
);

const EmptyState = () => (
  <TableRow>
    <TableCell colSpan={COLUMNS_SPAN}>
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">No products found</p>
        <Button variant="outline" className="mt-4">
          Add your first product
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

const ProductsPage = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<Product[]>([]);
const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [pagesCount, setPagesCount] = useState(0)
  const [activePageIndex, setActivePageIndex] = useState(1)
  const [totalProductsCount, setTotalProductsCount] = useState(0)


  // Effects
  const loadProducts = async ({activePage}:{activePage:number}) => {
      try {
        const response = await  fetch(`/api/products?activePage=${activePage}`)
        if (response.ok) {
            const data = await response.json()
            setProducts(data.message); 
          setFilteredProducts(data.message);
          setTotalProductsCount(data.totalProductsCount);
            setPagesCount(data.totalPages)
        }
        
        // update loading state
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load products:', error);
      setIsLoading(false);
    }
    };


    // fetch the data corresponding to the new page
      const handleDisplayItemsChange = async (newPage: number,searchQuery: string | null = null) => {
          try {
            setIsLoading(true);
            const response = await fetch(`/api/products?page=${newPage}&searchQuery=${searchQuery}`);
            if (response.ok) {
              const data = await response.json();
                setProducts(data.message);
                setFilteredProducts(data.message);
                setActivePageIndex(data.currentPage);
                setPagesCount(data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
              setIsLoading(false);
        }
    };
    
    

  useEffect(() => {
    loadProducts({activePage:0});
  }, []);
    
    
  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setActivePageIndex(1)
    setIsLoading(true);
    setSearchQuery(e.target.value);
     handleDisplayItemsChange(1, e.target.value);
    };
    


  const handleVisibilityToggle = (productId: string, currentState: boolean): void => {
    // In real app, would call API
    console.log(`Toggling visibility for product ${productId}`);
    };
    



  const handleProductDetails = (product: Product): void => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
    };
    



  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: 'currency',
      currency: 'DZD'
    }).format(amount);
    };
    



  return (
    <div className=" mx-auto">
      <Card className="border-transparent shadow-sm h-screen">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Package />
                Products</CardTitle>
              <CardDescription className="mt-2 text-xs">
                Manage your product inventory, prices, and visibility.
              </CardDescription>
            </div>
            <Link href="/products/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </CardHeader>

              

        <CardContent>
          {/* Search Bar */}
          <div className="mb-6 flex justify-between">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shadow-sm" />
              <Input
                placeholder="Search products..."
                className="pl-10 max-w-md"
                value={searchQuery}
                onChange={handleSearchChange}
              />
                      </div>
           
                     
          </div>
          {/* a section title */}
          <div className='flex justify-between  pb-2'>
          <div className="flex items-center gap-2">
            <h3 className="text-medium font-light">All Products</h3>
            <Badge variant={"outline"}>{totalProductsCount}</Badge>
            </div>
             {/* pagination */}
           {pagesCount > 1 && <div>
              <PaginationWidget
                pagesCount={pagesCount}
                searchQuery={searchQuery}
                activePageIndex={activePageIndex}
                handlePageChange={handleDisplayItemsChange} />
            </div>}
          </div>
                  
                  
          {/* Products Table */}
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[400px]">
                    <div className="flex items-center gap-2">
                      Product
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
                              

                {isLoading ? (
                  <LoadingRow />
                ) : filteredProducts.length === 0 ? (
                  <EmptyState />
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <ProductImage url={product.bigImageUrl} alt={product.name} />
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{product.name}</span>
                            <ProductTags tags={product.tags} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <PriceDisplay
                          price={product.price}
                          discountPrice={product.discountPrice}
                          isInDiscount={product.isInDiscount}
                          formatCurrency={formatCurrency}
                        />
                      </TableCell>
                      <TableCell>
                        <InventoryStatus
                          stockCount={product.stockCount}
                          soldCount={product.soldCount}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {product.isVisible ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                          <Switch
                            checked={product.isVisible}
                            onCheckedChange={() => handleVisibilityToggle(product.id, product.isVisible)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleProductDetails(product)}
                          >
                            Details
                                  </Button>
                                  
                          {/* Dropdown Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit Product</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                Delete Product
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    {/* Product Details Sheet */}
      <ProductsDetailsSheet
        isDetailsOpen={isDetailsOpen}
        setIsDetailsOpen={setIsDetailsOpen}
        selectedProduct={selectedProduct!}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default ProductsPage;

