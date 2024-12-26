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

            const data = await response.json()
            if (response.ok) {
                console.log("from service it's like that : ",data)
                return {success:true, message:"Users Load", data:data.users}
            }

            return {success:false, message:"Users Load Failed", data:data.message}
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

            const data = await response.json()
            if (response.ok) {
                console.log(data)
                return {success:true, message:`${data.updatedUser.name} was ${isSubAdmin? "removed as" : "added as"} sub admin`, data:data.updatedUser}
            }
            return {success:false, message:"Users update failed", data:data.message}
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
    updateShopDetails = async ({newName,newIcon}:{newName: string,newIcon:string}) => {
        try {
            const searchParams = new URLSearchParams()
            if(newIcon) searchParams.append("newIcon",newIcon)
            if(newName) searchParams.append("newName",newName)
            if (!newName && !newIcon) return { success: false, message: "Can't be empty", data: "Require at last one info to update" }
            const response = await fetch(`/api/preferences?${searchParams}`, {
                method:"POST"
            })

            const data = await response.json()
            if (response.ok) {
                return { success: true, message: "Updated!", data: `Your shop now called ${newName}` }
            }

            return { success: false, message: "Failed to update name!", data: data.message }
        } catch (error:any) {
            return { success: false, message: "Error updating shop name!", data: error.message }
        }
    }


    //* load shop details
    loadShopDetailsInStart = async () => {
        const response = await fetch('/api/preferences/settings', {
            method: "GET"
        })

        const data = await response.json()
        if (response.status === 500) {
            return {success:false,message:"Error",data:data.error}
        }
        return {success:true,message:"loaded",data:data.settings}
    }

}