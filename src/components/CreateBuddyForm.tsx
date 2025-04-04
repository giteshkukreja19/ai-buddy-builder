
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import BuddyAvatar from "./BuddyAvatar";
import { AIBuddy } from "@/types/buddy";
import { PlusCircle } from "lucide-react";

interface CreateBuddyFormProps {
  onBuddyCreated: (buddy: AIBuddy) => void;
}

const PERSONALITY_TEMPLATES = [
  {
    value: "friendly",
    label: "Friendly",
    description: "Warm, supportive, and positive",
  },
  {
    value: "professional",
    label: "Professional",
    description: "Formal, precise, and informative",
  },
  {
    value: "creative",
    label: "Creative",
    description: "Imaginative, artistic, and inspirational",
  },
  {
    value: "witty",
    label: "Witty",
    description: "Humorous, clever, with a touch of sarcasm",
  },
];

const CreateBuddyForm = ({ onBuddyCreated }: CreateBuddyFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [personality, setPersonality] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();

  const handleCreateBuddy = () => {
    if (!name) {
      toast({
        title: "Name required",
        description: "Please give your AI buddy a name",
        variant: "destructive",
      });
      return;
    }

    if (!personality) {
      toast({
        title: "Personality required",
        description: "Please select a personality for your AI buddy",
        variant: "destructive",
      });
      return;
    }

    const newBuddy: AIBuddy = {
      id: Date.now().toString(),
      name,
      description: description || `${name} is your personal AI assistant.`,
      personality: PERSONALITY_TEMPLATES.find(p => p.value === personality)?.label || personality,
      createdAt: new Date(),
      image: imageUrl || undefined,
      welcomeMessage: getWelcomeMessage(personality),
    };

    onBuddyCreated(newBuddy);
    
    toast({
      title: "Buddy created!",
      description: `${name} is ready to chat with you`,
    });

    // Reset form
    setName("");
    setDescription("");
    setPersonality("");
    setImageUrl("");
  };

  const getWelcomeMessage = (personality: string) => {
    switch(personality) {
      case "friendly":
        return "I'm so excited to chat with you! How are you feeling today?";
      case "professional":
        return "I'm here to assist you with any tasks or questions you may have.";
      case "creative":
        return "Let's explore some exciting ideas together! What's on your mind?";
      case "witty":
        return "Well hello there! Ready for a conversation that's marginally more interesting than watching paint dry?";
      default:
        return "How can I help you today?";
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl buddy-gradient-text">Create Your AI Buddy</CardTitle>
        <CardDescription>
          Design a unique AI companion with its own personality and appearance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center mb-4">
          <BuddyAvatar name={name || "New Buddy"} image={imageUrl} size="lg" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Buddy Name</Label>
          <Input
            id="name"
            placeholder="e.g., Alex, Cortana, Jarvis"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="personality">Personality</Label>
          <Select value={personality} onValueChange={setPersonality}>
            <SelectTrigger>
              <SelectValue placeholder="Select a personality" />
            </SelectTrigger>
            <SelectContent>
              {PERSONALITY_TEMPLATES.map((template) => (
                <SelectItem key={template.value} value={template.value}>
                  <div>
                    <span>{template.label}</span>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe your AI buddy's purpose and characteristics"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL (Optional)</Label>
          <Input
            id="imageUrl"
            placeholder="https://example.com/avatar.png"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Provide a URL to an image for your buddy's avatar</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCreateBuddy} 
          className="w-full bg-buddy-gradient hover:opacity-90"
        >
          <PlusCircle size={18} className="mr-2" />
          Create AI Buddy
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateBuddyForm;
