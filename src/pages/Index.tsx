import MobileLayout from "@/components/layout/MobileLayout";
import MenuCard from "@/components/routes/MenuCard";
import ChildCard from "@/components/routes/ChildCard";
import { Bus, Users, Clock, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const Index = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getChildren().then((res) => {
      if (!mounted) return;
      setChildren(res);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <MobileLayout>
      <div className="px-4 py-2">
        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <MenuCard
            icon={<Bus className="w-8 h-8" />}
            label="Ver Ruta"
            to="/routes"
          />
          <MenuCard
            icon={<Users className="w-8 h-8" />}
            label="Ver hijos"
            to="/children"
          />
          <MenuCard
            icon={<Clock className="w-8 h-8" />}
            label="Histórico"
            to="/history"
          />
          <MenuCard
            icon={<Calendar className="w-8 h-8" />}
            label="Calendario"
            to="/calendar"
          />
        </div>

        {/* Children Cards Preview */}
        <div className="grid grid-cols-2 gap-4">
          {loading
            ? null
            : children.map((child) => (
                <ChildCard
                  key={child.id}
                  id={child.id}
                  name={child.name}
                  school={child.school}
                  grade={child.grade}
                  imageUrl={child.imageUrl}
                />
              ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Index;
