
import { ReactNode } from "react";
import Navbar from "./Navbar";
import GlobalSearch from "./GlobalSearch";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-end">
          <GlobalSearch />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
