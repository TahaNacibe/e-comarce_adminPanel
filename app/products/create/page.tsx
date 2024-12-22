"use client"
  // components/ImageUploadSection.tsx
  import { ChangeEvent, FormEvent, useState } from "react";
  import { ImagePlus, Plus } from "lucide-react";
    import { Label } from "@/components/ui/label";
    // components/CategorySelector.tsx
    import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
    import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
    import { Button } from "@/components/ui/button";
    import { Search, X } from "lucide-react";
    import { Category } from "../types/pageTypes";
  import { FormErrors } from "../types/pageTypes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
  



  interface ImageUploadProps {
    bigImage: string | null;
    smallImages: string[];
    onBigImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSmallImageAdd: (e: ChangeEvent<HTMLInputElement>) => void;
    onRemoveBigImage: () => void;
    onRemoveSmallImage: (index: number) => void;
    errors: FormErrors;
  }
  
  export function ImageUploadSection({
    bigImage,
    smallImages,
    onBigImageChange,
    onSmallImageAdd,
    onRemoveBigImage,
    onRemoveSmallImage,
    errors,
  }: ImageUploadProps){
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Main Image {errors.bigImage && <span className="text-red-500 text-sm">({errors.bigImage})</span>}</Label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            {bigImage ? (
              <div className="relative">
                <img src={bigImage} alt="Main product" className="w-full h-64 object-contain" />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={onRemoveBigImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer block p-8 hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onBigImageChange}
                />
                <div className="flex flex-col items-center gap-2">
                  <ImagePlus className="h-12 w-12 text-gray-400" />
                  <span className="text-gray-600">Upload main image</span>
                </div>
              </label>
            )}
          </div>
        </div>
  
        <div className="space-y-2">
          <Label>Additional Images {errors.smallImages && <span className="text-red-500 text-sm">({errors.smallImages})</span>}</Label>
          <div className="grid grid-cols-2 gap-4">
            {smallImages.map((image, index) => (
              <div key={index} className="relative group">
                <img src={image} alt={`Product ${index + 1}`} className="w-full h-40 object-cover rounded-lg" />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveSmallImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <label className="cursor-pointer flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onSmallImageAdd}
              />
              <Plus className="h-8 w-8 text-gray-400" />
            </label>
          </div>
        </div>
      </div>
    );
  }
  
  
  interface CategorySelectorProps {
    categories: Category[];
    selectedCategories: Category[];
    onSelect: (categoryId: number) => void;
    onRemove: (categoryId: number) => void;
  }
  
  export function CategorySelector({
    categories,
    selectedCategories,
    onSelect,
    onRemove,
  }: CategorySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="space-y-2">
        <Label>Categories</Label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Search className="mr-2 h-4 w-4" />
              Search categories...
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="bottom" align="start">
            <Command>
              <CommandInput placeholder="Search categories..." />
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    onSelect={() => {
                      onSelect(category.id);
                      setIsOpen(false);
                    }}
                  >
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
  
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <span
              key={category.id}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1"
            >
              {category.name}
              <button
                type="button"
                onClick={() => onRemove(category.id)}
                className="hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  }
  
  // components/ProductDetails.tsx
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
  
          <div className="flex items-center space-x-2">
            <Switch
              id="discount"
              checked={isProductInDiscount}
              onCheckedChange={onDiscountToggle}
            />
            <Label htmlFor="discount">Apply Discount</Label>
          </div>
  
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
  
  // CreateNewProductPage.tsx
  export default function CreateNewProductPage(){
      // ... State management from previous version ...
      const [bigImage, setBigImage] = useState<string | null>(null);
  const [smallImages, setSmallImages] = useState<string[]>([]);
  const [productTitle, setProductTitle] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string>("");
  const [isProductInDiscount, setIsProductInDiscount] = useState<boolean>(false);
  const [discountPrice, setDiscountPrice] = useState<string>("");
  const [productCount, setProductCount] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [productTags, setProductTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [isProductUnlimited, setIsProductUnlimited] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
      const [formErrors, setFormErrors] = useState<FormErrors>({});
      
       // Mock categories - replace with actual API call
  const categories: Category[] = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Books" },
    { id: 4, name: "Home & Garden" },
    { id: 5, name: "Sports" },
    { id: 6, name: "Toys" }
  ];

  // Validation
  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    if (!productTitle.trim()) errors.title = "Title is required";
    if (!productDescription.trim()) errors.description = "Description is required";
    if (!bigImage) errors.bigImage = "Main image is required";
    if (smallImages.length === 0) errors.smallImages = "At least one product image is required";
    if (!productPrice || parseFloat(productPrice) <= 0) errors.price = "Valid price is required";
    return errors;
  };

  // Image handlers with proper types
  const handleBigImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setBigImage(URL.createObjectURL(file));
      setFormErrors(prev => ({ ...prev, bigImage: undefined }));
    }
  };

  const handleSmallImageAdd = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const newImage = URL.createObjectURL(file);
      setSmallImages(prev => [...prev, newImage]);
      setFormErrors(prev => ({ ...prev, smallImages: undefined }));
    }
  };

  const removeSmallImage = (index: number): void => {
    setSmallImages(prev => prev.filter((_, i) => i !== index));
  };

  // Category handlers with proper types
  const handleCategorySelect = (categoryId: number): void => {
    const category = categories.find(c => c.id === categoryId);
    if (category && !selectedCategories.find(c => c.id === categoryId)) {
      setSelectedCategories(prev => [...prev, category]);
    }
    setIsSearchOpen(false);
  };

  const removeCategory = (categoryId: number): void => {
    setSelectedCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  // Form submission with proper types
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Type for the form data
    interface FormData {
      bigImage: string | null;
      smallImages: string[];
      productTitle: string;
      productDescription: string;
      productPrice: string;
      isProductInDiscount: boolean;
      discountPrice: string;
      productCount: string;
      selectedCategories: Category[];
      productTags: string[];
      isProductUnlimited: boolean;
    }

    const formData: FormData = {
      bigImage,
      smallImages,
      productTitle,
      productDescription,
      productPrice,
      isProductInDiscount,
      discountPrice,
      productCount,
      selectedCategories,
      productTags,
      isProductUnlimited
    };

    try {
      // Add your API call here
      console.log(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
    return (
      <div className=" mx-auto">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Create New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-8">
              {/* Left Column - Images */}
              <div className="w-1/2">
                <ImageUploadSection
                  bigImage={bigImage}
                  smallImages={smallImages}
                  onBigImageChange={handleBigImageChange}
                  onSmallImageAdd={handleSmallImageAdd}
                  onRemoveBigImage={() => setBigImage(null)}
                  onRemoveSmallImage={removeSmallImage}
                  errors={formErrors}
                />
              </div>
  
              {/* Right Column - Product Details */}
              <div className="w-1/2 space-y-8">
                <ProductDetails
                  productTitle={productTitle}
                  productDescription={productDescription}
                  productPrice={productPrice}
                  isProductInDiscount={isProductInDiscount}
                  discountPrice={discountPrice}
                  productCount={productCount}
                  isProductUnlimited={isProductUnlimited}
                  onTitleChange={(e) => {
                    setProductTitle(e.target.value);
                    setFormErrors(prev => ({ ...prev, title: undefined }));
                  }}
                  onDescriptionChange={(e) => {
                    setProductDescription(e.target.value);
                    setFormErrors(prev => ({ ...prev, description: undefined }));
                  }}
                  onPriceChange={(e) => {
                    setProductPrice(e.target.value);
                    setFormErrors(prev => ({ ...prev, price: undefined }));
                  }}
                  onDiscountToggle={setIsProductInDiscount}
                  onDiscountPriceChange={(e) => setDiscountPrice(e.target.value)}
                  onUnlimitedToggle={setIsProductUnlimited}
                  onCountChange={(e) => setProductCount(e.target.value)}
                  errors={formErrors}
                />
  
                <CategorySelector
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onSelect={handleCategorySelect}
                  onRemove={removeCategory}
                />
  
                <Button type="submit" className="w-full">
                  Create Product
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }