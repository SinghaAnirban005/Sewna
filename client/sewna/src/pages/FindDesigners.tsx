import { useState } from "react";
import { Header } from "../components/Header";
import { ChatInput } from "../components/ChatInput";
import { DesignerCard } from "../components/DesignerCard";
import { useToast } from "../hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import { HTTP_URL } from "../utils";

interface Designer {
  id: string;
  name: string;
  bio: string;
  profile_image: string;
  styles: string[];
  matchScore: number;
}

const FindDesigners = () => {
  const [message, setMessage] = useState("");
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
        const message = "Message required"
        toast(message, {
            description: "Please describe the designer you're looking for",
        })

        return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`${HTTP_URL}/api/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: message.trim() }),
      });

      if (!response.ok) throw new Error('Failed to fetch designers');

      const result = await response.json();

      if (result.success && result.data) {
        const formattedDesigners = result.data.map((match: any, index: number) => ({
          id: `designer-${index}`,
          name: match.designer.name,
          bio: match.designer.bio,
          profile_image: match.designer.profileImage,
          styles: match.designer.styles,
          matchScore: match.similarity,
        }));

        setDesigners(formattedDesigners);
        
        if (formattedDesigners.length === 0) {
          toast("No matches found", {
            description: "Try describing your style preferences differently."
          })
        }
      }
    } catch (error) {
      console.error('Error matching designers:', error);

      toast("Error", {
        description: "Failed to find designers. Please try again."
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4" style={{color:"#00b67f", backgroundColor: '#f0f8ff'}}>
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium" style={{ backgroundColor: '#f0f8ff', color: '#00b67f'}}>AI-Powered Designer Matching</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Designer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe your style, vision, or project needs, and we'll match you with designers who 
            understand your aesthetic.
          </p>
        </div>

        <div className="mb-8">
          <ChatInput
            message={message}
            setMessage={setMessage}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            placeholder="E.g., 'I'm looking for a minimalist designer with sustainable practices and a bohemian touch...'"
          />
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <Loader2 className="w-12 h-12 animate-spin text-accent mb-4" />
            <p className="text-muted-foreground">Finding your perfect matches...</p>
          </div>
        )}

        {!isLoading && hasSearched && designers.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Top Matches</h2>
              <p className="text-sm text-muted-foreground">
                {designers.length} designer{designers.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {designers.map((designer) => (
                <DesignerCard key={designer.id} designer={designer} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && hasSearched && designers.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              No designers found. Try adjusting your description.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default FindDesigners;
