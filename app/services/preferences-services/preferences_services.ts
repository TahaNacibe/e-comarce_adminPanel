import ImageServices from "../images-services/image-services"

export default class PreferencesServices {

    //* get auth users list 
    getUsersListFromDb = async (searchQuery:string|null) => {
        try {
            const searchParams = new URLSearchParams()
            if (searchQuery) {
                searchParams.append("searchQuery",searchQuery)
            }
            //* load the users from db
            const response = await fetch(`/api/preferences?${searchParams}`, {
                method:"GET"
            })

            if (response.ok) {
                const data = await response.json()
                return {success:true, message:"Users Load", data:data.users}
            }

            return {success:false, message:"Users Load Failed", data:response.status}
        } catch (error:any) {
            return {success:false, message:"Error getting the users", data:error.message}
        }
    }


    //* update user state
    updateUserStateInDb = async ({ userId, isSubAdmin }: { userId: string, isSubAdmin: boolean }) => {
        try {
            const response = await fetch(`/api/preferences?userId=${userId}`, {
                method: "PUT"
            })

            if (response.ok) {
                const data = await response.json()
                return {success:true, message:`${data.updatedUser.name} was ${isSubAdmin? "removed as" : "added as"} sub admin`, data:data.updatedUser}
            }
            return {success:false, message:"Users update failed", data:response.status}
        } catch (error:any) {
            return {success:false, message:"Error while updating user", data:error.message}
        }
    }


    //* update shop icon
    updateShopIcon = async (file: File) => {
        const imagesServices = new ImageServices()
        try {
            const response = await imagesServices.uploadToCloudinary(file)
            if (response.success) {
                return {success:true, message:"Icon Updated!", data:response.data}
            }
            return {success:false, message:"Shop icon update failed", data:response.message}
        } catch (error:any) {
            return {success:false, message:"Error updating shop icon", data:error.message}
        }
    }

    //* update the shop name 
    updateShopDetails = async ({shopDetails,newIcon}:{shopDetails: any,newIcon:string}) => {
        try {
            const searchParams = new URLSearchParams()
            if(newIcon) searchParams.append("newIcon",newIcon)
            if (!newIcon) return { success: false, message: "Can't be empty", data: "Require at last one info to update" }
            const response = await fetch(`/api/preferences?${searchParams}`, {
                method: "POST",
                body:JSON.stringify(shopDetails)
            })
            
            if (response.ok) {
                const data = await response.json()
                return { success: true, message: "Updated!", data: `Your shop now called ${data.newShop}` }
            }

            return { success: false, message: "Failed to update name!", data: "Something went wrong!"}
        } catch (error:any) {
            return { success: false, message: "Error updating shop name!", data: error.message }
        }
    }


    //* load shop details
    loadShopDetailsInStart = async () => {
        try {
            const response = await fetch('/api/preferences/settings', {
                method: "GET"
            })
    
            if (response.status === 200) {
                const data = await response.json()
                return {success:true,message:"loaded",data:data.settings}
            }
            return {success:false,message:"Failed to load shop details",data:response.status}
        } catch (error:any) {
            return {success:false,message:"Error",data:error.message}
        }
        
    }


    //* get fee table data from db
    getFeeTableData = async () => { 
        try {
            //* request data from server
            const response = await fetch('/api/preferences/deliveryFee', {
                method: "GET"
            })

            //* handle response
            if(response.ok){
                const data = await response.json()
                return {success:true, message:"Delivery fee data loaded", data:data.data}
            }

            return {success:false, message:"Failed to load delivery fee data", data:response.status}
        } catch (error: unknown) {
            if (error instanceof Error) {
                return { success: false, message: "Error loading delivery fee data", data: error.message }
            }
            return { success: false, message: "Error loading delivery fee data", data: "An error occurred" }
        }
    }


    //* delete an fee item from the db
    deleteFeeItem = async (feeId: string) => { 
        try {
            //* check if id is empty
            if (!feeId) return { success: false, message: "Please provide the delivery fee id", data: "Empty id" }
            //* request data from server
            const response = await fetch(`/api/preferences/deliveryFee?id=${feeId}`, {
                method: "DELETE"
            })

            //* handle response
            if(response.ok){
                const data = await response.json()
                return {success:true, message:"Delivery fee deleted", data:data.message}
            }
            return {success:false, message:"Failed to delete delivery fee", data:response.status}
        } catch (error : unknown) {
            if(error instanceof Error){
                return {success:false, message:"Error deleting delivery fee", data:error.message}
            }
            return {success:false, message:"Error deleting delivery fee", data:"An error occurred"}
        }
    }



    //* create new fee item in db
    createNewFeeItem = async (newFeeItem: { city: string, price: string, currency: string | null }) => {
        try {
            //* check if id is empty
            if (!newFeeItem.city || !newFeeItem.price) return { success: false, message: "Please provide the delivery fee details", data: "Empty details" }
            //* request data from server
            const response = await fetch(`/api/preferences/deliveryFee`, {
                method: "POST",
                body: JSON.stringify(newFeeItem)
            })

            //* handle response
            if(response.ok){
                const data = await response.json()
                return {success:true, message:"Delivery fee created", data:data.message}
            }
            return {success:false, message:"Failed to create delivery fee", data:response.status}
        } catch (error : unknown) {
            if(error instanceof Error){
                return {success:false, message:"Error creating delivery fee", data:error.message}
            }
            return {success:false, message:"Error creating delivery fee", data:"An error occurred"}
        }
    }



    //* update fee item in db
    updateFeeItem = async (updatedItem: { city: string, price: string, currency: string | null }, feeId: string) => {
        try {
            //* check if id is empty
            if (!feeId) return { success: false, message: "Please provide the delivery fee id", data: "Empty id" }
            //* request data from server
            const response = await fetch(`/api/preferences/deliveryFee?id=${feeId}`, {
                method: "PUT",
                body: JSON.stringify({ updatedItem })
            })

            //* handle response
            if(response.ok){
                const data = await response.json()
                return {success:true, message:"Delivery fee updated", data:data.message}
            }
            return {success:false, message:"Failed to update delivery fee", data:response.status}
        } catch (error : unknown) {
            if(error instanceof Error){
                return {success:false, message:"Error updating delivery fee", data:error.message}
            }
            return {success:false, message:"Error updating delivery fee", data:"An error occurred"}
        }
    }

}