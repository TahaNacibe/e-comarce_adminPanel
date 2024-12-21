import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Product } from "../types/pageTypes";
import { Edit, X, Package } from "lucide-react";
import { useState } from "react";

interface ProductsDetailsSheetProps {
  isDetailsOpen: boolean;
  setIsDetailsOpen: (isOpen: boolean) => void;
  selectedProduct: Product | null;
  formatCurrency: (value: number) => string;
}

export default function ProductsDetailsSheet({
  isDetailsOpen,
  setIsDetailsOpen,
  selectedProduct,
  formatCurrency,
}: ProductsDetailsSheetProps) {
  if (!selectedProduct) return null;

  const [bigImageUrl, setBigImageUrl] = useState(selectedProduct.bigImageUrl);

  return (
    <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
      <SheetContent className="sm:max-w-[600px] overflow-y-scroll">
        <SheetHeader>
          <SheetTitle className="text-xl font-medium">Product Details</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            View complete information about the product
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Main Product Image */}
          <div className="relative">
            <Image
              src={bigImageUrl}
              alt={selectedProduct.name}
              width={600}
              height={400}
              onError={(e) => setBigImageUrl("/image_placeholder.jpg")}
              className="w-full rounded-lg object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Small Images with Active State */}
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {selectedProduct.smallImageUrls.map((image, index) => {
              const [smallImageUrl, setSmallImageUrl] = useState(image);
              return (
                <div key={index}>
                {image !== "" && <Image
                  src={smallImageUrl}
                  alt={`${selectedProduct.name} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  onError={(e) => setSmallImageUrl("/image_placeholder.jpg")}
                  className="h-20 w-20 rounded-lg object-cover cursor-pointer border hover:scale-105 transition-transform duration-300"
                />}
            </div>
              )
            })}
          </div>

          {/* Product Name and Description */}
          <div>
            <h3 className="text-2xl font-medium">{selectedProduct.name}</h3>
            <p className="mt-2 text-muted-foreground">{selectedProduct.description}</p>
          </div>

          {/* Price and Inventory */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="border p-4 rounded-lg">
              <Badge>
              <p className="text-sm">Price</p>
              </Badge>
              <p className="font-medium text-lg ">
                {selectedProduct.isInDiscount ? (
                  <>
                    <span className="text-green-600">
                      {formatCurrency(selectedProduct.discountPrice!)}
                    </span>
                    <span className="ml-2 text-sm line-through text-muted-foreground">
                      {formatCurrency(selectedProduct.price)}
                    </span>
                  </>
                ) : (
                  formatCurrency(selectedProduct.price)
                )}
              </p>
            </div>

            {/* Inventory */}
            <div className="p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <Package className="text-indigo-500" size={20} />
                <p className="text-sm font-medium">Inventory</p>
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{selectedProduct.stockCount} in stock</p>
                  <div className="h-2 flex-1 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-indigo-500"
                      style={{
                        width: `${(selectedProduct.stockCount / (selectedProduct.stockCount + selectedProduct.soldCount)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xs text-muted-foreground">{selectedProduct.soldCount} units sold</p>
                  <div className="h-2 flex-1 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-yellow-500"
                      style={{
                        width: `${(selectedProduct.soldCount / (selectedProduct.stockCount + selectedProduct.soldCount)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* properties */}
          {selectedProduct.properties.length > 0 && <div>
            <Badge>
            <p className="text-sm">Properties</p>
            </Badge>
            <div className="mt-2">
              {selectedProduct.properties.map((property, index) => {
                return (
                  <div key={index} className="flex items-center gap-2 pt-1">
                    <Badge>
                      {property.label}
                    </Badge>
                    <div className="flex gap-2">
                      {property.values.split(",").map((value, index) => (
                        <Badge variant={"outline"} key={index}>
                          <h1 key={index} className="text-xs">{value}</h1>
                        </Badge>
                      ))}
                    </div>
                 </div>
               )
             })}
            </div>
          </div>}


          {/* Tags */}
          {selectedProduct.tags.length > 0 && <div>
            <p className="text-sm text-muted-foreground">Tags</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedProduct.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  className="text-xs px-2 py-1"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>}

          {/* Action Buttons with Icons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Edit size={18} />
              Edit Product
            </Button>
            <SheetClose asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <X size={18} />
                Close
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
