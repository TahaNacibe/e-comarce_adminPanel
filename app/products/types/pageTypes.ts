export interface ProductProperties {
  label: string;
  values: string;
  }
  
export interface Product {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string;
    properties: ProductProperties[];
    price: number;
    discountPrice?: number;
    isInDiscount: boolean;
    stockCount: number;
    soldCount: number;
    isVisible: boolean;
    bigImageUrl: string;
    smallImageUrls: string[];
    tagIds: string[];
    tags: Tag[];
  }
  
export interface Tag {
    id: string;
    name: string;
    description: string;
    parentId?: string;
}


export interface Category {
    id: number;
    name: string;
  }
  
  export interface FormErrors {
    title?: string;
    description?: string;
    bigImage?: string;
    smallImages?: string;
    price?: string;
  }
  
  export interface ProductFormData {
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
  

  export interface FormDataInterface {
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
  
export interface PropertiesInterface{
    label: string;
    values: string;
}