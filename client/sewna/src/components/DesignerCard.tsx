import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Sparkles } from "lucide-react";

interface Designer {
  id: string;
  name: string;
  bio: string;
  profile_image: string;
  styles: string[];
  matchScore: number;
}

interface DesignerCardProps {
  designer: Designer;
}

export const DesignerCard = ({ designer }: DesignerCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/50">
      <div className="relative h-48 overflow-hidden">
        <img
          src={designer.profile_image}
          alt={designer.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
        <div className="absolute top-4 right-4">
          <Badge 
            variant="secondary" 
            className="bg-accent/90 text-accent-foreground backdrop-blur-sm flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            {designer.matchScore}% Match
          </Badge>
        </div>
      </div>

      <CardHeader>
        <h3 className="text-xl font-bold">{designer.name}</h3>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {designer.bio}
        </p>

        <div className="flex flex-wrap gap-2">
          {designer.styles.map((style, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {style}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group"
        >
          View Portfolio
          <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};
