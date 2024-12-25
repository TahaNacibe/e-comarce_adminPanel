import { Category } from "@/app/products/types/pageTypes";



export default function transformData(payload: any,bigImageUrl:any,smallImageUrls:any) {
    return {
        name: payload.productTitle,
        description: payload.productDescription,
        price: parseFloat(payload.productPrice) || 0,
        discountPrice: payload.discountPrice ? parseFloat(payload.discountPrice) : null,
        isInDiscount: payload.isProductInDiscount || false,
        stockCount: payload.productCount
          ? parseInt(payload.productCount, 10)
          : payload.isProductUnlimited
          ? 99999
          : 0,
        bigImageUrl,
        smallImageUrls,
        tagIds: payload.selectedCategories.map((category: Category) =>
          category.id
        ),
        properties: payload.properties || [],
      };
}