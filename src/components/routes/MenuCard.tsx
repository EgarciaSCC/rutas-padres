import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface MenuCardProps {
  icon: ReactNode;
  label: string;
  to: string;
}

const MenuCard = ({ icon, label, to }: MenuCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="bg-card rounded-2xl p-6 flex flex-col items-center gap-4 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 active:scale-95"
    >
      <div className="icon-circle-lg">
        {icon}
      </div>
      <span className="text-foreground font-semibold text-base">
        {label}
      </span>
    </button>
  );
};

export default MenuCard;
