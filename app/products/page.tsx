"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, MoreVertical, Search, Eye, EyeOff, ArrowUpDown, Package, TrashIcon, Layers2, Edit2, RefreshCcw } from 'lucide-react';

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
import { ConfirmActionDialog } from '../components/confirmActionDialog';
import ProductsServices from '../services/products/productsServices';
import { useToast } from '@/hooks/use-toast';

// consts for easy access
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 300;
const COLUMNS_SPAN = 5;
const LOW_STOCK_THRESHOLD = 10;


// Sub-components for better organization
const ProductImage = ({ url, alt }: { url: string, alt: string }) => {
  //* handle image error
  const [imageUrl, setUrl] = useState(url);

  //* image widget
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
  

//* handle response 
const handleResponseFromBackEnd = (toast:any,response?: { success: boolean, message: string, data?: any }) => {

  if (!response) return;
  // logic
  if (response.success) {
    // success toast 
    toast({
      title: "Completed",
      description: response.message,
    })
  } else {
    // fails toast
    toast({
      variant: "destructive",
      title: "Something went wrong",
      description: response.message,
    })
  }

}

//* pricing tag widget
const ProductTags = ({ tags }: { tags: Product["tags"] }) => (
  <div className="flex gap-2 mt-1">
    {tags && tags.length > 0 && tags.map((tag) => (
      <Badge key={tag.id} variant="outline" className="text-xs">
        {tag.name}
      </Badge>
    ))}
  </div>
);



//* price display widget
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

//* inventory status widget
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

//* loading row widget
const LoadingRow = () => (
  <TableRow>
    <TableCell colSpan={COLUMNS_SPAN}>
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    </TableCell>
  </TableRow>
);

//* empty state widget
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


//* dropdown menu widget for extra actions
const DropDownMenu = ({ productId, productServices, setFilteredProduct ,setTotalProductsCount, fastRefetch,toast}
  : { productId: string, productServices: ProductsServices, setFilteredProduct: any, setTotalProductsCount:any,fastRefetch:any,toast:any }) => {


  // ui tree
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Fast Action</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/products/edit/${productId}`} className='w-full text-left flex justify-start p-0 m-0'>
          <Button variant={"ghost"} className='p-0'>
             <Edit2 />
          Edit Product
          </Button>
          </Link>
         </DropdownMenuItem>
        <DropdownMenuItem asChild>
        <ConfirmActionDialog
            title="Duplicate Product"
            description="Are you sure you want to Duplicate this product?."
            action={() =>
              productServices.duplicateProductInDb({ productId, updateDataTable: fastRefetch }).then((response) => {
                handleResponseFromBackEnd(toast,response)
              })}
            trigger={
              <Button variant={"ghost"} className='w-full text-left flex justify-start border-transparent'>
            <Layers2 />
          Duplicate
          </Button>
            }
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <ConfirmActionDialog
            title="Delete Product"
            description="Are you sure you want to delete this product? This action cannot be undone."
            action={() => {
              productServices.deleteProductFromDb({ productId, setFilteredProducts: setFilteredProduct, setTotalProductsCount })
                .then((response) => handleResponseFromBackEnd(toast,response));
            }}
            trigger={
              <Button
                variant={"outline"} className="text-red-900 w-full text-left  hover:text-red-900">
                <TrashIcon />
                Delete Product
              </Button>
            }
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};




//* main component
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
  const [productsAreInDescOrder, setProductsAreInDescOrder] = useState(true)
  const [isToasted, setIsToasted] = useState(false)

  // instances
  const productsServices = new ProductsServices();

      // hooks
      const { toast } = useToast()
    
  const quickLoadAndReloadForProducts = () => {
    productsServices.loadProducts({
      activePage: 0,
      setProducts,
      setFilteredProducts,
      setTotalProductsCount,
      productsAreInDescOrder,
      setPagesCount,
      setIsLoading
    }).then((response) => {
      if (!isToasted) {
        handleResponseFromBackEnd(toast, response)
        setIsToasted(true)
      }
    });
  }

  useEffect(() => {
    // initial load for products list
    quickLoadAndReloadForProducts()
  }, []);
    
    
  // Handle the search input change and update results
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setActivePageIndex(1)
    setIsLoading(true);
    setSearchQuery(e.target.value);
    productsServices.handleDisplayItemsChange({ newPage: 1, searchQuery: e.target.value, setIsLoading, setProducts, setFilteredProducts, setActivePageIndex, setPagesCount })
      .then((response) => handleResponseFromBackEnd(toast,response));
    };
    
    


  // Handle the product details sheet visibility
  const handleProductDetails = (product: Product): void => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };
  

  // handle order state switch
  const switchOrderState = () => {
    setIsLoading(true)
    setActivePageIndex(1)
    setProductsAreInDescOrder(prev => !prev)
    quickLoadAndReloadForProducts()
  }
    
      // handle item visibility state change
  const handleVisibilityToggle = async (product: Product) => {
    product.isVisible = !product.isVisible;
    const response = await productsServices.editProductStateInDb({ product })
    handleResponseFromBackEnd(toast,response)
    if (!response || !response.success) return;
    const updatedProduct = response.data
    setFilteredProducts(prev => prev.map((item) => item.id == product.id? updatedProduct : item))
    };


  // UI tree
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


            {/* pagination and refresh button */}
            <div className='flex gap-2'>
              {/* refresh button */}
              <Button
                onClick={() => quickLoadAndReloadForProducts()}
                variant="outline"
                size="icon" >
                <RefreshCcw />
              </Button>
            
            {/* pagination widget */}
           {pagesCount > 1 && <div>
              <PaginationWidget
                pagesCount={pagesCount}
                searchQuery={searchQuery}
                activePageIndex={activePageIndex}
                handlePageChange={
                  (newPageIndex: number, searchQuery: string) =>
                    productsServices.handleDisplayItemsChange({ newPage: newPageIndex, searchQuery: searchQuery, setIsLoading, setProducts, setFilteredProducts, setActivePageIndex, setPagesCount })} />
            </div>}
          </div>
          </div>
                  
                  
          {/* Products Table */}
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[400px]">
                    <div className="flex items-center gap-2">
                      Product
                      <Button size={"sm"} variant={"ghost"} onClick={() => switchOrderState()}>
                      <ArrowUpDown
                          className="h-4 w-4 cursor-pointer" />
                        <h1>{ productsAreInDescOrder? "Desc" : "Asc" }</h1>
                      </Button>
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
                  filteredProducts.map((product,index) => (
                    <TableRow key={product.id+index} className="hover:bg-muted/50">
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
                          formatCurrency={productsServices.formatCurrency}
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
                            onCheckedChange={() => handleVisibilityToggle(product)}
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
                          <DropDownMenu
                            productId={product.id}
                            setFilteredProduct={setFilteredProducts}
                            setTotalProductsCount={setTotalProductsCount}
                            fastRefetch={quickLoadAndReloadForProducts}
                            toast={toast}
                            productServices={productsServices} />
                          
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
        formatCurrency={productsServices.formatCurrency}
      />
    </div>
  );
};

export default ProductsPage;

