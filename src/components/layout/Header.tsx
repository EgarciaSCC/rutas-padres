import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import isotipo from "@/assets/isotipo.png";
import defaultUser from "@/assets/defaultUser.png";

const Header = () => {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-16 bg-header">
        <button className="p-2 text-primary hover:bg-secondary rounded-full transition-colors">
          <Search className="w-6 h-6" />
        </button>

        <div className="flex items-center justify-center w-10">
          <img src={isotipo} alt="Logo NCA" className="w-full h-full object-contain" />
        </div>

        <Avatar className="w-10 h-10 border-2 border-primary">
          <img src={defaultUser} alt="Logo NCA" className="w-full h-full object-contain" />
        </Avatar>
      </header>
      {/* Spacer to prevent the page content from being hidden under the fixed header */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
};

export default Header;
