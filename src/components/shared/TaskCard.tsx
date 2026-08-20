import { type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TaskCardProps {
  title: string;
  category: string;
  budget: string;
  distance: string;
  time: string;
  rating: number;
  imageUrl?: string;
  posterName?: string;
  posterId?: string;
  poster?: string;
}

export default function TaskCard({
  title,
  category,
  budget,
  distance,
  time,
  rating,
  imageUrl,
  posterName,
  posterId,
  poster,
}: TaskCardProps) {
  const safeTitle = title || "Untitled task";
  const safeCategory = category || "General";
  const safeBudget = budget || "₹0";
  const safeDistance = distance || "Location unavailable";
  const safeTime = time || "Time TBD";
  const safeRating = typeof rating === "number" ? rating : 0;
  const navigate = useNavigate();

  const handlePosterClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (!posterId) return;
    navigate(`/profile/${posterId}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group border-border">
      {imageUrl ? (
        <div className="h-40 w-full overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={safeTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-32 w-full bg-primary/10 flex items-center justify-center text-primary font-medium">
          {category}
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20"
          >
            {safeCategory}
          </Badge>
          <span className="font-bold text-lg text-foreground">
            {safeBudget}
          </span>
        </div>
        <h3 className="font-semibold text-lg line-clamp-1 mb-2 text-foreground">
          {safeTitle}
        </h3>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary/70" />
            <span>{safeDistance}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-primary/70" />
              <span>{safeTime}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={16} className="fill-current" />
              <span className="font-medium">
                {safeRating ? safeRating.toFixed(1) : "0.0"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      {posterName && (
        <CardFooter className="p-4 pt-0 pb-3">
          <button
            type="button"
            onClick={handlePosterClick}
            className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Avatar className="h-6 w-6 border border-border">
              <AvatarImage src={poster} />
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                {posterName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span>
              Posted by{" "}
              <span className="font-semibold text-foreground group-hover:underline">
                {posterName}
              </span>
            </span>
          </button>
        </CardFooter>
      )}

      <CardFooter className="p-4 pt-0">
        <Button className="w-full">Apply Now</Button>
      </CardFooter>
    </Card>
  );
}
