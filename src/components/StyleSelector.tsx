
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Wand2 } from "lucide-react";
import { TransformationStyle } from "@/utils/imageTransformUtils";

interface StyleSelectorProps {
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  transformationStyles: TransformationStyle[];
  selectedImage: string | null;
  isLoading: boolean;
  onTransform: () => void;
}

const StyleSelector = ({ 
  selectedStyle, 
  setSelectedStyle, 
  transformationStyles,
  selectedImage,
  isLoading,
  onTransform
}: StyleSelectorProps) => {
  
  const handleStyleSelect = (value: string) => {
    setSelectedStyle(value);
  };

  const selectedStyleInfo = transformationStyles.find(style => style.id === selectedStyle);

  return (
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
          onClick={onTransform}
          disabled={!selectedImage || !selectedStyle || isLoading}
        >
          <Wand2 size={18} className="mr-2" />
          {isLoading ? "Transforming..." : "Transform Image"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StyleSelector;
