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
  description: string;
  parentTag: Category
  }
  
  export interface FormErrors {
    title?: string;
    description?: string;
    bigImage?: string;
    smallImages?: string;
    price?: string;
  }
  
  export interface ProductFormData {
    bigImage: File | null;
    smallImages: File[];
    productTitle: string;
    productDescription: string;
    productPrice: string;
    isProductInDiscount: boolean;
    discountPrice: string;
    productCount: string;
    selectedCategories: Category[];
    properties: PropertiesInterface[];
    isProductUnlimited: boolean;
  }
  

  export interface FormDataInterface {
    bigImage: File | null;
    smallImages: File[];
    productTitle: string;
    productDescription: string;
    productPrice: string;
    isProductInDiscount: boolean;
    discountPrice: string;
    productCount: string;
    selectedCategories: Category[];
    properties: PropertiesInterface[];
    isProductUnlimited: boolean;
}
  
export interface PropertiesInterface{
    label: string;
    values: string;
}