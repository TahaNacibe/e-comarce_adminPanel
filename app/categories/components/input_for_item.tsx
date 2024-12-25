import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tags, MoreVertical, Search } from 'lucide-react';
import { Category } from '@/app/products/types/pageTypes';
import CategoriesServices from '@/app/services/categories/categories_services';
import { useEffect, useState } from 'react';
import { CategorySelector } from '@/app/products/components/category-selector';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

interface CategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoriesList: Category[];
  editData?: {
    title: string;
    description: string;
    editTargetId: string;
    parent: Category | null;
  } | null;
  onCategoryAdd: (response: any) => void;
  onErrorHold: (error: Error) => void;
  onEditCompleted: (response: any) => void;
  notifyUserOnActionStart: (action: "Updating" | "Creating") => void;
}

const CategorySheet: React.FC<CategorySheetProps> = ({
  open,
  onOpenChange,
  categoriesList,
  editData,
  onCategoryAdd,
  onErrorHold,
  onEditCompleted,
  notifyUserOnActionStart
}) => {
  const [formData, setFormData] = useState({
    categoryTitle: '',
    categoryDesc: '',
    selectedCategoryParent: null as Category | null
  });
  const [isOpen,setIsOpen] = useState(false)
  // Reset form when sheet opens/closes or editData changes
  useEffect(() => {
    if (open && editData) {
      setFormData({
        categoryTitle: editData.title,
        categoryDesc: editData.description,
        selectedCategoryParent: editData.parent
      });
    } else if (!open) {
      // Reset form when sheet closes
      setFormData({
        categoryTitle: '',
        categoryDesc: '',
        selectedCategoryParent: null
      });
    }
  }, [open, editData]);

  const categoriesServices = new CategoriesServices();

  const resetForm = (): void => {
    setFormData({
      categoryTitle: '',
      categoryDesc: '',
      selectedCategoryParent: null
    });
    onOpenChange(false);
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setFormData(prev => ({ ...prev, categoryDesc: e.target.value }));
  };

  const createOrUpdateCategory = async (): Promise<void> => {
    try {
      if (editData?.editTargetId) {
        notifyUserOnActionStart("Updating");
        const response = await categoriesServices.updateExistingCategory({
          name: formData.categoryTitle,
          description: formData.categoryDesc,
          categoryIdForEdit: editData.editTargetId,
          parentId: formData.selectedCategoryParent? formData.selectedCategoryParent.id.toString() : null
        });
        resetForm();
        onEditCompleted(response);
      } else {
        notifyUserOnActionStart("Creating");
        const response = await categoriesServices.createNewCategoryInDb({
          title: formData.categoryTitle,
          description: formData.categoryDesc,
          parent: formData.selectedCategoryParent
        });
        resetForm();
        onCategoryAdd(response);
      }
    } catch (error) {
      onErrorHold(error as Error);
    }
  };

  const isEdit = Boolean(editData);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-5">
          <SheetTitle className='font-medium'>{isEdit ? "Edit Category" : "Create New Category"}</SheetTitle>
          <SheetDescription >
            {isEdit ? "Update your category information" : "Add a new category to organize your products"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Badge>
              Category Name
              </Badge>
              <Input
                id="title"
                placeholder="Enter category name"
                value={formData.categoryTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryTitle: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Badge>Description</Badge>
              <Textarea
                id="description"
                placeholder="Enter category description"
                value={formData.categoryDesc}
                onChange={handleDescChange}
                className="resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Badge>Parent Category (Optional)</Badge>
             
              {/* experiment area */}
              <div className="space-y-2 bg-background">
        {/* popover */}
        <Popover open={isOpen} onOpenChange={() =>setIsOpen(!isOpen)}>
                <PopoverTrigger asChild>
        {/* default state */}
            <Button variant="outline" className="w-full justify-start">
              <Search className="mr-2 h-4 w-4" />
              {formData.selectedCategoryParent? formData.selectedCategoryParent.name : "Search categories..."}
            </Button>
                </PopoverTrigger>
        {/* popover content */}
                <PopoverContent className="p-0 bg-background z-40" side="bottom" align="start">
        {/* search command */}
            <Command className='rounded-lg'>
            <CommandInput placeholder="Search categories..." />
        {/* empty search result state */}
            <CommandEmpty>{'No categories found.'}</CommandEmpty>
                      {/* categories list */}
                      <ScrollArea className="max-h-[200px]">

              <CommandGroup className='rounded-lg'>
                        {categoriesList.map((category) => {
                           //* don't show the category in the list so no cat can be a parent to it self
                      if (category.name === formData.categoryTitle) return;

                      //* return the list
                  return (
                    <CommandItem
                      key={category.id}
                      onSelect={() => {
                        setFormData(prev => ({ ...prev, selectedCategoryParent: category }))
                        setIsOpen(false);
                      }}
                    >
                      {category.name}
                      {formData.selectedCategoryParent?.id === category.id && (
                              <Badge variant="secondary">Selected</Badge>
                            )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
                      </ScrollArea>
            </Command>
          </PopoverContent>
                </Popover>
              </ div>
              <p className='text-xs px-1 text-gray-600'>
                parent category are used to define relations between categories and make it easyer to find similar products for your clients, and for you to to better orgaanize your products
              </p>
            </div>
          </div>

          <Alert>
            <Tags className="h-4 w-4" />
            <AlertTitle>Category Information</AlertTitle>
            <AlertDescription className='text-xs text-gray-500'>
              Categories help organize your products and make them easier to find. A good description helps both you and your customers understand what belongs in this category.
              {formData.selectedCategoryParent && (
                <div className="mt-2">
                  This will be a subcategory of <Badge variant="secondary">{formData.selectedCategoryParent.name}</Badge>
                </div>
              )}
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-3">
            <Button
              onClick={createOrUpdateCategory}
              disabled={!formData.categoryTitle.trim()}
            >
              {isEdit ? "Update Category" : "Create Category"}
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CategorySheet;