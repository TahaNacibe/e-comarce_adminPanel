"use client";

import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, use, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CategorySelector } from "../../components/category-selector";
import { ImageUploadSection } from "../../components/image-upload-section";
import { ProductDetails } from "../../components/product-details-column";
import PropertiesWidget from "../../components/properties-widget";
import { Category, FormDataInterface, PropertiesInterface, FormErrors } from "../../types/pageTypes";
import CategoriesServices from "@/app/services/categories/categories_services";
import ProductsServices from "@/app/services/products/productsServices";
import { useToast } from "@/hooks/use-toast";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  // Services instances
  const productServices = new ProductsServices();
  const categoriesServices = new CategoriesServices();
  const { toast } = useToast();
  const router = useRouter();
  const { data: session, status } = useSession();

  // State variables
  // image state
  const [bigImage, setBigImage] = useState<File | null>(null);
  const [smallImages, setSmallImages] = useState<File[]>([]);
  const [existingBigImage, setExistingBigImage] = useState<string>("");
  const [existingSmallImages, setExistingSmallImages] = useState<string[]>([]);

  // details state
  const [productTitle, setProductTitle] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string>("");
  const [isProductInDiscount, setIsProductInDiscount] = useState<boolean>(false);
  const [discountPrice, setDiscountPrice] = useState<string>("");
  const [productCount, setProductCount] = useState<string>("");
  const [isProductUnlimited, setIsProductUnlimited] = useState<boolean>(false);

  // categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // properties
  const [properties, setProperties] = useState<PropertiesInterface[]>([]);

  // loading and error states
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [actionCode, setActionCode] = useState(0);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const resolvedParams = use(params);

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === "loading") return;
        
        if (!session || 
            (session.user.role !== "ADMIN" && session.user.role !== "SUB_ADMIN")) {
          redirect("/unauthorized-access");
        }

        const [productResponse, categoriesResponse] = await Promise.all([
          productServices.getProductDetailsById(resolvedParams.id),
          categoriesServices.getCategoriesListFromDb({ setCategoriesList: setCategories })
        ]);

        if (productResponse.success) {
          const product = productResponse.data;
          setProductTitle(product.name);
          setProductDescription(product.description);
          setProductPrice(product.price.toString());
          setIsProductInDiscount(product.isInDiscount);
          setDiscountPrice(product.discountPrice?.toString() || "");
          setProductCount(product.stockCount.toString());
          setIsProductUnlimited(product.isUnlimited);
          setExistingBigImage(product.bigImageUrl);
          setExistingSmallImages(product.smallImageUrls);
          setProperties(product.properties);
          setSelectedCategories(product.tags);
        }
      } catch (error: any) {
        toast({
          title: "Error loading product",
          description: error.message
        });
      } finally {
        setIsPageLoading(false);
        setIsCategoriesLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id, session, status]);

  // Validation
  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    if (!productTitle.trim()) errors.title = "Title is required";
    if (!productDescription.trim()) errors.description = "Description is required";
    if (!bigImage && !existingBigImage) errors.bigImage = "Main image is required";
    if (smallImages.length === 0 && existingSmallImages.length === 0) errors.smallImages = "At least one product image is required";
    if (!productPrice || parseFloat(productPrice) <= 0) errors.price = "Valid price is required";
    return errors;
  };

  // Image handlers
  const handleBigImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setBigImage(file);
      setFormErrors(prev => ({ ...prev, bigImage: undefined }));
    }
  };

  const handleSmallImageAdd = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setSmallImages(prev => [...prev, file]);
      setFormErrors(prev => ({ ...prev, smallImages: undefined }));
    }
  };

  const removeSmallImage = (index: number): void => {
    setSmallImages(prev => prev.filter((_, i) => i !== index));
  };

  // Category handlers
  const handleCategorySelect = (categoryId: number): void => {
    const category = categories.find(c => c.id === categoryId);
    if (category && !selectedCategories.find(c => c.id === categoryId)) {
      setSelectedCategories(prev => [...prev, category]);
    }
  };

  const removeCategory = (categoryId: number): void => {
    setSelectedCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  // Property handlers
  const addProperty = ({property}: {property: PropertiesInterface}) => {
    setProperties(prev => [...prev, property]);
  };

  const removeProperty = (index: number) => {
    setProperties(prev => prev.filter((_, i) => i !== index));
  };

  const editProperty = (editedProperty: PropertiesInterface, itemIndex: number) => {
    setProperties(prev => prev.map((item, index) => itemIndex === index ? editedProperty : item));
  };

  // Form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData: any = {
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
      isProductUnlimited,
      existingBigImage,
      existingSmallImages
    };

    try {
      setActionCode(1);
      toast({
        title: actionCode === 1 ? "Uploading Images" : "Updating Product",
        description: actionCode === 1 ? "Uploading the product images to the server..." : "Updating the product...",
        duration: 9999999,
        open: actionCode !== 0
      });

      // back up check
      if (!session || 
        (session.user.role !== "ADMIN" && session.user.role !== "SUB_ADMIN")) {
      redirect("/unauthorized");
    }

      const updateResponse = await productServices.updateExistingProductInDb(resolvedParams.id,formData);

      if (updateResponse.success) {
        router.push("/products");
      } else {
        toast({
          title: updateResponse.message,
          description: updateResponse.data
        });
      }
    } catch (error: any) {
      toast({
        title: "Error updating product",
        description: error.message
      });
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-8">
            {/* Left Column - Images */}
            <div className="w-1/2">
              <ImageUploadSection
                bigImage={bigImage}
                smallImages={smallImages}
                existingBigImage={existingBigImage}
                existingSmallImages={existingSmallImages}
                onBigImageChange={handleBigImageChange}
                onSmallImageAdd={handleSmallImageAdd}
                onRemoveBigImage={() => setBigImage(null)}
                onRemoveSmallImage={removeSmallImage}
                onRemoveExistingBigImage={() => setExistingBigImage("")}
                onRemoveExistingSmallImage={(index) => {
                  setExistingSmallImages(prev => prev.filter((_, i) => i !== index));
                }}
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
                isLoading={isCategoriesLoading}
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
                Update Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}