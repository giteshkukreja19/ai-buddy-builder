
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
}

const ImageUploader = ({ selectedImage, setSelectedImage }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Original Image</CardTitle>
        <CardDescription>Upload an image to transform</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        {selectedImage ? (
          <div className="relative w-full aspect-square max-h-[400px] overflow-hidden rounded-md mb-4">
            <img
              src={selectedImage}
              alt="Original"
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-md w-full aspect-square max-h-[400px] flex flex-col items-center justify-center p-4 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={triggerFileInput}
          >
            <ImageIcon size={64} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Click to upload an image
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: JPG, PNG, WebP (max 5MB)
            </p>
          </div>
        )}
        <Button 
          onClick={triggerFileInput} 
          variant="outline" 
          className="mt-2 w-full"
        >
          <Upload size={18} className="mr-2" />
          {selectedImage ? "Change Image" : "Upload Image"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
