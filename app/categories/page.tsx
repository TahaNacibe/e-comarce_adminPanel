"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import CategoriesServices from "../services/categories/categories_services"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown, Edit, Loader2, MoreVertical, Plus, Search, Tags, Trash, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Category } from "../products/types/pageTypes"
import CategorySheet from "./components/input_for_item"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"

export default function CategoriesPage() {

    // manage state
    const [categoriesList, setCategoriesList] = useState<any[]>([])
    const [filteredList, setFilteredList] = useState<any[]>([])
    const [isToasted, setIsToasted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [showInputSection, setShowInputSection] = useState(false)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [filterKey, setFilterKey] = useState("All")


    // state management for the side sheet
    const [editData, setEditData] = useState<{
    title: string;
    description: string;
    editTargetId: string;
    parent: Category | null;
    } | null>(null);
    

    // hooks
    const { data: session } = useSession()
    const router = useRouter()
    const { toast } = useToast()


    // instances
    const categoriesServices = new CategoriesServices()

    const filters = ["All", "Sub", "Separate"];



    // initial load for the categories list
    const loadCategoriesList = async () => {
        if (session) {
            //* check if user have access before loading data
            if (session.user.role !== "ADMIN" && session.user.role !== "SUB_ADMIN") {
                router.push("/unauthorized-access")
                return;
            }
            

        // get data
            const response = await categoriesServices.getCategoriesListFromDb({ setCategoriesList })
            setFilteredList(response.data);

        // if no toast have been shown to the user yet show him one
        if (!isToasted) {
            if (response.success) {
                toast({
                    title: response.message,
                    description: `Loaded ${response.data.length} categories`,
                })
                // when loaded once don't show other toasts
                setIsToasted(true)
            } else {
                // in case error to inform user on situation
                toast({
                    title: "Error loading categories",
                    description: response.data,
                    variant: "destructive"
                })
            }
        }

        // update loading state (exit loading)
        setIsLoading(false)
        }
    }



    //* handle initial load when page start or session change
    useEffect(() => {
        loadCategoriesList()
    }, [session])




    //* inform user on updating category proses result
    function onCategoryUpdate(response: any) {
        if (response.success) {
            // inform user with success 
            toast({
                description: "Updated",
                title: response.message,
            })
            // update client side list
            setCategoriesList(prev => prev.map((cat) => cat.id === response.data.id? response.data : cat))
        } else {
            // handle error display
            toast({
                description: "Something went wrong",
                title: response.message,
                variant:"destructive"
            })
        }
        //* close the input section 
        setShowInputSection(false)
    }



    //* inform user on add new category
    function onCategoryAdd(response: any) {
        if (response.success) {
            //* success state
            toast({
                description: "Created",
                title: response.message,
            })
            // update client 
            setCategoriesList(prev => [...prev,response.data])
        } else {
            // handle the error
            toast({
                description: "Something went wrong",
                title: response.message,
                variant:"destructive"
            })
        }
        // close the sheet
        setShowInputSection(false)
    }



    //* handle delete process for a specific category
    async function deleteCategory(categoryId: string) {
        //notify user
        notifyUserOnActionStart("Deleting")
        const response = await categoriesServices.deleteCategoryFromDb(categoryId)

        if (response.success) {
            // update the client side data in case it was success
            setCategoriesList(prev => prev.filter((cat) => cat.id !== categoryId))
        }

        // inform user
            toast({
                description:response.success? "Category Deleted" : "Failed to Delete Category",
                title: response.message,
                variant:response.success? "default" : "destructive"

            })
    }



    //* display error to the user 
    function onErrorCatches(error: any) {
        toast({
            title: "Something went wrong",
            description: error.message,
            variant: "destructive"
        })
    }




    //* show the action process while the user wait
    function notifyUserOnActionStart(title:string) {
        toast({
            title: `${title}...`,
            description: `${title} Category...`,
        })
    }




    //* handle search action
    const searchByName = (e: string) => {
        setSearchQuery(e)
        applySearchAndFilter(e,filterKey)
    }



    //* handle filter change
    const handleFilterSelect = (filterKey: string) => {
        setFilterKey(filterKey)
        applySearchAndFilter(searchQuery,filterKey)
    }



    //* apply search and filter
    const applySearchAndFilter = (query: string, filterKey: string) => {
        let filtered = categoriesList;
      
        // Apply search query if it's not empty
        if (query) {
          filtered = filtered.filter((cat) =>
            cat.name.toLowerCase().includes(query.toLowerCase())
          );
        }
      
        // Apply filter logic
        switch (filterKey) {
          case filters[1]: // Subcategories
            filtered = filtered.filter((item) => item.parentTag);
            break;
          case filters[2]: // Standalone categories
            filtered = filtered.filter((item) => !item.parentTag);
            break;
          default: // All categories
            break;
        }
      
        setFilteredList(filtered);
      };


    

    //* show loading spinier
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }
    
    

    //* handle on edit a category clicked 
    const handleEditClick = (category: Category) => {
        // update data for sheet display
        setEditData({
            title: category.name,
            description: category.description || "",
            editTargetId: category.id.toString(),
            parent: category.parentTag || null
        });
        // sho sheet
        setShowInputSection(true);
    };
    



    //* handle on new category add button clicked
    const handleAddNewClick = () => {
        // Clear any existing edit data
        setEditData(null); 
        // show the sheet
        setShowInputSection(true);
    };



    //* ui tree
    return (
        <div className="">
            {/* input create or update section */}
            <CategorySheet
            open={showInputSection}
            onOpenChange={setShowInputSection}
            categoriesList={categoriesList}
            editData={editData}
            onCategoryAdd={onCategoryAdd}
            onErrorHold={onErrorCatches}
            onEditCompleted={onCategoryUpdate}
            notifyUserOnActionStart={notifyUserOnActionStart}
            />

            
            {/* display items */}
            <Card className="rounded-none h-screen">

                {/* title and headers */}
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="text-xl font-medium flex items-center gap-2">
                            <Tags className="h-5 w-5" />
                            Categories
                        </CardTitle>
                        <CardDescription className="max-w-md text-gray-500 text-xs pt-4">
                            Categories are a great way to organize your products, it give client a better way to find things they like
                        </CardDescription>
                    </div>

                     {/* new item button */}
                        <Button 
                        onClick={handleAddNewClick}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" /> Add Category
                    </Button>

                 

                </CardHeader>
                <CardContent>
                {/* items builder */}
                     {/* search section */}
                    <div className="mb-6 flex justify-between items-end">
                        <Badge className="mb-2 h-fit">Total of {filteredList.length} Categories</Badge>
                        <div className="flex items-end gap-4">
                            {/* filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={"outline"} >
                                        {filterKey}
                                        <ChevronDown />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {filters.map((filter) => (
                                        <DropdownMenuItem key={filter} onSelect={() => handleFilterSelect(filter)}> {filter} </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                    <div>
                        <div className="relative w-full">
                                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shadow-sm" />
                                  <Input
                                    placeholder="Search Categories..."
                                    className="pl-10 w-96"
                                    value={searchQuery}
                                    onChange={(e) => searchByName(e.target.value)}
                                />
                               {searchQuery !== "" && <X
                                    onClick={() => searchByName("")}
                                    className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shadow-sm" />}
                        </div>
                        </div>
                        </div>
                              </div>
                    <div className="rounded-lg border">
                        <Table>
                            {/* header of the table */}
                            <TableHeader>
                                <TableRow className="bg-gray-50/5">
                                    <TableHead className="w-[300px]">Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Parent</TableHead>
                                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            {/* actual categories */}
                            <TableBody>
                                {filteredList.length === 0 ? (
                                    <TableRow>
                                        <TableCell 
                                            colSpan={4} 
                                            className="text-center text-muted-foreground h-32"
                                        >
                                            No categories found. Create your first category to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredList.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {category.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground max-w-md">
                                                {category.description || "No description"}
                                            </TableCell>
                                            <TableCell>
                                                {category.parentTag ? (
                                                    <Badge variant="secondary">
                                                        {category.parentTag.name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">
                                                        None
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {/* options button */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button 
                                                            variant="ghost" 
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem 
                                                            className="flex items-center gap-2"
                                                            onClick={() => handleEditClick(category)}
                                                        >
                                                            <Edit className="h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => deleteCategory(category.id)}
                                                            className="flex items-center gap-2 text-red-600"
                                                        >
                                                            <Trash className="h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}