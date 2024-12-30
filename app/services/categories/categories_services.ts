import { Category } from "@/app/products/types/pageTypes"

export default class CategoriesServices {


    // get categories list
    getCategoriesListFromDb = async({setCategoriesList}:{setCategoriesList:(categories:Category[]) => void}) => {
        try {
            // request data
            const response = await fetch("/api/categories/", {
                method:"GET"
            })

            // check response state
            if (response.ok) {
                const data = await response.json()
                setCategoriesList(data.message)
                return {success:true,message:"categories List Loaded",data:data.message}
            }

            return {success:false,message:"Fails to load categories List",data:response.status}
        } catch (error:any) {
            return {success:false,message:"Failed to get categories",data:error.message}
        }
    }


    // create a new category
    createNewCategoryInDb = async ({ title, description, parent }
        : { title: string, description: string, parent: Category | null }) => {
        
        const parentId = parent? parent.id : null
        console.log(title,description,parent)
        try {
            const response = await fetch("/api/categories/", {
                method: "POST",
                body: JSON.stringify({title,description,parentId})
            })

            if (response.ok) {
                const data = await response.json()
                return {success: true, message:"Category created!", data:data.newCategory}
            }

            return {success: false, message:"Couldn't create the new category", data:response.status}
        } catch (error: any) {
            console.error(error)
            return {success: false, message:"Error creating Category!", data:error.message}
        }
    }



    deleteCategoryFromDb = async (categoryId:string|null) => {
        try {
            // check if the category id is supplied
            if (!categoryId) return { success: false, message: "No category supplied", data: "404 No item found" }
            
            const response = await fetch(`/api/categories?categoryId=${categoryId}`, {
                method:"DELETE"
            })

            
            // check response
            if (response.ok) {
                const data = await response.json()
                return {success: true, message:`${data.categoryName} was deleted`,data:data.categoryName}
            }

            return {success:false, message:"Couldn't delete the category!", data:`Error ${response.status}`}
        } catch (error: any) {
            console.log("it's that case bitch")
            return {success:false, message:"Failed to delete Category", data:error.message}
        }
    }



    updateExistingCategory = async ({ name, description, parentId, categoryIdForEdit }: { name: string, description: string, parentId: string | null, categoryIdForEdit:string}) => {
        try {
            // manage the case of no category 
            if (!categoryIdForEdit) return { success: false, message: "no Category found to update!", data: "No Category" }
            
            // update category
            const updatedResponse = await fetch('/api/categories', {
                method: 'PUT',
                body: JSON.stringify({
                    name,
                    description,
                    parentId,
                    categoryIdForEdit
                })
            })

            
            // check response 
            if (updatedResponse.ok) {
                const data = await updatedResponse.json()
                return {success: true, message:"Category Updated!",data:data.updatedCategory}
            }

            return {success: false, message:"Error while updating category!",data:`${updatedResponse.status}`}
        } catch (error:any) {
            return {success: false, message:"Failed to update category",data:error.message}
        }
    }



    //* update display state for category
    updateDisplayStateForCategory = async (categoryId: string) => {
        try {
            //* no require data supplied
            if (!categoryId) return { success: false, message: "messing required data!", data: null }
            
            const searchParams = new URLSearchParams()
            searchParams.append("categoryId",categoryId)

            //* update the value in db
            const response = await fetch(`/api/categories?${searchParams}`, {
                method:"PUT"
            })


            if (response.ok) {
                await response.json()
                return {success: true, data:"Category is now on display!",message:"Updated!"}
            }

            return {success: false, message:"Could't update Category!",data:response.status}
        } catch (error:any) {
            return {success: false, message:"Failed to update Category!",data:error.message}
        }
    }
}