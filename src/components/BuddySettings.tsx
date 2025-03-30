
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AIBuddy } from "@/types/buddy";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save } from "lucide-react";

interface BuddySettingsProps {
  buddy: AIBuddy;
  onSave: (updatedBuddy: AIBuddy) => void;
  onBack: () => void;
}

const PERSONALITY_OPTIONS = [
  { value: "Friendly", label: "Friendly" },
  { value: "Professional", label: "Professional" },
  { value: "Creative", label: "Creative" },
  { value: "Witty", label: "Witty" },
];

const BuddySettings = ({ buddy, onSave, onBack }: BuddySettingsProps) => {
  const [name, setName] = useState(buddy.name);
  const [description, setDescription] = useState(buddy.description);
  const [personality, setPersonality] = useState(buddy.personality);
  const [imageUrl, setImageUrl] = useState(buddy.image || "");
  const [memory, setMemory] = useState(true);
  const [creativity, setCreativity] = useState(70);
  const { toast } = useToast();

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Your buddy needs a name",
        variant: "destructive",
      });
      return;
    }

    const updatedBuddy: AIBuddy = {
      ...buddy,
      name,
      description,
      personality,
      image: imageUrl || undefined,
      settings: {
        memory,
        creativity: creativity / 100,
      },
    };

    onSave(updatedBuddy);
    
    toast({
      title: "Settings saved",
      description: "Your buddy settings have been updated",
    });
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <CardTitle>Buddy Settings</CardTitle>
            <CardDescription>Customize how your AI buddy behaves and appears</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="personality">Personality</Label>
          <Select value={personality} onValueChange={setPersonality}>
            <SelectTrigger id="personality">
              <SelectValue placeholder="Select personality" />
            </SelectTrigger>
            <SelectContent>
              {PERSONALITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Avatar URL</Label>
          <Input 
            id="image"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/avatar.png"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Advanced Settings</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="memory">Conversation Memory</Label>
              <Switch 
                id="memory" 
                checked={memory}
                onCheckedChange={setMemory}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              When enabled, your buddy will remember previous conversations
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="creativity">Creativity Level</Label>
              <span className="text-sm font-medium">{creativity}%</span>
            </div>
            <Slider 
              id="creativity"
              min={0}
              max={100}
              step={10}
              value={[creativity]}
              onValueChange={(values) => setCreativity(values[0])}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Precise</span>
              <span>Balanced</span>
              <span>Creative</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave}
          className="w-full bg-buddy-gradient hover:opacity-90"
        >
          <Save size={18} className="mr-2" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BuddySettings;
