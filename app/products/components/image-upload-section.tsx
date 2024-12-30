import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ImagePlus, Plus } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useState, useEffect } from "react";
import { FormErrors } from "../types/pageTypes";

interface ImageUploadProps {
  bigImage: File | null;
  smallImages: File[];
  existingBigImage: string | null;
  existingSmallImages: string[] | null;
  onBigImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSmallImageAdd: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveBigImage: () => void;
  onRemoveSmallImage: (index: number) => void;
  onRemoveExistingBigImage: () => void;
  onRemoveExistingSmallImage: (index: number) => void;
  errors: FormErrors;
}

export function ImageUploadSection({
  bigImage,
  smallImages,
  existingBigImage,
  existingSmallImages,
  onBigImageChange,
  onSmallImageAdd,
  onRemoveBigImage,
  onRemoveSmallImage,
  onRemoveExistingBigImage,
  onRemoveExistingSmallImage,
  errors,
}: ImageUploadProps) {
  // Preview URLs for the images
  const [bigImagePreview, setBigImagePreview] = useState<string | null>(null);
  const [smallImagePreviews, setSmallImagePreviews] = useState<string[]>([]);

  // Generate preview for the big image
  useEffect(() => {
    if (bigImage) {
      const previewUrl = URL.createObjectURL(bigImage);
      setBigImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
    setBigImagePreview(null);
  }, [bigImage]);

  // Generate previews for additional images
  useEffect(() => {
    const previews = smallImages.map((file) => URL.createObjectURL(file));
    setSmallImagePreviews(previews);
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [smallImages]);

  return (
    <div className="space-y-6">
      {/* Main Image Section */}
      <div className="space-y-2">
        <Badge>
          Main Image{" "}
          {errors.bigImage && (
            <span className="text-red-500 text-sm">({errors.bigImage})</span>
          )}
        </Badge>
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          {bigImagePreview || existingBigImage ? (
            <div className="relative">
              <Image
                src={bigImagePreview || existingBigImage || ''}
                width={500}
                height={500}
                alt="Main product"
                className="w-full h-64 object-contain"
              />
              <Button
                size="sm"
                className="absolute top-2 right-2"
                onClick={existingBigImage ? onRemoveExistingBigImage : onRemoveBigImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="cursor-pointer block p-8 hover:bg-gray-50 transition-colors">
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

      {/* Additional Images Section */}
      <div className="space-y-2 pb-3 md:pb-0">
        <Badge>
          Additional Images{" "}
          {errors.smallImages && (
            <span className="text-red-500 text-sm">({errors.smallImages})</span>
          )}
        </Badge>
        <p className="text-sm text-gray-600 px-1 py-2">
          Note: The more images you add, the longer it will take to upload the
          product. Please be patient and add only necessary images.
        </p>
        <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
          {/* Display existing additional images */}
          {existingSmallImages?.map((imageUrl, index) => (
            <div key={`existing-${index}`} className="relative group">
              <Image
                src={imageUrl}
                alt={`Product ${index + 1}`}
                width={160}
                height={160}
                className="w-full h-40 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  onRemoveExistingSmallImage(index);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {/* Display newly added additional images */}
          {smallImagePreviews.map((preview, index) => (
            <div key={`new-${index}`} className="relative group">
              <Image
                src={preview}
                alt={`New Product ${index + 1}`}
                width={160}
                height={160}
                className="w-full h-40 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  onRemoveSmallImage(index);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {/* Add new image button */}
          <label className="cursor-pointer flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg hover:bg-gray-50/10 transition-colors">
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