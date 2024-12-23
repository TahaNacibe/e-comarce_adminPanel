import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ImagePlus, Plus } from "lucide-react";
import Image from "next/image";
import { ChangeEvent } from "react";
import { FormErrors } from "../types/pageTypes";


// image upload handle props
  interface ImageUploadProps {
    bigImage: string | null;
    smallImages: string[];
    onBigImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSmallImageAdd: (e: ChangeEvent<HTMLInputElement>) => void;
    onRemoveBigImage: () => void;
    onRemoveSmallImage: (index: number) => void;
    errors: FormErrors;
  }

  // images section 
  export function ImageUploadSection({
    bigImage,
    smallImages,
    onBigImageChange,
    onSmallImageAdd,
    onRemoveBigImage,
    onRemoveSmallImage,
    errors,
  }: ImageUploadProps) {
      
    // ui tree
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Badge>Main Image {errors.bigImage && <span className="text-red-500 text-sm">({errors.bigImage})</span>}</Badge>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            {bigImage ? (
                <div className="relative">
                {/* Display the main image */}
                <Image src={bigImage} width={500} height={500} alt="Main product" className="w-full h-64 object-contain" />
                <Button
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={onRemoveBigImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
                <label className="cursor-pointer block p-8 hover:bg-gray-50 transition-colors">
                {/* Upload button */}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onBigImageChange}
                />
                <div className="flex flex-col items-center justify-center gap-2 h-56">
                  <ImagePlus className="h-8 w-8 text-gray-400" />
                  <span className="text-gray-600">Upload main image</span>
                </div>
              </label>
            )}
          </div>
        </div>
  
        {/* Additional images */}
        <div className="space-y-2">
          <Badge>Additional Images {errors.smallImages && <span className="text-red-500 text-sm">({errors.smallImages})</span>}</Badge>
        {/* note */}
        <p className="text-sm text-gray-600 px-1 py-2">
                    Note: The more images you add, the longer it will take to upload the product. Please be patient. and add images only necessary.
          </p>
            <div className="grid grid-cols-4 gap-4">
            {/* display selected images */}
            {smallImages.map((image, index) => (
              <div key={index} className="relative group">
                <img src={image} alt={`Product ${index + 1}`} className="w-full h-40 object-cover rounded-lg" />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveSmallImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {/* add new image button */}
            <label className="cursor-pointer flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onSmallImageAdd}
              />
              <Plus className="h-8 w-8 text-gray-400" />
            </label>
          </div>
        </div>
      </div>
    );
  }
  