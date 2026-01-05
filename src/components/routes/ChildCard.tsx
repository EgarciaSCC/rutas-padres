import { User, School, GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ChildCardProps {
  id: string;
  name: string;
  school: string;
  grade: string;
  imageUrl: string;
  variant?: "compact" | "full";
}

const ChildCard = ({ id, name, school, grade, imageUrl, variant = "full" }: ChildCardProps) => {
  const navigate = useNavigate();

  if (variant === "compact") {
    return (
      <div className="bg-card rounded-2xl p-4 shadow-card animate-scale-in">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-4 border-secondary">
            <AvatarImage src={imageUrl} alt={name} className="object-cover" />
            <AvatarFallback className="bg-secondary text-primary text-xl font-bold">
              {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-foreground">
              <User className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">{name}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <School className="w-4 h-4 text-primary" />
              <span className="text-sm">{school}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-sm">{grade}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <Button 
            onClick={() => navigate(`/route/${id}`)}
            className="flex-1 rounded-full font-semibold"
          >
            Ver Ruta
          </Button>
          <Button 
            variant="ghost" 
            className="text-primary font-semibold"
            onClick={() => navigate(`/route/${id}?tab=history`)}
          >
            Historial
          </Button>
          <Button 
            variant="ghost" 
            className="text-primary font-semibold"
          >
            Información
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card flex flex-col items-center animate-scale-in">
      <Avatar className="w-24 h-24 mb-3 border-4 border-secondary">
        <AvatarImage src={imageUrl} alt={name} className="object-cover" />
        <AvatarFallback className="bg-secondary text-primary text-2xl font-bold">
          {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      
      <div className="space-y-2 text-center w-full">
        <div className="flex items-center justify-center gap-2 text-foreground">
          <User className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">{name}</span>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <School className="w-4 h-4 text-primary" />
          <span className="text-xs">{school}</span>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <GraduationCap className="w-4 h-4 text-primary" />
          <span className="text-xs">{grade}</span>
        </div>
      </div>
      
      <Button 
        onClick={() => navigate(`/route/${id}`)}
        className="w-full mt-4 rounded-full font-semibold"
      >
        Ver ruta
      </Button>
      
      <Button 
        variant="ghost" 
        className="mt-2 text-primary font-semibold"
        onClick={() => navigate(`/route/${id}?tab=history`)}
      >
        Ver historial
      </Button>
    </div>
  );
};

export default ChildCard;
