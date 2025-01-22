import PreferencesServices from "@/app/services/preferences-services/preferences_services";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Description } from "@radix-ui/react-toast";
import { title } from "process";
import { useEffect, useState } from "react";
import ActionsDialog from "./action_dialog";
import { Button } from "@/components/ui/button";
import { DollarSign, LoaderCircle, MapPin, Plus, Save } from "lucide-react";
import TableHeaderSection from "./table_header";
import FirstLetterToCapital from "@/utils/first_letter_to_capital";

//* types
interface DeliveryFee { 
    id: string,
    price: string,
    city: string,
    currency:string | null
}

const DEFAULT_FEE_ITEM = { id: "", price: "", city: "", currency: "DZD" }

//* widget component
export default function DeliveryFeeTable({preferencesServices,toast}:{preferencesServices: PreferencesServices, toast:any}) {
    //* handle state vars
    const [deliveryFees, setDeliveryFees] = useState<DeliveryFee[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isEditing, setIsEditingId] = useState<string | null>(null)
    const [tempFeeItem, setTempFeeItem] = useState<DeliveryFee>(DEFAULT_FEE_ITEM)
    const [isNewItem, setIsNewItem] = useState<boolean>(false)


    //* functions
    const loadFeesTable = async () => {
        try {
            const response = await preferencesServices.getFeeTableData()
            if (response.success) {
                setDeliveryFees(response.data ?? [])
                console.table(response.data)
            }
            toast({
                title: response.success ? "Loaded" : "Failed",
                description: response.message,
              })
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    //* delete fee item
    const deleteFeeItem = async (feeId: string) => {
        //* show toast
        toast({
            title: "Deleting...",
            description: "Work in progress",
        })
        //* delete item
        try {
            const response = await preferencesServices.deleteFeeItem(feeId)
            if (response.success) {
                setDeliveryFees(deliveryFees.filter(fee => fee.id !== feeId))
            }
            toast({
                title: response.success ? "Deleted" : "Failed",
                description: response.message,
            })
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                })
            }
        }
    }


    //* update fee item
    const updateFeeItem = async (feeId: string) => {
        //* show toast
        toast({
            title: "Updating...",
            description: "Work in progress",
        })
        //* update item
        try {
            const response = await preferencesServices.updateFeeItem(tempFeeItem,feeId)
            if (response.success) {
                setDeliveryFees(deliveryFees.map(fee => fee.id === feeId ? tempFeeItem : fee))
                setIsEditingId(null)
            }
            toast({
                title: response.success ? "Updated" : "Failed",
                description: response.message,
            })
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                })
            }
        }
    }


    //* handle create fee item
    const createFeeItem = async () => {
        //* show toast
        toast({
            title: "Creating...",
            description: "Work in progress",
        })
        //* create item
        try {
            const response = await preferencesServices.createNewFeeItem(tempFeeItem)
            if (response.success) {
                setDeliveryFees(prev => prev.splice(0,1))
                setDeliveryFees([...deliveryFees, tempFeeItem])
                setTempFeeItem(DEFAULT_FEE_ITEM)
                setIsNewItem(false)
                setIsEditingId(null)
            }
            toast({
                title: response.success ? "Created" : "Failed",
                description: response.message,
            })
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                })
            }
        }
    }


    //* on create new item clicked
    const onNewItemAddButtonClicked = () => {
        // allow only one item add at a time
        if (!isNewItem) {
            setIsNewItem(true)
            setTempFeeItem(DEFAULT_FEE_ITEM)
            //? add new item to the list with empty params to create the space to add
            setDeliveryFees(prev => [DEFAULT_FEE_ITEM, ...prev])
            setIsEditingId("")
        }
    }

    //* on cancel create click
    const onCancelCreate = () => {
        //* remove the empty item from the list
        setDeliveryFees(prev => prev.slice(1))
        setIsEditingId(null)
        setIsNewItem(false)
    }

    //* on save create click
    const onSaveCreate = () => {
        //* check if the item is empty
        if (tempFeeItem.city === "" || tempFeeItem.price === "") {
            toast({
                title: "Failed",
                description: "Please fill in all the fields",
            })
            return
        }
        createFeeItem()
    }

    //* on edit start clicked
    const onEditClicked = (feeId: string) => {
        setIsEditingId(feeId)
        setIsNewItem(false)
        setTempFeeItem(deliveryFees.find(fee => fee.id === feeId) || DEFAULT_FEE_ITEM)
    }


    //* on update clicked
    const onSaveUpdateClicked = (feeId: string) => {
        //* check if the item is empty
        if (tempFeeItem.city === "" || tempFeeItem.price === "") {
            toast({
                title: "Failed",
                description: "Please fill in all the fields",
            })
            return
        }
        updateFeeItem(feeId)
    }

    //* on cancel update clicked
    const onCancelUpdateClicked = () => { 
        setIsEditingId(null)
    }

    //* on delete clicked
    const onDeleteClicked = (feeId: string) => {
        deleteFeeItem(feeId)
    }

    //* on input change
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        setTempFeeItem(prev => ({ ...prev, [key]: e.target.value }))
    }



    //* load the data on component mount
    useEffect(() => { 
        loadFeesTable()
    }, [])
    
    if (isLoading) { 
        return <LoaderCircle className='animate-spin' />
    }


    //* widget body
    return (
        <div>
            <Table>
                <TableHeaderSection onNewItemAddButtonClicked={() => onNewItemAddButtonClicked()} />
                    {/* table body */}
                    <TableBody>
                        {deliveryFees.map((deliveryFeeItem, index) => (
                            <TableRow key={deliveryFeeItem.id}>
                                <TableCell className="pl-4">
                                    {index+1}
                                </TableCell>
                            <TableCell>
                                    {isEditing === deliveryFeeItem.id ?
                                        <Input
                                            value={tempFeeItem.city}
                                            onChange={(e) => onInputChange(e, "city")} /> : FirstLetterToCapital({word:deliveryFeeItem.city})}
                            </TableCell>
                            <TableCell>
                                {isEditing === deliveryFeeItem.id ?
                                        <Input
                                            type="number"
                                            value={tempFeeItem.price}
                                            onChange={(e) => onInputChange(e, "price")} /> : deliveryFeeItem.price}
                            </TableCell>
                            <TableCell>
                                {isEditing === deliveryFeeItem.id ?
                                        <Input
                                            value={tempFeeItem.currency || "DZD"}
                                            onChange={(e) => onInputChange(e, "currency")} /> : deliveryFeeItem.currency}
                            </TableCell>
                            <TableCell className="w-24 text-right pr-4">
                                    {/*  droop down menu */}
                                    {isNewItem && isEditing === deliveryFeeItem.id || isEditing === deliveryFeeItem.id
                                        ? <div className="flex gap-2">
                                        <Button onClick={() => {isNewItem? onSaveCreate() : onSaveUpdateClicked(deliveryFeeItem.id)}}>
                                        <Save />
                                        Save
                                            </Button>
                                            <Button onClick={() => {isNewItem? onCancelCreate() : onCancelUpdateClicked()}}>
                                                Cancel
                                        </Button>
                                        </div>
                                        : <ActionsDialog
                                        onEditClick={() => onEditClicked(deliveryFeeItem.id)}
                                        onDeleteClick={() => onDeleteClicked(deliveryFeeItem.id)} />}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
            </Table>
        </div>
    )

}