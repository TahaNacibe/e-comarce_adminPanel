"use client"
import { ChangeEvent, FormEvent, useState } from "react";
// components/CategorySelector.tsx
import { Button } from "@/components/ui/button";
import { Category, FormDataInterface, PropertiesInterface } from "../types/pageTypes";
import { FormErrors } from "../types/pageTypes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ImageUploadSection } from "../components/image-upload-section";
import { CategorySelector } from "../components/category-selector";
import { ProductDetails } from "../components/product-details-column";
import PropertiesWidget from "../components/properties-widget";
  

  // Create New Product Page
  export default function CreateNewProductPage(){
    // State variables
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
  const [properties, setProperties] = useState<PropertiesInterface[]>([]);
  const [isProductUnlimited, setIsProductUnlimited] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
      
       //todo: Mock categories - replace with actual API call
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

      
  // Small image handlers with proper types
  const handleSmallImageAdd = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const newImage = URL.createObjectURL(file);
      setSmallImages(prev => [...prev, newImage]);
      setFormErrors(prev => ({ ...prev, smallImages: undefined }));
    }
      };
      

  // Remove small image 
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

      
    // Remove category
  const removeCategory = (categoryId: number): void => {
    setSelectedCategories(prev => prev.filter(c => c.id !== categoryId));
  };

      
    // Add new property
    const addProperty = ({property}:{property:PropertiesInterface}) => {
        setProperties((prev) => [
            ...prev,
            {
                label: property.label,
                values: property.values,
            },
        ]);
      };
      
      // Remove property
        const removeProperty = (index: number) => {
            setProperties((prev) => prev.filter((_, i) => i !== index));
      };
      
      // edit property
      const editProperty = (editedProperty: PropertiesInterface, itemIndex: number) => {
          setProperties(prev => prev.map((item,index) => itemIndex === index? editedProperty : item ))
      }
      
  // Form submission with proper types
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
      }

    // create form data
    const formData: FormDataInterface = {
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
      //todo: Add API call
      console.log(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
      
    // UI tree
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


                            <PropertiesWidget
                                properties={properties}
                                onPropertyAdd={(property: PropertiesInterface) => { 
                                    addProperty({ property });
                                }}
                                onPropertyRemoved={(propertyIndex: number) => { 
                                   removeProperty(propertyIndex);
                                }}
                                onPropertyEdited={(editedProperty: PropertiesInterface, itemIndex: number) => {
                                    editProperty(editedProperty, itemIndex);
                                }}
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