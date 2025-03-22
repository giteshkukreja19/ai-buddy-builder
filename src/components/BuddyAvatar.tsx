
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface BuddyAvatarProps {
  name: string;
  image?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  pulseEffect?: boolean;
}

const BuddyAvatar = ({
  name,
  image,
  className,
  size = "md",
  pulseEffect = false
}: BuddyAvatarProps) => {
  const [initials, setInitials] = useState("");
  
  useEffect(() => {
    // Generate initials from name
    if (name) {
      const nameWords = name.split(" ");
      const initials = nameWords.map(word => word[0]?.toUpperCase() || "").join("");
      setInitials(initials.substring(0, 2));
    }
  }, [name]);
  
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32"
  };
  
  return (
    <Avatar 
      className={cn(
        sizeClasses[size], 
        pulseEffect && "animate-pulse-slow",
        "ring-2 ring-buddy-primary/50 shadow-md",
        className
      )}
    >
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback 
        className="bg-gradient-to-br from-buddy-primary to-buddy-secondary text-white font-bold"
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default BuddyAvatar;
