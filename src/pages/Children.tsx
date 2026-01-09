import MobileLayout from "@/components/layout/MobileLayout";
import ChildCard from "@/components/routes/ChildCard";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const ChildrenPage = () => {
  const navigate = useNavigate();
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
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-primary hover:bg-secondary rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Ver hijos</h1>
        </div>

        <div className="space-y-4">
          {loading
            ? null
            : children.map((child, index) => (
                <div
                  key={child.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ChildCard
                    id={child.id}
                    name={child.name}
                    school={child.school}
                    grade={child.grade}
                    imageUrl={child.imageUrl}
                    variant="compact"
                  />
                </div>
              ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default ChildrenPage;
