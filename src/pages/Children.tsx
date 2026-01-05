import MobileLayout from "@/components/layout/MobileLayout";
import ChildCard from "@/components/routes/ChildCard";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultUser from "@/assets/defaultUser.png";

const children = [
  {
    id: "alfonso",
    name: "Alfono Miguel Lopez Pumarejo",
    school: "Colegio Bilingue Buckingham",
    grade: "8vo grado",
    imageUrl: defaultUser,
  },
  {
    id: "luis",
    name: "Luis José Lopez Pumarejo",
    school: "Colegio Bilingue Buckingham",
    grade: "4to grado",
    imageUrl: defaultUser,
  },
];

const ChildrenPage = () => {
  const navigate = useNavigate();

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
          {children.map((child, index) => (
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
