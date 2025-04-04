
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { transformationStyles, applySimulatedTransform } from "@/utils/imageTransformUtils";
import ImageUploader from "./ImageUploader";
import TransformedImage from "./TransformedImage";
import StyleSelector from "./StyleSelector";

const ImageTransformer = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTransform = async () => {
    if (!selectedImage || !selectedStyle) {
      toast({
        title: "Missing information",
        description: "Please select both an image and a style",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // For browser-only implementation, we're using canvas-based effects
      // In a production app, you'd call a real API endpoint here
      const transformedImageData = await applySimulatedTransform(selectedImage, selectedStyle);
      setTransformedImage(transformedImageData);
      
      toast({
        title: "Transformation complete!",
        description: `Image transformed using ${transformationStyles.find(style => style.id === selectedStyle)?.name} style`,
      });
    } catch (error) {
      console.error("Error transforming image:", error);
      toast({
        title: "Transformation failed",
        description: "There was an error transforming your image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        <span className="buddy-gradient-text">AI Image Transformer</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploader 
          selectedImage={selectedImage} 
          setSelectedImage={(image) => {
            setSelectedImage(image);
            setTransformedImage(null);
          }} 
        />
        
        <TransformedImage 
          transformedImage={transformedImage}
          isLoading={isLoading}
          selectedStyle={selectedStyle}
        />
      </div>
      
      <StyleSelector 
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
        transformationStyles={transformationStyles}
        selectedImage={selectedImage}
        isLoading={isLoading}
        onTransform={handleTransform}
      />
    </div>
  );
};

export default ImageTransformer;
