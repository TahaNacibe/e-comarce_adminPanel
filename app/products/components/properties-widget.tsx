import { useState } from "react";
import { PropertiesInterface } from "../types/pageTypes";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, TrashIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";



interface PropertyWidgetProps {
    properties: PropertiesInterface[];          
    onPropertyAdd: (property: PropertiesInterface) => void;    
    onPropertyRemoved: (index: number) => void; 
    onPropertyEdited:(editedProperty:PropertiesInterface,itemIndex:number) => void
}


type ValuesTypeForProperties = {
    value: string,
            changePrice: boolean,
            newPrice: number,
}

type PropertyType = {
    label: string,
    values: ValuesTypeForProperties[]
}



export default function PropertiesWidget({ 
    properties, 
    onPropertyAdd, 
    onPropertyRemoved,
    onPropertyEdited
}: PropertyWidgetProps) {


    // State management 
    const [label, setLabel] = useState("");     
    const [values, setValues] = useState(""); 
    const [isInEdit, setIsInEdit] = useState(false)
    const [editedPropertyIndex, setOnEditPropertyIndex] = useState<number | null>(null)
    const [property, setProperty] = useState<PropertyType>()
    const [propertiesList, setPropertiesList] = useState<PropertyType[]>([])


    //* add a new property item
    const handleAddNewPropertyItem = (e: React.MouseEvent) => {
        e.preventDefault()
        if (label.trim() && propertiesList.some((property) => property.label.toLowerCase() !== label.trim().toLowerCase())) {
            const newPropertyItem: PropertyType = {
                label,
                values:[]
            }
            setPropertiesList(prev => [...prev, newPropertyItem])
        }
    }




    // Handler for adding new properties
    const handleAddProperty = (e: React.MouseEvent) => {
        e.preventDefault();
        // Only add if both fields have content
        if (label.trim() && values.trim()) {
            if (isInEdit && editedPropertyIndex !== null) {
                console.log("is edit case")
                onPropertyEdited({ label: label.trim(), values: values.trim() }, editedPropertyIndex)
            } else {
                console.log("in create case")
                onPropertyAdd({ label: label.trim(), values: values.trim() });
            }
            setValues("");
            setLabel("");
            setIsInEdit(false)
            setOnEditPropertyIndex(null)
        }
    };

    // handle edit for property
    const handleEditAction = (index: number, e: React.MouseEvent) => {
        e.preventDefault()
        setIsInEdit(true)
        setOnEditPropertyIndex(index)
        // set for edit
        setValues(properties[index].values)
        setLabel(properties[index].label)
    }


    // handle removing item
    const handleRemoveAction = (index: number, e: React.MouseEvent) => {
        e.preventDefault()
        onPropertyRemoved(index)
    }

    // cancel edit process
    const cancelEditProcess = () => {
        setIsInEdit(false)
        setLabel("")
        setValues("")
        setOnEditPropertyIndex(null)
    }


    // action components
    const ActionComponents = ({ itemIndex }: { itemIndex:number}) => {
        if (isInEdit && editedPropertyIndex === itemIndex) {
            //* show edit tag
            return (
                <div className="gap-1 w-full flex justify-end">
                    <Badge
                        onClick={() => cancelEditProcess()}
                        className="gap-2 cursor-pointer">
                        <h1>
                        Editing
                    </h1>
                    <X size={15} />
                </Badge>
                </div>
            )
        } else {
            //* show normal actions
            return (
                <div className="flex justify-end gap-2">
                                        {/* Delete button */}
                                        <Button
                                            variant="outline"
                                            onClick={(e) => handleRemoveAction(itemIndex,e)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-100"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>

                                        {/* Edit button */}
                                        <Button
                                            variant="outline"
                                            onClick={(e) => handleEditAction(itemIndex,e)}
                                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-100"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    </div>
            )
        }
    }


    // ui tree
    return (
        <div className="space-y-4">
            {/* Header section with title and description */}
            <div>
                <Badge>Properties</Badge>
                <p className="text-gray-500 text-xs mt-2">
                    Properties are additional information about the product that help customers understand available variants and options.
                </p>
            </div>

            {/* Only render table if there are properties to display */}
            {properties.length > 0 && (
                <Table>
                    {/* Table header with column definitions */}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/4">Label</TableHead>
                            <TableHead className="w-2/4">Values</TableHead>
                            <TableHead className="w-1/4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    {/* Table body containing property rows */}
                    <TableBody>
                        {properties.map((property, index) => (
                            <TableRow key={`property-${index}`}>
                                {/* Property label column */}
                                <TableCell>
                                    <Badge className="font-light text-sm">{property.label}</Badge>
                                </TableCell>

                                {/* Property values column - displays each value as a badge */}
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {property.values.split(",").map((value, valueIndex) => (
                                            <Badge 
                                                key={`value-${valueIndex}`}
                                                variant="secondary"
                                                className="text-gray-500 font-normal text-sm"
                                            >
                                                {value.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>

                                {/* Actions column with edit and delete buttons */}
                                <TableCell className="text-right">
                                    <ActionComponents itemIndex={index} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Form for adding new properties */}
            <div className="flex items-center gap-4">
                {/* Property name input */}
                <Input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Property name"
                    className="w-1/2"
                />

                {/* Property values input */}
                <Input
                    type="text"
                    value={values}
                    onChange={(e) => setValues(e.target.value)}
                    placeholder="Values (comma-separated, e.g.: red, blue)"
                    className="w-1/2"
                />

                {/* Add button */}
                <Button onClick={handleAddProperty}>
                    {isInEdit? "Edit" : "Add"}
                </Button>
            </div>
        </div>
    );
}