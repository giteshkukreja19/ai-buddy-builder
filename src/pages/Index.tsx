
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BuddyCard from "@/components/BuddyCard";
import CreateBuddyForm from "@/components/CreateBuddyForm";
import BuddyChatUI from "@/components/BuddyChatUI";
import BuddySettings from "@/components/BuddySettings";
import { AIBuddy } from "@/types/buddy";
import { PlusCircle, BrainCircuit, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const DEFAULT_BUDDIES: AIBuddy[] = [
  {
    id: "1",
    name: "Alex Assistant",
    description: "A helpful and friendly assistant for everyday tasks and questions.",
    personality: "Friendly",
    createdAt: new Date(),
    welcomeMessage: "Hi there! I'm Alex, your friendly AI assistant. How can I help you today?"
  },
  {
    id: "2",
    name: "Prof. Logic",
    description: "A professional and precise AI that provides detailed factual information.",
    personality: "Professional",
    createdAt: new Date(),
    welcomeMessage: "Greetings. I'm Professor Logic, ready to provide you with accurate information and analysis."
  },
  {
    id: "3",
    name: "Iris Imagine",
    description: "A creative companion for brainstorming ideas and artistic endeavors.",
    personality: "Creative",
    createdAt: new Date(),
    welcomeMessage: "Hello creative soul! I'm Iris, and I'm excited to explore imaginative ideas with you!"
  }
];

const Index = () => {
  const [buddies, setBuddies] = useState<AIBuddy[]>([]);
  const [activeBuddy, setActiveBuddy] = useState<AIBuddy | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("my-buddies");
  const { toast } = useToast();

  useEffect(() => {
    const savedBuddies = localStorage.getItem("ai-buddies");
    if (savedBuddies) {
      try {
        const parsed = JSON.parse(savedBuddies);
        setBuddies(parsed.map((buddy: any) => ({
          ...buddy,
          createdAt: new Date(buddy.createdAt)
        })));
      } catch (error) {
        console.error("Error parsing saved buddies:", error);
        setBuddies(DEFAULT_BUDDIES);
      }
    } else {
      setBuddies(DEFAULT_BUDDIES);
    }
  }, []);

  useEffect(() => {
    if (buddies.length > 0) {
      localStorage.setItem("ai-buddies", JSON.stringify(buddies));
    }
  }, [buddies]);

  const handleSelectBuddy = (id: string) => {
    const buddy = buddies.find(b => b.id === id);
    if (buddy) {
      setActiveBuddy(buddy);
      setShowSettings(false);
    }
  };

  const handleCreateBuddy = (newBuddy: AIBuddy) => {
    setBuddies(prev => [...prev, newBuddy]);
    setActiveTab("my-buddies");
  };

  const handleUpdateBuddy = (updatedBuddy: AIBuddy) => {
    setBuddies(prev => 
      prev.map(buddy => 
        buddy.id === updatedBuddy.id ? updatedBuddy : buddy
      )
    );
    setActiveBuddy(updatedBuddy);
    setShowSettings(false);
  };

  const handleDeleteBuddy = (id: string) => {
    if (window.confirm("Are you sure you want to delete this AI buddy?")) {
      setBuddies(prev => prev.filter(buddy => buddy.id !== id));
      if (activeBuddy?.id === id) {
        setActiveBuddy(null);
      }
      toast({
        title: "Buddy deleted",
        description: "Your AI buddy has been removed",
      });
    }
  };

  if (activeBuddy) {
    if (showSettings) {
      return (
        <div className="container py-8">
          <BuddySettings 
            buddy={activeBuddy} 
            onSave={handleUpdateBuddy}
            onBack={() => setShowSettings(false)}
          />
        </div>
      );
    }
    
    return (
      <div className="container py-8">
        <BuddyChatUI 
          buddy={activeBuddy}
          onBackClick={() => setActiveBuddy(null)}
          onSettingsClick={() => setShowSettings(true)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">
            <span className="buddy-gradient-text">AI Buddy Builder</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Create and customize your own AI companions with unique personalities
          </p>
          <div className="mt-4">
            <Link to="/transform">
              <Button variant="outline" className="gap-2">
                <Wand2 size={18} />
                Try Image Transformer
              </Button>
            </Link>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="my-buddies" className="px-6">My Buddies</TabsTrigger>
              <TabsTrigger value="create" className="px-6">Create New</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="my-buddies" className="space-y-6">
            {buddies.length === 0 ? (
              <div className="text-center py-16 bg-muted/30 rounded-lg">
                <BrainCircuit className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No AI buddies yet</h3>
                <p className="text-muted-foreground mb-4">Create your first AI buddy to start chatting</p>
                <Button 
                  onClick={() => setActiveTab("create")}
                  className="bg-buddy-gradient hover:opacity-90"
                >
                  <PlusCircle size={18} className="mr-2" />
                  Create Your First Buddy
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {buddies.map(buddy => (
                  <BuddyCard
                    key={buddy.id}
                    id={buddy.id}
                    name={buddy.name}
                    description={buddy.description}
                    personality={buddy.personality}
                    image={buddy.image}
                    onSelect={handleSelectBuddy}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create">
            <CreateBuddyForm onBuddyCreated={handleCreateBuddy} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
