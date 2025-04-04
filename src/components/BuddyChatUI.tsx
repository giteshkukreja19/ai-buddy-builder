
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizonal, Settings, ArrowLeft } from "lucide-react";
import BuddyAvatar from "./BuddyAvatar";
import { AIBuddy } from "@/types/buddy";
import { cn } from "@/lib/utils";

interface BuddyChatUIProps {
  buddy: AIBuddy;
  onBackClick: () => void;
  onSettingsClick: () => void;
}

interface Message {
  id: string;
  sender: "user" | "buddy";
  text: string;
  timestamp: Date;
}

const BuddyChatUI = ({ buddy, onBackClick, onSettingsClick }: BuddyChatUIProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "buddy",
      text: `Hi there! I'm ${buddy.name}, your AI buddy. ${buddy.welcomeMessage || "How can I help you today?"}`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input on component mount
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // User message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      // Generate response based on buddy personality
      let response = "";
      
      switch(buddy.personality.toLowerCase()) {
        case "friendly":
          response = `I'd be happy to help with that! ${inputValue.length > 20 ? "Thanks for sharing your thoughts." : ""}`;
          break;
        case "professional":
          response = `I understand your request. Let me provide a detailed response regarding "${inputValue.split(" ").slice(0, 3).join(" ")}...".`;
          break;
        case "creative":
          response = `Oh, that's an interesting thought! I have some creative ideas about "${inputValue.split(" ").slice(0, 3).join(" ")}..."`;
          break;
        case "witty":
          response = `Well, well, well... ${inputValue.length > 15 ? "That's quite the statement!" : "Interesting point!"} Let me think about that...`;
          break;
        default:
          response = `I understand. Let me help you with that.`;
      }
      
      const buddyMessage: Message = {
        id: Date.now().toString(),
        sender: "buddy",
        text: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, buddyMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[80vh] max-w-2xl mx-auto">
      <CardHeader className="border-b space-y-0 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBackClick}
              className="h-8 w-8"
            >
              <ArrowLeft size={18} />
            </Button>
            <BuddyAvatar name={buddy.name} image={buddy.image} size="sm" />
            <div>
              <h2 className="text-lg font-semibold">{buddy.name}</h2>
              <p className="text-xs text-muted-foreground">{buddy.personality}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onSettingsClick}
          >
            <Settings size={18} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 max-w-[80%]",
                  message.sender === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                {message.sender === "buddy" && (
                  <BuddyAvatar name={buddy.name} image={buddy.image} size="sm" />
                )}
                <div
                  className={cn(
                    "rounded-lg p-3",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p>{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold">
                    You
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 max-w-[80%]">
                <BuddyAvatar name={buddy.name} image={buddy.image} size="sm" pulseEffect />
                <div className="rounded-lg p-3 bg-muted flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <div className="flex items-center w-full gap-2">
          <Input
            ref={inputRef}
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon"
            disabled={!inputValue.trim() || isTyping}
            className="bg-buddy-gradient hover:opacity-90"
          >
            <SendHorizonal size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BuddyChatUI;
