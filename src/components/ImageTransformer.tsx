
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Download, Image as ImageIcon, Wand2 } from "lucide-react";
import { HfInference } from "@huggingface/inference";

const transformationStyles = [
  {
    id: "portrait-sketch",
    name: "Portrait Sketch",
    description: "Highly detailed hand-drawn portrait with fine pencil strokes and grayscale shading",
    model: "vinesmsuic/portraitsketch-diffusion",
    prompt: "Transform this image into a highly detailed, hand-drawn portrait sketch."
  },
  {
    id: "ghibli",
    name: "Studio Ghibli",
    description: "Soft, dreamy animation style with vibrant colors and whimsical elements",
    model: "nitrosocke/Ghibli-Diffusion",
    prompt: "Reimagine this image in the style of a Studio Ghibli animated film."
  },
  {
    id: "anime",
    name: "Anime Style",
    description: "Bold lines, vibrant colors, and expressive anime aesthetics",
    model: "cagliostrolab/animagine-xl-3.1",
    prompt: "Convert this image into anime style artwork with clean, bold outlines."
  },
  {
    id: "watercolor",
    name: "Watercolor Painting",
    description: "Soft, flowing watercolor art with gentle color blending",
    model: "cyborgcamel/WatercolorDiffusion",
    prompt: "Transform this image into a delicate watercolor painting."
  }
];

// Initialize the Hugging Face Inference client
// Note: In production, you'd want to handle API keys securely
const inference = new HfInference();

const ImageTransformer = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
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
        setTransformedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStyleSelect = (value: string) => {
    setSelectedStyle(value);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const applySimulatedTransform = (imageDataUrl: string) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(imageDataUrl); // Fallback if canvas context can't be created
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Apply a style based on selection (basic canvas filters)
        switch (selectedStyle) {
          case 'portrait-sketch':
            // Apply grayscale
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              data[i] = avg; // red
              data[i + 1] = avg; // green
              data[i + 2] = avg; // blue
            }
            ctx.putImageData(imageData, 0, 0);
            break;
            
          case 'ghibli':
            // Simulate Ghibli style with color saturation
            ctx.filter = 'saturate(130%) brightness(105%)';
            ctx.drawImage(img, 0, 0);
            break;
            
          case 'anime':
            // Simulate anime style with high contrast
            ctx.filter = 'contrast(120%) saturate(110%)';
            ctx.drawImage(img, 0, 0);
            break;
            
          case 'watercolor':
            // Simulate watercolor with blur and brightness
            ctx.filter = 'blur(1px) brightness(105%)';
            ctx.drawImage(img, 0, 0);
            break;
            
          default:
            // No filter
            break;
        }
        
        resolve(canvas.toDataURL('image/png'));
      };
      
      img.src = imageDataUrl;
    });
  };

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
      const transformedImageData = await applySimulatedTransform(selectedImage);
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

  const handleDownload = () => {
    if (!transformedImage) return;
    
    const link = document.createElement("a");
    link.href = transformedImage;
    link.download = `transformed-image-${selectedStyle}.png`;
    link.click();
  };

  const selectedStyleInfo = transformationStyles.find(style => style.id === selectedStyle);

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        <span className="buddy-gradient-text">AI Image Transformer</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        
        <Card>
          <CardHeader>
            <CardTitle>Transformed Image</CardTitle>
            <CardDescription>Your image in a new style</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {transformedImage ? (
              <div className="relative w-full aspect-square max-h-[400px] overflow-hidden rounded-md mb-4">
                <img
                  src={transformedImage}
                  alt="Transformed"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-md w-full aspect-square max-h-[400px] flex flex-col items-center justify-center p-4">
                <Wand2 size={64} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  {isLoading ? "Transforming..." : "Transformed image will appear here"}
                </p>
              </div>
            )}
            {transformedImage && (
              <Button 
                onClick={handleDownload} 
                variant="outline" 
                className="mt-2 w-full"
              >
                <Download size={18} className="mr-2" />
                Download Image
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Transformation Style</CardTitle>
          <CardDescription>Choose a style for your image transformation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="style">Select Style</Label>
              <Select value={selectedStyle} onValueChange={handleStyleSelect}>
                <SelectTrigger id="style">
                  <SelectValue placeholder="Choose a transformation style" />
                </SelectTrigger>
                <SelectContent>
                  {transformationStyles.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      <div className="flex flex-col">
                        <span>{style.name}</span>
                        <span className="text-xs text-muted-foreground">{style.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedStyleInfo && (
              <div className="rounded-md bg-muted p-4">
                <h4 className="font-medium mb-1">{selectedStyleInfo.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedStyleInfo.prompt}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-buddy-gradient hover:opacity-90"
            onClick={handleTransform}
            disabled={!selectedImage || !selectedStyle || isLoading}
          >
            <Wand2 size={18} className="mr-2" />
            {isLoading ? "Transforming..." : "Transform Image"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImageTransformer;
