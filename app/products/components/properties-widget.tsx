import { useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, TrashIcon, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type ValuesTypeForProperties = {
    value: string;
    changePrice: boolean;
    newPrice?: string | null;
}

type PropertyType = {
    label: string;
    values: ValuesTypeForProperties[];
}

interface PropertyWidgetProps {
    propertiesList: PropertyType[];          
    onPropertyAdd: (property: PropertyType) => void;    
    onPropertyRemove: (propertyLabel: string) => void;
    onPropertyUpdate: (property: PropertyType, oldLabel: string) => void;
}

export default function PropertiesWidget({ 
    propertiesList, 
    onPropertyAdd, 
    onPropertyRemove,
    onPropertyUpdate
}: PropertyWidgetProps) {
    // State for property being edited/created
    const [currentProperty, setCurrentProperty] = useState<PropertyType | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingLabel, setEditingLabel] = useState("");
    const [labelError, setLabelError] = useState<string | null>(null);

    // State for new value being added
    const [newValue, setNewValue] = useState("");
    const [newValuePrice, setNewValuePrice] = useState("");
    const [shouldChangePrice, setShouldChangePrice] = useState(false);

    const validatePropertyLabel = (label: string): boolean => {
        if (!label.trim()) {
            setLabelError("Property label cannot be empty");
            return false;
        }

        const isDuplicate = propertiesList.some(property => 
            property.label.toLowerCase() === label.trim().toLowerCase() &&
            (!isEditing || property.label.toLowerCase() !== editingLabel.toLowerCase())
        );

        if (isDuplicate) {
            setLabelError("A property with this label already exists");
            return false;
        }

        setLabelError(null);
        return true;
    };

    const handleAddValue = (e: React.MouseEvent) => {
        e.preventDefault()
        if (!currentProperty || !newValue.trim()) return;

        // Check if value already exists
        if (currentProperty.values.some(v => v.value.toLowerCase() === newValue.trim().toLowerCase())) {
            return; // Don't add duplicate values
        }

        const newValueObj: ValuesTypeForProperties = {
            value: newValue.trim(),
            changePrice: shouldChangePrice,
            newPrice: shouldChangePrice ? newValuePrice : null
        };

        setCurrentProperty({
            ...currentProperty,
            values: [...currentProperty.values, newValueObj]
        });

        // Reset value inputs
        setNewValue("");
        setNewValuePrice("");
        setShouldChangePrice(false);
    };

    const handleRemoveValue = (propertyLabel: string, valueIndex: number, e: React.MouseEvent) => {
        e.preventDefault()
        const property = propertiesList.find(p => p.label === propertyLabel);
        if (!property) return;

        const updatedValues = property.values.filter((_, index) => index !== valueIndex);
        onPropertyUpdate({
            ...property,
            values: updatedValues
        }, propertyLabel);
    };

    const handleRemoveCurrentValue = (valueIndex: number, e: React.MouseEvent) => {
        e.preventDefault()
        if (!currentProperty) return;
        
        const updatedValues = currentProperty.values.filter((_, index) => index !== valueIndex);
        setCurrentProperty({
            ...currentProperty,
            values: updatedValues
        });
    };

    const handleSaveProperty = (e: React.MouseEvent) => {
        e.preventDefault()
        if (!currentProperty || !currentProperty.label.trim()) return;
        
        if (!validatePropertyLabel(currentProperty.label)) {
            return;
        }

        if (isEditing) {
            onPropertyUpdate(currentProperty, editingLabel);
        } else {
            onPropertyAdd(currentProperty);
        }

        // Reset states
        setCurrentProperty(null);
        setIsEditing(false);
        setEditingLabel("");
        setLabelError(null);
    };

    const handleLabelChange = (newLabel: string) => {
        if (currentProperty) {
            validatePropertyLabel(newLabel);
            setCurrentProperty({
                ...currentProperty,
                label: newLabel
            });
        }
    };

    const startEditing = (property: PropertyType, e: React.MouseEvent) => {
        e.preventDefault()
        setCurrentProperty({ ...property });
        setIsEditing(true);
        setEditingLabel(property.label);
        setLabelError(null);
    };

    const startNewProperty = (e: React.MouseEvent) => {
        e.preventDefault()
        setCurrentProperty({
            label: "",
            values: []
        });
        setIsEditing(false);
        setEditingLabel("");
        setLabelError(null);
    };

    return (
        <div className="space-y-4">
            <div>
                <Badge>Properties</Badge>
                <p className="text-gray-500 text-xs mt-2">
                    Properties are additional information about the product that help customers understand available variants and options.
                </p>
            </div>

            {propertiesList.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/4">Label</TableHead>
                            <TableHead className="w-2/4">Values</TableHead>
                            <TableHead className="w-1/4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {propertiesList.map((property) => (
                            <TableRow key={property.label}>
                                <TableCell>
                                    <Badge className="font-light text-sm">{property.label}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {property.values.map((value, valueIndex) => (
                                            <Badge 
                                                key={`${property.label}-value-${valueIndex}`}
                                                variant="secondary"
                                                className="text-gray-500 font-normal text-sm flex items-center gap-2"
                                            >
                                                {value.value}
                                                {value.changePrice && (
                                                    <span className="text-green-500">
                                                        {value.newPrice}DZD
                                                    </span>
                                                )}
                                                <X 
                                                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                                                    onClick={(e) => handleRemoveValue(property.label, valueIndex,e)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => onPropertyRemove(property.label)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-100"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={(e) => startEditing(property,e)}
                                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-100"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {!currentProperty && (
                <Button onClick={startNewProperty}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Property
                </Button>
            )}

            {/* Property Creation/Editing Form */}
            {currentProperty && (
                <div className="space-y-4 border p-4 rounded-md">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="w-1/3">
                                <Input
                                    type="text"
                                    value={currentProperty.label}
                                    onChange={(e) => handleLabelChange(e.target.value)}
                                    placeholder="Property name"
                                    className={labelError ? "border-red-500" : ""}
                                />
                                {labelError && (
                                    <p className="text-red-500 text-xs mt-1">{labelError}</p>
                                )}
                            </div>
                            <Button 
                                onClick={handleSaveProperty}
                                disabled={!!labelError || !currentProperty.label.trim()}
                            >
                                {isEditing ? "Update Property" : "Create Property"}
                            </Button>
                            <Button variant="outline" onClick={() => setCurrentProperty(null)}>
                                Cancel
                            </Button>
                        </div>
                    </div>

                    {/* Current Values Display */}
                    <div className="flex flex-wrap gap-1">
                        {currentProperty.values.map((value, valueIndex) => (
                            <Badge 
                                key={`current-value-${valueIndex}`}
                                variant="secondary"
                                className="text-gray-500 font-normal text-sm flex items-center gap-2"
                            >
                                {value.value}
                                {value.changePrice && (
                                    <span className="text-green-500">
                                        {value.newPrice}DZD
                                    </span>
                                )}
                                <X 
                                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                                    onClick={(e) => handleRemoveCurrentValue(valueIndex,e)}
                                />
                            </Badge>
                        ))}
                    </div>

                    {/* Value Addition Form */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <Input
                            type="text"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            placeholder="Value"
                            className="w-1/3"
                        />
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={shouldChangePrice}
                                onCheckedChange={(checked) => setShouldChangePrice(checked as boolean)}
                            />
                            <span className="text-sm">Changes price?</span>
                        </div>
                        {shouldChangePrice && (
                            <Input
                                type="number"
                                value={newValuePrice}
                                onChange={(e) => setNewValuePrice(e.target.value)}
                                placeholder="Price adjustment"
                                className="w-1/4"
                            />
                        )}
                        <Button onClick={handleAddValue}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Value
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}