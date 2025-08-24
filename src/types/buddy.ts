
export interface AIBuddy {
  id: string;
  name: string;
  description: string;
  personality: string;
  createdAt: Date;
  image?: string;
  welcomeMessage?: string;
  settings?: {
    memory?: boolean;
    creativity?: number;
  };
}
