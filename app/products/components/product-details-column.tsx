import { ChangeEvent } from "react";
import { FormErrors } from "../types/pageTypes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";


    // Product column details interface
  interface ProductDetailsProps {
    productTitle: string;
    productDescription: string;
    productPrice: string;
    isProductInDiscount: boolean;
    discountPrice: string;
    productCount: string;
    isProductUnlimited: boolean;
    onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onPriceChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onDiscountToggle: (checked: boolean) => void;
    onDiscountPriceChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onUnlimitedToggle: (checked: boolean) => void;
    onCountChange: (e: ChangeEvent<HTMLInputElement>) => void;
    errors: FormErrors;
  }
  

  //* ProductDetails component
  export function ProductDetails({
    productTitle,
    productDescription,
    productPrice,
    isProductInDiscount,
    discountPrice,
    productCount,
    isProductUnlimited,
    onTitleChange,
    onDescriptionChange,
    onPriceChange,
    onDiscountToggle,
    onDiscountPriceChange,
    onUnlimitedToggle,
    onCountChange,
    errors,
  }: ProductDetailsProps){
    return (
      <div className="space-y-6">
            <div>
                {/* title */}
          <Label htmlFor="title">
            Product Title {errors.title && <span className="text-red-500 text-sm">({errors.title})</span>}
          </Label>
          <Input
            id="title"
            value={productTitle}
            onChange={onTitleChange}
            placeholder="Enter product title"
            className={errors.title ? "border-red-500" : ""}
          />
        </div>
  
        {/* description */}
        <div>
          <Label htmlFor="description">
            Product Description {errors.description && <span className="text-red-500 text-sm">({errors.description})</span>}
          </Label>
          <Textarea
            id="description"
            value={productDescription}
            onChange={onDescriptionChange}
            placeholder="Enter product description"
            rows={4}
            className={errors.description ? "border-red-500" : ""}
          />
            </div>
            
            {/* price */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="price">
              Price {errors.price && <span className="text-red-500 text-sm">({errors.price})</span>}
            </Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={productPrice}
              onChange={onPriceChange}
              className={errors.price ? "border-red-500" : ""}
            />
                </div>
                
                {/* discount */}
          <div className="flex items-center space-x-2">
            <Switch
              id="discount"
              checked={isProductInDiscount}
              onCheckedChange={onDiscountToggle}
            />
            <Label htmlFor="discount">Apply Discount</Label>
          </div>
  
            {/* discount price field */}
          {isProductInDiscount && (
            <div>
              <Label htmlFor="discountPrice">Discount Price</Label>
              <Input
                id="discountPrice"
                type="number"
                min="0"
                step="0.01"
                value={discountPrice}
                onChange={onDiscountPriceChange}
              />
            </div>
          )}
        </div>
  
            {/* stock count and unlimited switch*/}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="unlimited"
              checked={isProductUnlimited}
              onCheckedChange={onUnlimitedToggle}
            />
            <Label htmlFor="unlimited">Unlimited Stock</Label>
          </div>
  
          {!isProductUnlimited && (
            <div>
              <Label htmlFor="count">Stock Count</Label>
              <Input
                id="count"
                type="number"
                min="0"
                value={productCount}
                onChange={onCountChange}
              />
            </div>
          )}
        </div>
      </div>
    );
  }