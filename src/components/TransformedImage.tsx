
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Wand2 } from "lucide-react";

interface TransformedImageProps {
  transformedImage: string | null;
  isLoading: boolean;
  selectedStyle: string;
}

const TransformedImage = ({ transformedImage, isLoading, selectedStyle }: TransformedImageProps) => {
  
  const handleDownload = () => {
    if (!transformedImage) return;
    
    const link = document.createElement("a");
    link.href = transformedImage;
    link.download = `transformed-image-${selectedStyle}.png`;
    link.click();
  };

  return (
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
  );
};

export default TransformedImage;
