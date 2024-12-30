"use client"
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
// components/CategorySelector.tsx
import { Button } from "@/components/ui/button";
import { Category, FormDataInterface, PropertyType } from "../types/pageTypes";
import { FormErrors } from "../types/pageTypes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ImageUploadSection } from "../components/image-upload-section";
import { CategorySelector } from "../components/category-selector";
import { ProductDetails } from "../components/product-details-column";
import PropertiesWidget from "../components/properties-widget";
import CategoriesServices from "@/app/services/categories/categories_services";
import ProductsServices from "@/app/services/products/productsServices";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
  



  // Create New Product Page
  export default function CreateNewProductPage(){
  // State variables
  // image state
  const [bigImage, setBigImage] = useState<File | null>(null);
  const [smallImages, setSmallImages] = useState<File[]>([]);
  // details state
  const [productTitle, setProductTitle] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string>("");
  const [isProductInDiscount, setIsProductInDiscount] = useState<boolean>(false);
  const [discountPrice, setDiscountPrice] = useState<string>("");
  const [productCount, setProductCount] = useState<string>("");
  // categories
  const [categories,setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  // properties
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [isProductUnlimited, setIsProductUnlimited] = useState<boolean>(false);
  // error
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [actionCode, setActionCode] = useState(0)
    
    
    
    // get instances
    const categoriesServices = new CategoriesServices()
    const productsServices = new ProductsServices()


    const { toast } = useToast()
    const router = useRouter()
      
    useEffect(() => {
      // load the list of categories
      categoriesServices.getCategoriesListFromDb({ setCategoriesList: setCategories }).then((_) => {
        setIsCategoriesLoading(false)
      })
    }, [])
    


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
      setBigImage(file);
      setFormErrors(prev => ({ ...prev, bigImage: undefined }));
    }
  };

    
      
  // Small image handlers with proper types
  const handleSmallImageAdd = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const newImage = file;
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
  };

    
      
    // Remove category
  const removeCategory = (categoryId: number): void => {
    setSelectedCategories(prev => prev.filter(c => c.id !== categoryId));
  };

    
      
    // Add new property
    const addProperty = ({property}:{property:PropertyType}) => {
        setProperties((prev) => [
            ...prev,
            {
                label: property.label,
                values: property.values,
            },
        ]);
    };
    

      
      // Remove property
        const removeProperty = (label: string) => {
            setProperties((prev) => prev.filter((item) => item.label !== label));
    };
    

      
      // edit property
      const editProperty = (editedProperty: PropertyType, oldLabel: string) => {
          setProperties(prev => prev.map((item) => item.label === oldLabel? editedProperty : item ))
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
      properties,
      isProductUnlimited
    };

    try {

      // inform user
      setActionCode(1)
      toast({
        title: actionCode === 1? "Uploading Images" : "Adding Product",
        description: actionCode === 1? "Uploading the product images to the server..." : "Creating a new product...",
        duration: 9999999,
        open:actionCode !== 0
      })

      // create product
      const productCreatingResponse = await productsServices.createNewProductInDb({ formData, setActionState: setActionCode })
      
      // in success redirect back
      if (productCreatingResponse.success) {
        router.push("/products")
      } else {
        // in error show the error
        toast({
          title: productCreatingResponse.message,
          description: productCreatingResponse.data
        })
      }
      
    } catch (error:any) {
      toast({
        title: "Error submitting form",
        description: error.message
     })
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
            <form onSubmit={handleSubmit} className="md:flex gap-8">
              {/* Left Column - Images */}
              <div className="md:w-1/2">
                <ImageUploadSection
                  bigImage={bigImage}
                  smallImages={smallImages}
                  onBigImageChange={handleBigImageChange}
                  onSmallImageAdd={handleSmallImageAdd}
                  onRemoveBigImage={() => setBigImage(null)}
                  onRemoveSmallImage={removeSmallImage}
                  errors={formErrors}
                  existingBigImage={null}
                  existingSmallImages={null}
                  onRemoveExistingBigImage={() => { }}
                  onRemoveExistingSmallImage={() => { }} />
              </div>
  
              {/* Right Column - Product Details */}
              <div className="md:w-1/2 space-y-8">
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


                {/* category selector components */}
                <CategorySelector
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onSelect={handleCategorySelect}
                  onRemove={removeCategory}
                  isLoading={isCategoriesLoading}
                            />

                
                {/* properties components */}
                <PropertiesWidget
                    propertiesList={properties}
                    onPropertyAdd={(property: PropertyType) => { 
                        addProperty({ property });
                    }}
                    onPropertyRemove={(label: string) => { 
                        removeProperty(label);
                    }}
                    onPropertyUpdate={(editedProperty: PropertyType, oldLabel: string) => {
                        editProperty(editedProperty, oldLabel);
                    }}
                />
  
                
                {/* create product components */}
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