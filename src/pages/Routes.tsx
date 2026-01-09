import MobileLayout from "@/components/layout/MobileLayout";
import ChildCard from "@/components/routes/ChildCard";
import defaultUser from "@/assets/defaultUser.png";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const RoutesPage = () => {
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
        <h1 className="text-2xl font-bold text-foreground mb-6">Rutas</h1>

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

export default RoutesPage;
