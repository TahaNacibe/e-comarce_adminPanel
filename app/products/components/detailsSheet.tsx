import React, { useState } from 'react';
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
import { Edit, X, Package, ImageOff } from "lucide-react";
import Link from 'next/link';

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

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [mainImageFailed, setMainImageFailed] = useState(false);

  const handleImageError = (index: number) => {
    setFailedImages(prev => new Set([...prev, index]));
  };

  const handleMainImageError = () => {
    setMainImageFailed(true);
  };

  const ImagePlaceholder = () => (
    <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
      <div className="flex flex-col items-center text-gray-400">
        <ImageOff size={48} />
        <span className="mt-2 text-sm">Image not available</span>
      </div>
    </div>
  );

  return (
    <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">Product Details</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            View complete information about the product
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Main Product Image */}
          <div className="relative aspect-video bg-gray-50 rounded-lg overflow-hidden">
            {mainImageFailed ? (
              <ImagePlaceholder />
            ) : (
              <Image
                src={selectedProduct.bigImageUrl || selectedProduct.bigImageUrl}
                alt={selectedProduct.name}
                fill
                onError={() => handleMainImageError}
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>

          {/* Thumbnail Gallery */}
          {selectedProduct.smallImageUrls.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {selectedProduct.smallImageUrls.map((image, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                    activeImageIndex === index ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => !failedImages.has(index) && setActiveImageIndex(index)}
                >
                  {failedImages.has(index) ? (
                    <ImagePlaceholder />
                  ) : (
                    <Image
                      src={image}
                      alt={`${selectedProduct.name} thumbnail ${index + 1}`}
                      fill
                      onError={() => handleImageError(index)}
                      className={`object-cover transition-opacity duration-300 ${
                        failedImages.has(index) ? 'opacity-50' : 'hover:opacity-80'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-semibold">{selectedProduct.name}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
            </div>

            {/* Price and Inventory Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <Badge variant="secondary" className="mb-2">Price</Badge>
                <div className="space-y-1">
                  {selectedProduct.isInDiscount ? (
                    <>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(selectedProduct.discountPrice!)}
                      </p>
                      <p className="text-sm line-through text-muted-foreground">
                        {formatCurrency(selectedProduct.price)}
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl font-bold">{formatCurrency(selectedProduct.price)}</p>
                  )}
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="text-primary" size={18} />
                  <Badge variant="secondary">Inventory</Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>In Stock</span>
                      <span className="font-medium">{selectedProduct.stockCount}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{
                          width: `${(selectedProduct.stockCount / (selectedProduct.stockCount + selectedProduct.soldCount)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sold</span>
                      <span className="font-medium">{selectedProduct.soldCount}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-yellow-500 transition-all"
                        style={{
                          width: `${(selectedProduct.soldCount / (selectedProduct.stockCount + selectedProduct.soldCount)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties */}
            {selectedProduct.properties.length > 0 && (
              <div className="rounded-lg border p-4">
                <Badge variant="secondary" className="mb-3">Properties</Badge>
                <div className="space-y-2">
                  {selectedProduct.properties.map((property, index) => (
                    <div key={index} className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="font-medium">
                        {property.label}
                      </Badge>
                      <div className="flex flex-wrap gap-2">
                        {property.values.split(",").map((value, valueIndex) => (
                          <Badge variant="secondary" key={valueIndex} className="text-xs">
                            {value.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {selectedProduct.tags.length > 0 && (
              <div className="rounded-lg border p-4">
                <Badge variant="secondary" className="mb-3">Tags</Badge>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Link href={`/products/edit/${selectedProduct.id}`}>
            <Button variant="default" className="flex items-center gap-2">
              <Edit size={18} />
              Edit Product
            </Button>
            </Link>
            <SheetClose asChild>
              <Button variant="outline" className="flex items-center gap-2">
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