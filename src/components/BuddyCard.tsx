
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BuddyAvatar from "./BuddyAvatar";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuddyCardProps {
  id: string;
  name: string;
  description: string;
  personality: string;
  image?: string;
  onSelect: (id: string) => void;
  className?: string;
}

const BuddyCard = ({
  id,
  name,
  description,
  personality,
  image,
  onSelect,
  className
}: BuddyCardProps) => {
  return (
    <Card className={cn("card-hover", className)}>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <BuddyAvatar name={name} image={image} size="md" />
        <div>
          <CardTitle className="text-xl">{name}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-muted/50">
              {personality}
            </Badge>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-buddy-gradient hover:opacity-90" 
          onClick={() => onSelect(id)}
        >
          <MessageSquare size={18} className="mr-2" />
          Chat with {name.split(" ")[0]}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BuddyCard;
