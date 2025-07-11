import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export const BreadcrumbNavigation: React.FC = () => {
  const location = useLocation();
  
  // Create breadcrumb items from current path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: Home },
    ...pathSegments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: '/' + pathSegments.slice(0, index + 1).join('/'),
      icon: null
    }))
  ];

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumb for home page
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
          )}
          <Link
            to={item.path}
            className={`flex items-center space-x-1 hover:text-foreground transition-colors ${
              index === breadcrumbItems.length - 1 
                ? 'text-foreground font-medium' 
                : 'hover:underline'
            }`}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{item.label}</span>
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNavigation;