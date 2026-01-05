import { ReactNode } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";

interface MobileLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

const MobileLayout = ({ children, showHeader = true }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {showHeader && <Header />}
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default MobileLayout;
