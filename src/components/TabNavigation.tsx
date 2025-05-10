
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from 'react-router-dom';

interface TabNavigationProps {
  className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ className }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className={`${className}`}>
      <Tabs defaultValue={currentPath} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="/" asChild>
            <Link to="/" className={currentPath === "/" ? "data-[state=active]:bg-brand-blue data-[state=active]:text-white" : ""}>
              Home
            </Link>
          </TabsTrigger>
          <TabsTrigger value="/registration" asChild>
            <Link to="/registration" className={currentPath === "/registration" ? "data-[state=active]:bg-brand-blue data-[state=active]:text-white" : ""}>
              Registration
            </Link>
          </TabsTrigger>
          <TabsTrigger value="/recognition" asChild>
            <Link to="/recognition" className={currentPath === "/recognition" ? "data-[state=active]:bg-brand-blue data-[state=active]:text-white" : ""}>
              Recognition
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TabNavigation;
