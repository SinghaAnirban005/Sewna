import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const ChatInput = ({ message, setMessage, onSubmit, isLoading, placeholder }: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Describe your ideal designer..."}
        className="min-h-[120px] pr-20 resize-none rounded-2xl border-2 focus-visible:ring-accent"
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="icon"
        disabled={isLoading || !message.trim()}
        className="absolute bottom-4 right-4 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};
