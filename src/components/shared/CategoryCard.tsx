import type { LucideProps } from "lucide-react";
import type { FC } from "react";

interface CategoryCardProps {
  name: string;
  icon: FC<LucideProps>;
  count: number;
}

export default function CategoryCard({ name, icon: Icon, count }: CategoryCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-3">
        <Icon size={28} />
      </div>
      <h3 className="font-medium text-foreground">{name}</h3>
      <p className="text-xs text-muted-foreground mt-1">{count} tasks</p>
    </div>
  );
}
