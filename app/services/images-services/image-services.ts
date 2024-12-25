// Standard response type for all operations
type ServiceResponse<T> = {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
  };
  
  // Cloudinary API response type
  type CloudinaryResponse = {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
  };
  
  // Final upload results type
  type UploadResults = {
    bigImage: string;
    smallImages: string[];
  };
  
  export default class ImageServices {
    async uploadToCloudinary(file: File): Promise<ServiceResponse<string>> {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
  
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
  
        if (!response.ok) {
          return {
            success: false,
            message: `Failed to upload ${file.name}`,
            error: `HTTP error! status: ${response.status}`
          };
        }
  
        const data: CloudinaryResponse = await response.json();
        return {
          success: true,
          message: `Successfully uploaded ${file.name}`,
          data: data.secure_url
        };
      } catch (error) {
        return {
          success: false,
          message: `Failed to upload ${file.name}`,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
    }
  
    public async handleImagesUpload(
      bigImageFile: File,
      otherImages: File[]
    ): Promise<ServiceResponse<UploadResults>> {
      try {
        // Upload the big image first
        const mainImageResult = await this.uploadToCloudinary(bigImageFile);
        if (!mainImageResult.success) {
          return {
            success: false,
            message: 'Failed to upload main image',
            error: mainImageResult.error
          };
        }
  
        // Upload all other images in parallel
        const smallImageResults = await Promise.all(
          otherImages.map(file => this.uploadToCloudinary(file))
        );
  
        // Collect successful uploads and errors
        const successfulUploads = smallImageResults
          .filter(result => result.success && result.data)
          .map(result => result.data!);
  
        const errors = smallImageResults
          .filter(result => !result.success)
          .map(result => result.error);
  
        // If we have any successful uploads but some failed, partial success
        if (successfulUploads.length > 0 && errors.length > 0) {
          return {
            success: true,
            message: 'Completed with some failures',
            data: {
              bigImage: mainImageResult.data!,
              smallImages: successfulUploads
            },
            error: `Some images failed to upload: ${errors.join(', ')}`
          };
        }
  
        // If all small images failed
        if (successfulUploads.length === 0 && otherImages.length > 0) {
          return {
            success: false,
            message: 'Failed to upload additional images',
            error: errors.join(', ')
          };
        }
  
        // Complete success
        return {
          success: true,
          message: 'All images uploaded successfully',
          data: {
            bigImage: mainImageResult.data!,
            smallImages: successfulUploads
          }
        };
  
      } catch (error) {
        return {
          success: false,
          message: 'Upload process failed',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
    }
  }