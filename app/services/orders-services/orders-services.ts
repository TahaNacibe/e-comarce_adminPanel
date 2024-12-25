export default class OrderServices {


    //* get orders with pagination setting
    getOrdersListFromDb = async (pageIndex:number,searchQuery?:string | null,filterKey?:string | null) => {
        try {
            //* check params exist
            if (!pageIndex || pageIndex <= 0) return { success: false, message: "Require a page to get the orders", data: "No Page Supplied" }
            
            // handle request
            const queryParams = new URLSearchParams();
            queryParams.append("pageIndex", pageIndex.toString());
            if (searchQuery) queryParams.append("searchQuery", searchQuery);
            if (filterKey) queryParams.append("filterKey", filterKey);

            const response = await fetch(`/api/orders?${queryParams.toString()}`, { method: "GET" });


            const data = await response.json()
            // handle response
            if (response.ok) {
                return {success:true, message:"Orders List loaded!",data:data,}
            }

            //* other wise handle error
            return {success: false, message:data.message, data:data.data}
        } catch (error:any) {
            return {success: false, message:"Error fetching orders!", data:error.message}
        }
    }
}