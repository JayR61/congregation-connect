
import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <Topbar />
      <div className="app-content">
        <Sidebar />
        <div className="page-container">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
