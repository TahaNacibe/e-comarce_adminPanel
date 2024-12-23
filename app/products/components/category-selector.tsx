"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Command,CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { Category } from "../types/pageTypes";


 //* categories selector interface
 interface CategorySelectorProps {
    categories: Category[];
    selectedCategories: Category[];
    onSelect: (categoryId: number) => void;
    onRemove: (categoryId: number) => void;
  }
  

  //*  CategorySelector component
  export function CategorySelector({
    categories,
    selectedCategories,
    onSelect,
    onRemove,
  }: CategorySelectorProps) {
      // manage state vars 
    const [isOpen, setIsOpen] = useState(false);
  
    // ui tree
    return (
        <div className="space-y-2 bg-background">
        {/* badge of title */}
            <Badge>Categories</Badge>
        {/* popover */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
        {/* default state */}
            <Button variant="outline" className="w-full justify-start">
              <Search className="mr-2 h-4 w-4" />
              Search categories...
            </Button>
                </PopoverTrigger>
        {/* popover content */}
                <PopoverContent className="p-0 bg-background" side="bottom" align="start">
        {/* search command */}
            <Command>
            <CommandInput placeholder="Search categories..." />
        {/* empty search result state */}
            <CommandEmpty>No categories found.</CommandEmpty>
        {/* categories list */}
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    onSelect={() => {
                      onSelect(category.id);
                      setIsOpen(false);
                    }}
                  >
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
  
        {/* selected categories widgets display */}
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <Badge
              key={category.id}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1 hover:text-red-500 hover:bg-red-100"
            >
            {category.name}
            {/* remove button */}
              <button
                type="button"
                onClick={() => onRemove(category.id)}
                className="hover:text-red-500 hover:bg-red-100"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    );
  }
  