import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, Users, Bus, Lock, MoreHorizontal } from "lucide-react";
import history from "@/assets/history.svg";
import home from "@/assets/home.svg";
import calendar from "@/assets/calendar.svg";
import schoolbus from "@/assets/schoolbus.svg";
import userprofile from "@/assets/user-profile.svg";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  isCenter?: boolean;
}

const navItems: NavItem[] = [
  { icon: schoolbus, label: "Rutas", path: "/routes" },
  { icon: history, label: "Historico", path: "/history" },
  { icon: home, label: "Home", path: "/", isCenter: true },
  { icon: calendar, label: "Calendario", path: "/calendar" },
  { icon: userprofile, label: "Cuenta", path: "/account" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname.startsWith("/route") || location.pathname.startsWith("/children");
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border gradient-bottom safe-area-bottom z-50">
      <div className="flex items-end justify-around px-2 pt-2 pb-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 -mt-4"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-button transition-all duration-200 ${
                  active ? "bg-primary" : "bg-primary/90 hover:bg-primary"
                }`}>
                  <img src={home} alt="Logo NCA" className="w-10 h-full object-contain" />
                </div>
                <span className={`text-xs font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`bottom-nav-item ${active ? "active" : ""}`}
            >

              <img src={item.icon} alt="Logo NCA" className="w-8 h-full object-contain" />
              <span className="text-[10px] font-medium leading-tight text-center max-w-[60px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
