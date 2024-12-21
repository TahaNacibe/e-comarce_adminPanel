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
  