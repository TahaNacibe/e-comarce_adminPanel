import React from 'react';
import { Pagination, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis, PaginationContent } from "@/components/ui/pagination"

const PaginationWidget = ({ pagesCount, activePageIndex, handlePageChange,searchQuery }: { pagesCount: number, activePageIndex: number, handlePageChange: any,searchQuery:string | null }) => {
    return (
        <Pagination>
            <PaginationContent>
                {/* Show Previous Button if not on the first page */}
                {activePageIndex > 1 && (
                    <PaginationItem className='cursor-pointer border rounded-lg'>
                        <PaginationPrevious onClick={() => handlePageChange(activePageIndex - 1,searchQuery)} />
                    </PaginationItem>
                )}

                {/* Show Ellipsis if there are more pages */}
                {activePageIndex > 3 && (
                    <PaginationItem className='cursor-pointer hover:bg-gray-100 rounded-lg'>
                        <PaginationEllipsis onClick={() => handlePageChange(1,searchQuery)} />
                    </PaginationItem>
                )}

                {/* Show Previous Page Number if not on the first page */}
                {activePageIndex > 1 && (
                    <PaginationItem className='cursor-pointer'>
                        <PaginationLink onClick={() => handlePageChange(activePageIndex - 1,searchQuery)}>
                            {activePageIndex - 1}
                        </PaginationLink>
                    </PaginationItem>
                )}

                {/* Show Active Page Number */}
                <PaginationItem className='cursor-pointer'>
                    <PaginationLink onClick={() => handlePageChange(activePageIndex,searchQuery)} isActive>
                        {activePageIndex}
                    </PaginationLink>
                </PaginationItem>

                {/* Show Next Page Number if not on the last page */}
                {activePageIndex < pagesCount && (
                    <PaginationItem className='cursor-pointer'>
                        <PaginationLink onClick={() => handlePageChange(activePageIndex + 1,searchQuery)}>
                            {activePageIndex + 1}
                        </PaginationLink>
                    </PaginationItem>
                )}

                {/* Show Ellipsis if there are more pages */}
                {activePageIndex < pagesCount - 1 && (
                    <PaginationItem className='cursor-pointer hover:bg-gray-100 rounded-lg'>
                        <PaginationEllipsis onClick={() => handlePageChange(pagesCount,searchQuery)} />
                    </PaginationItem>
                )}

                {/* Show Next Button if not on the last page */}
                {activePageIndex < pagesCount && (
                    <PaginationItem className='cursor-pointer border rounded-lg'>
                        <PaginationNext onClick={() => handlePageChange(activePageIndex + 1,searchQuery)} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationWidget;
