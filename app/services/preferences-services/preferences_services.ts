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

}