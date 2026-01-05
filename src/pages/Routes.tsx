import MobileLayout from "@/components/layout/MobileLayout";
import ChildCard from "@/components/routes/ChildCard";
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
    grade: "4to primaria",
    imageUrl: defaultUser,
  },
];

const RoutesPage = () => {
  return (
    <MobileLayout>
      <div className="px-4 py-2">
        <h1 className="text-2xl font-bold text-foreground mb-6">Rutas</h1>

        <div className="grid grid-cols-2 gap-4">
          {children.map((child) => (
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
