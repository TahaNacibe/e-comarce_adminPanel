import { ConfirmActionDialog } from "@/app/components/confirmActionDialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Delete, Edit2, MoreHorizontal, MoreVertical, Trash2 } from "lucide-react";




export default function ActionsDialog({
    onEditClick,
    onDeleteClick,
}:{onEditClick: () => void,
    onDeleteClick: () => void,}) {
    
    return (
        <DropdownMenu>
        {/* trigger dialog box button */}
        <DropdownMenuTrigger asChild>
        <Button variant="ghost">
        <MoreVertical />
        </Button>
            </DropdownMenuTrigger>
            
            {/* dialog box */}
            <DropdownMenuContent className="gap-2">
                <DropdownMenuItem asChild>
                <Button variant="ghost" onClick={onEditClick} className="w-full pb-2">
                    <Edit2 />
                    Edit</Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                <ConfirmActionDialog title={"Delete item?"} description={`want to delete the item?`}
                        action={() => onDeleteClick()} trigger={
                            <Button variant="ghost" onClick={() => { }} className="w-full text-red-700 border-red-800">
                <Trash2 />
                Delete</Button>} />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}