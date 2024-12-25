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
        
        let parentId = parent? parent.id : null
        console.log(title,description,parent)
        try {
            const response = await fetch("/api/categories/", {
                method: "POST",
                body: JSON.stringify({title,description,parentId})
            })

            const data = await response.json()
            console.log("----------->",data)
            if (response.ok) {
                return {success: true, message:"Category created!", data:data.newCategory}
            }

            return {success: false, message:data.message, data:response.status}
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

            const data = await response.json()
            console.log(data)
            
            // check response
            if (response.ok) {
                return {success: true, message:`${data.categoryName} was deleted`,data:data.categoryName}
            }

            return {success:false, message:data.message, data:`Error ${response.status}`}
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

            const data = await updatedResponse.json()

            // check response 
            if (updatedResponse.ok) {
                return {success: true, message:"Category Updated!",data:data.updatedCategory}
            }

            return {success: false, message:"Error while updating category!",data:`${data.message}`}
        } catch (error:any) {
            return {success: false, message:"Failed to update category",data:error.message}
        }
    }
}