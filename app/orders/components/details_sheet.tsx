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
  SheetClose,
  SheetContent,
  SheetDescription,
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

const ORDER_STATUSES = {
  PENDING: { label: "Pending", color: "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20" },
  COMPLETED: { label: "Completed", color: "bg-green-500/10 text-green-700 hover:bg-green-500/20" },
  CANCELED: { label: "Canceled", color: "bg-red-500/10 text-red-700 hover:bg-red-500/20" }
} as const;

type OrderStatus = keyof typeof ORDER_STATUSES;

const OrderDetailsAndEditSheet = ({ order,updateOrderDetails }: { order: Orders,updateOrderDetails:any }) => {
  const [isReadOnly, setIsReadOnly] = useState(true);
    const [orderData, setOrderData] = useState<Orders>(order);
    const [sheetController,setSheetControllerState] = useState(false)

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

    const handleSave = () => {
        setIsReadOnly(true)
        setSheetControllerState(false)
    updateOrderDetails(orderData)
  };

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