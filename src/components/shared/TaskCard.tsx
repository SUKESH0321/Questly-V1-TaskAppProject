import { MapPin, Clock, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  title: string;
  category: string;
  budget: string;
  distance: string;
  time: string;
  rating: number;
  imageUrl?: string;
}

export default function TaskCard({ title, category, budget, distance, time, rating, imageUrl }: TaskCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group border-border">
      {imageUrl ? (
        <div className="h-40 w-full overflow-hidden bg-muted">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-32 w-full bg-primary/10 flex items-center justify-center text-primary font-medium">
          {category}
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
            {category}
          </Badge>
          <span className="font-bold text-lg text-foreground">{budget}</span>
        </div>
        <h3 className="font-semibold text-lg line-clamp-1 mb-2 text-foreground">{title}</h3>
        
        <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary/70" />
            <span>{distance}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-primary/70" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={16} className="fill-current" />
              <span className="font-medium">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">Apply Now</Button>
      </CardFooter>
    </Card>
  );
}
