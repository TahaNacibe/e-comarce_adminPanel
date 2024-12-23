import { Product } from "@/app/products/types/pageTypes";

class ProductsServices{
    //* formate the display price currency
    formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("fr-FR", {
          style: 'currency',
          currency: 'DZD'
        }).format(amount);
        };

    
    //* get products
    loadProducts = async ({ activePage, setFilteredProducts, setIsLoading, setPagesCount, setProducts, setTotalProductsCount,productsAreInDescOrder }
        : { activePage: number, setProducts: any, setFilteredProducts: any, setTotalProductsCount: (count: number) => void, setPagesCount: (pages: number) => void, setIsLoading: (state: boolean) => void, productsAreInDescOrder:boolean }) => {
        try {
          const response = await  fetch(`/api/products?activePage=${activePage}&productsAreInDescOrder=${productsAreInDescOrder? "desc" : "asc"}`);
          if (response.ok) {
              const data = await response.json()
              setProducts(data.message); 
            setFilteredProducts(data.message);
            setTotalProductsCount(data.totalProductsCount);
              setPagesCount(data.totalPages)
          }
          
          // update loading state
            setIsLoading(false);
            // return state
        return {success:true,message:"Products list was loaded!",data:null}
        } catch (error: any) {
            //* stop loading and send result
          setIsLoading(false);
        return {success:false,message:`Failed to load Products!`,data:error.toString()}
      }
    };
    


     // fetch the data corresponding to the new page
    handleDisplayItemsChange = async ({ newPage, searchQuery = null, setIsLoading, setProducts, setFilteredProducts, setActivePageIndex, setPagesCount }:
        { newPage: number; searchQuery: string | null; setIsLoading: (state: boolean) => void; setProducts: any; setFilteredProducts: any; setActivePageIndex: (activePage: number) => void; setPagesCount: (count: number) => void; }) => {
              try {
                setIsLoading(true);
                const response = await fetch(`/api/products?page=${newPage}&searchQuery=${searchQuery}`);
                if (response.ok) {
                  const data = await response.json();
                    setProducts(data.message);
                    setFilteredProducts(data.message);
                    setActivePageIndex(data.currentPage);
                    setPagesCount(data.totalPages);
                }
            } catch (error:any) {
                return {success:false,message:`Failed to load Products!`,data:error.toString()}
            } finally {
                  setIsLoading(false);
            }
    };
    
    

    // handle product delete process
    deleteProductFromDb = async ({ productId, setFilteredProducts, setTotalProductsCount }
        : { productId: string, setFilteredProducts: any, setTotalProductsCount: any }) => { 
        try {
            // handle request to delete product
            const response = await fetch(`/api/products?productId=${productId}`, {
                method: 'DELETE',
            });

            // check if the request was successful
            if (response.ok) {
                console.log(`Product ${productId} deleted successfully`);
                // remove the product from the list of products in the user end
                setFilteredProducts((prevProducts: Product[]) => prevProducts.filter((product: Product) => product.id !== productId));
                // update the total products count
                setTotalProductsCount((prevCount: number) => prevCount - 1);
            }
            return {success:true,message:`Product was removed!`,data:null}
        } catch (error:any) {
            return {success:false,message:`Failed to remove Product!`,data:error.toString()}
        }
    }


    // duplicate a product
    duplicateProductInDb = async ({ productId, updateDataTable,  }
        : { productId: string, updateDataTable: any,}) => {
        try {
            // get the api response
            const response = await  fetch(`/api/products?productId=${productId}`, {
                method: 'POST',
            });

            // check response
            if (response.ok) {
                const data = await response.json()
                // add to client current list
                updateDataTable()
            }
            return {success:true,message:`Product Duplicated!`,data:null}
        } catch (error:any) {
            return {success:false,message:`Failed to Duplicate Product!`,data:error.toString()}
        }
    }


    // update existing products
    editProductInDb = async ({product}:{product:Product}) => {
        try {
            // if any of the required data is missing then cancel
            if (!product) return;

            const response = await fetch(`/api/products?productId=${product.id}`, {
                method: 'PUT', // The HTTP method
                headers: {
                  'Content-Type': 'application/json', // Ensure the server knows we're sending JSON
                },
                body: JSON.stringify(product), // The data to send in the request body
            });


            
             // Check if the response is OK (status code 200-299)
            if (response.ok) {
                const data = await response.json(); // Parse JSON response if successful
                return {success:true,message:`Product updated!`,data:data.product}
            } else {
                // Handle the error response if the request fails
                const errorData = await response.json();
                return {success:false,message:`Error updating product`,data:errorData.message}
            }
        } catch (error:any) {
            return {success:false,message:`Error updating product`,data:error.toString()}
          
        }
    }
    
}

export default ProductsServices;