import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { 
  Eye, 
  User, 
  MapPin, 
  Package, 
  Calendar,
  Phone,
  Mail,
  Building,
  Hash,
  MapPinned,
  CircleDollarSign,
  ClipboardCheck,
  Edit2,
  Minus,
  Plus
} from "lucide-react";
import { Orders } from '@prisma/client';
import { toast } from '@/hooks/use-toast';

const ORDER_STATUSES = {
  PENDING: { label: "Pending", color: "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20" },
  COMPLETED: { label: "Completed", color: "bg-green-500/10 text-green-700 hover:bg-green-500/20" },
  CANCELED: { label: "Canceled", color: "bg-red-500/10 text-red-700 hover:bg-red-500/20" }
} as const;

type OrderStatus = keyof typeof ORDER_STATUSES;


type product = {
  productId: string;
  productImage: string | null;
  selectedProperties: string[];
  productName: string;
  quantity: number;
  unitePrice: number;
} & {
  productProperties: {
      label: string;
      values: [{value:string,changePrice:boolean,newPrice?:string}];
      selectedValue: string | null;
  }[];
}


const OrderDetailsAndEditSheet = ({ order, updateOrderDetails }: { order: Orders, updateOrderDetails: any }) => {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [orderData, setOrderData] = useState<Orders>(order);
  const [sheetController, setSheetControllerState] = useState(false)

  const handleInputChange = (field: keyof Orders, value: string) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuantityChange = (productIndex: number, increment: boolean) => {
    setOrderData(prev => {
      const newData = { ...prev };
      const products = [...prev.orderMetaData.productsMetaDataList];
      const product = products[productIndex];
      
      if (product) {
        product.quantity = increment ?
          product.quantity + 1 :
          Math.max(1, product.quantity - 1);
        
        // Recalculate total price
        const newTotalPrice = products.reduce(
          (sum, p) => sum + (p.quantity * p.unitePrice),
          0
        );
        
        newData.orderMetaData = {
          ...prev.orderMetaData,
          productsMetaDataList: products,
          totalPrice: newTotalPrice
        };
      }
      
      return newData;
    });
  };
    

  const handleExitEditMode = () => {
    if (!isReadOnly) {
      setOrderData(order)
    }
    setIsReadOnly(!isReadOnly)
  }

  const handleStatusChange = (status: OrderStatus) => {
    setOrderData(prev => ({
      ...prev,
      status
    }));
  };


  const updatePropertiesSelection = ({
    index,
    propertyIndex,
    key,
    newValue,
    productId,
    newPriceChange,
  }: {
    index: number;
    propertyIndex: number;
    key: string;
    newValue: string;
    productId: string;
    newPriceChange?: string;
  }) => {
    // Find the product by index
    const productData = order.orderMetaData.productsMetaDataList[index];
  
  
    // Update the selectedProperties array for the product
    const updatedProperties = productData.selectedProperties.map((property) => {
      // Parse the JSON string into an object
      let propertyObject = JSON.parse(property);
  
      // Check if the value is an object (nested properties like 'value', 'price', etc.)
      if (typeof propertyObject === "string") {
        propertyObject = JSON.parse(propertyObject);
      }
  
      // Check if the key exists in the propertyObject
      if (propertyObject.hasOwnProperty(key)) {
  
        // If the value is an object (like 'value' and 'price'), update it
        if (typeof propertyObject[key] === "object") {
          propertyObject[key].value = newValue;
  
          // If a price change is provided, update price and flag changePrice
          if (newPriceChange) {
            propertyObject[key].price = newPriceChange;
            propertyObject[key].changePrice = true; // Indicate price change
          } else if (propertyObject[key].price) {
            // If there was no price change but a price existed, retain original price
            propertyObject[key].changePrice = false; // No change
          }
        } else {
          // If it's a simple value (like 'color'), update the key directly
          propertyObject[key] = newValue;
        }
      }
  
      // Convert the updated property back to a JSON string
      return JSON.stringify(propertyObject);
    });
  
    // Update the product's selectedProperties
    productData.selectedProperties = updatedProperties;
  
    // Update the product metadata in the products list
    order.orderMetaData.productsMetaDataList[index] = productData;
  
    // Update the order data in state
    setOrderData((prev) => {
      const { orderMetaData, ...rest } = prev;
      return {
        ...rest,
        orderMetaData: {
          ...orderMetaData,
          productsMetaDataList: order.orderMetaData.productsMetaDataList,
        },
      };
    });
  
  };
  
  


    const handleSave = () => {
        setIsReadOnly(true)
        setSheetControllerState(false)
    updateOrderDetails(orderData)
  };


  type Property = {
    value: string | undefined;
    price: string | undefined;
    changePrice: boolean | undefined;
    newPrice: string | undefined;
  };
  

  function restructurePropertiesFromStringArray(selectedProperties: string[]): Record<string, Property> {
    return selectedProperties.reduce<Record<string, Property>>((acc, item) => {
        try {
            let parsedItem: Record<string, any>; // Allowing 'any' for handling mixed types
  
            parsedItem = JSON.parse(item); // First parse
  
            // If the parsedItem is still a string, try parsing it again (this is a safeguard for double parsing)
            if (typeof parsedItem === 'string') {
                parsedItem = JSON.parse(parsedItem); // Second parse if needed
            }
  
  
            // Iterate through each parsed property and merge into the accumulator
            Object.entries(parsedItem).forEach(([key, value]) => {
  
                // Normalize the key to lowercase
                const normalizedKey = key.toLowerCase(); 
  
                // If the key already exists in the accumulator
                if (acc[normalizedKey]) {
                    acc[normalizedKey] = {
                        value: value,  // Directly assign value (since we no longer use nested value objects)
                        price: parsedItem.price || acc[normalizedKey].price, // If a price exists, use it
                        changePrice: parsedItem.price ? true : false, // Set changePrice to true if price exists
                        newPrice: parsedItem.newPrice || acc[normalizedKey].newPrice, // Keep existing newPrice if not provided
                    };
                } else {
                    // Add the new key-value pair
                    acc[normalizedKey] = {
                        value: value,
                        price: parsedItem.price || undefined, // Set price if available
                        changePrice: parsedItem.price ? true : false, // If price exists, set changePrice to true
                        newPrice: parsedItem.newPrice || undefined, // Set newPrice if available
                    };
                }
            });
        } catch (error) {
            // Handle JSON parse errors
            toast({
                title: `Failed to parse JSON string: "${item}"`,
                description: `${error}`,
            });
        }
  
        return acc;
    }, {});
  }
  
  




  const PropertiesWidget = ({ product,productIndex }: { product: product,productIndex:number }) => {
    if (isReadOnly) {
      return (
        <div className='flex gap-1 p-1'>
         {product.selectedProperties.map((item, productIndex) => {
           let property = JSON.parse(item); // Parse the JSON string once
           if (typeof property === "string") {
             property = JSON.parse(property)
           }
           const value = Object.values(property)[0]
  return (
    <div key={productIndex} className="flex gap-1">
      <Badge variant={"outline"} className="py-1">
        {value}{" "}
        {property.price && `+${property.price} Dzd`}
      </Badge>
    </div>
  );
})}

          

                        </div>
      )
    } else {
      const selectedProperties = restructurePropertiesFromStringArray(product.selectedProperties);

return (
  <div className="">
  {product.productProperties.map((property, index) => {
    const valuesList = property.values; // Values available for the property

    return (
      <div key={index} className="py-1 flex gap-1">
        <Badge>{property.label}</Badge>
        <div className="grid grid-cols-2 gap-1">
          {valuesList.map((value, valueIndex) => {
            // Check if the current value is selected for this property
            const isSelected = selectedProperties[property.label.toLowerCase()]?.value === value.value;

            return (
              <Button
                key={valueIndex}
                onClick={() =>
                  updatePropertiesSelection({
                    index: productIndex,
                    propertyIndex: index,
                    key: property.label,
                    productId: product.productId,
                    newValue: value.value,
                    newPriceChange: value.newPrice,
                  })
                }
                variant={isSelected ? "default" : "outline"}
              >
                {value.value} {value.changePrice ? `+${value.newPrice} Dzd` : ""}
              </Button>
            );
          })}
        </div>
      </div>
    );
  })}
</div>

);

      

    }
  }




  return (
    <Sheet open={sheetController} onOpenChange={(state) => setSheetControllerState(state)}>
      <SheetTrigger asChild>
        <Button variant="outline" className='w-full mb-1'>
          <Eye className="h-4 w-4" />
          Details
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className='py-4'>
          <SheetTitle>Order Details</SheetTitle>
          <Button
            variant={isReadOnly ? "default" : "outline"}
            onClick={() => handleExitEditMode()}
            className="w-fit px-6 my-1"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            {isReadOnly ? "Edit Order Details" : "Exit Edit Mode"}
          </Button>
        </SheetHeader>
        <div className="space-y-8 pr-2">
          {/* Header Section */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Order #{orderData?.id?.slice(-6)}
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(orderData?.createdAt).toLocaleString()}
                </div>
              </div>
              <Badge variant="outline" className={ORDER_STATUSES[orderData?.status as OrderStatus]?.color}>
                {ORDER_STATUSES[orderData?.status as OrderStatus]?.label}
              </Badge>
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <Card className="border-0 shadow-none">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  Customer Details
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={orderData?.name}
                      className={isReadOnly ? "shadow-none" : ""}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Name"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={orderData?.email}
                      className={isReadOnly ? "shadow-none" : ""}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Email"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={orderData?.phoneNumber}
                      className={isReadOnly ? "shadow-none" : ""}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Phone"
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border-0 shadow-none">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPinned className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={orderData?.address}
                      className={isReadOnly ? "shadow-none" : ""}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Address"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={orderData?.houseNumber}
                      className={isReadOnly ? "shadow-none" : ""}
                      onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                      placeholder="House Number"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={orderData?.city}
                      className={isReadOnly ? "shadow-none" : ""}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={orderData?.postalCode}
                      className={isReadOnly ? "shadow-none" : ""}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="Postal Code"
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4" />
              Order Items
            </div>
            <div className="space-y-4">
              {orderData?.orderMetaData?.productsMetaDataList?.map((product, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-muted/40">
                  {product.productImage && (
                    <img 
                      src={product.productImage} 
                      alt={product.productName}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{product.productName}</h4>
                    <div className="text-sm text-muted-foreground mt-1">
                      <div className="flex items-center justify-between">
                        <Button
                          size="sm"
                          className="rounded-lg"
                          variant="outline"
                          onClick={() => handleQuantityChange(index, false)}
                          disabled={isReadOnly || product.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>Qty: {product.quantity}</span>
                        <Button
                          size="sm"
                          className="rounded-lg"
                          variant="outline"
                          onClick={() => handleQuantityChange(index, true)}
                          disabled={isReadOnly}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <span>{orderData?.orderMetaData?.currency} {product.unitePrice.toFixed(2)}</span>
                      </div>
                      {/* product properties */}
                      <div className='flex gap-1 p-1'>
                        <PropertiesWidget product={product as any} productIndex={index}/>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {orderData?.orderMetaData?.currency} {(product.quantity * product.unitePrice).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Total */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 font-medium">
                <CircleDollarSign className="h-4 w-4" />
                Total Amount
              </div>
              <div className="text-lg font-semibold">
                {orderData?.orderMetaData?.currency} {orderData?.orderMetaData?.totalPrice.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ClipboardCheck className="h-4 w-4" />
              Order Status
            </div>
            <Select 
              value={orderData?.status} 
              onValueChange={(value: OrderStatus) => handleStatusChange(value)}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ORDER_STATUSES).map(([value, { label, color }]) => (
                  <SelectItem key={value} value={value}>
                    <Badge variant="outline" className={color}>
                      {label}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Save Button */}
          <SheetFooter>
            <Button 
              className="w-full" 
              onClick={handleSave}
              disabled={isReadOnly}
            >
              Save Changes
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsAndEditSheet;