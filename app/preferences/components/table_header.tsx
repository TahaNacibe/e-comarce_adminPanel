import { TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, DollarSign, ListOrdered } from 'lucide-react';

const TableHeaderSection = ({ onNewItemAddButtonClicked }:{onNewItemAddButtonClicked:() => void}) => {
  return (
    <TableHeader>
      {/* Add Button Row */}
      <TableRow className="hover:bg-transparent border-b-0">
        <TableHead className="p-4" colSpan={4}>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onNewItemAddButtonClicked}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add new Item
          </Button>
        </TableHead>
      </TableRow>

      {/* Column Headers Row */}
      <TableRow className="bg-muted/50">
        <TableHead className="py-3 pl-4 w-fit">
          <div className="flex items-center gap-2">
            <ListOrdered className="h-4 w-4" />
          </div>
        </TableHead>
        <TableHead className="py-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>City</span>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Fee</span>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            <span>Currency</span>
          </div>
        </TableHead>
        <TableHead className="w-24 text-right pr-4">
          <div className="flex items-center justify-end">
            <span>Actions</span>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TableHeaderSection;