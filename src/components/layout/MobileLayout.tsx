import { ReactNode } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";

interface MobileLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  // When true, header will be hidden on small screens (visible from md and up)
  hideHeaderOnSmall?: boolean;
  // When true, bottom nav will be hidden on small screens (visible from md and up)
  hideBottomOnSmall?: boolean;
}

const MobileLayout = ({
  children,
  showHeader = true,
  hideHeaderOnSmall = false,
  hideBottomOnSmall = false,
}: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {showHeader && (
        <div className={hideHeaderOnSmall ? "md:block hidden" : undefined}>
          <Header />
        </div>
      )}
      <main className="flex-1 pb-24 overflow-y-auto">{children}</main>
      <div className={hideBottomOnSmall ? "md:block hidden" : undefined}>
        <BottomNav />
      </div>
    </div>
  );
};

export default MobileLayout;
