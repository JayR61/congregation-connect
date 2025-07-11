import React from 'react';
import { hasPermission, hasAnyPermission } from '@/lib/security';
import { toast } from '@/lib/toast';

interface SecurityWrapperProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  onUnauthorized?: () => void;
}

export const SecurityWrapper: React.FC<SecurityWrapperProps> = ({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  onUnauthorized
}) => {
  const isAuthorized = () => {
    if (permission) {
      return hasPermission(permission);
    }
    
    if (permissions) {
      return requireAll 
        ? permissions.every(p => hasPermission(p))
        : hasAnyPermission(permissions);
    }
    
    return true; // No restrictions
  };

  if (!isAuthorized()) {
    if (onUnauthorized) {
      onUnauthorized();
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface SecureButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  onUnauthorizedClick?: () => void;
  children: React.ReactNode;
}

export const SecureButton: React.FC<SecureButtonProps> = ({
  permission,
  permissions,
  requireAll = false,
  onUnauthorizedClick,
  onClick,
  children,
  className = '',
  ...props
}) => {
  const isAuthorized = () => {
    if (permission) {
      return hasPermission(permission);
    }
    
    if (permissions) {
      return requireAll 
        ? permissions.every(p => hasPermission(p))
        : hasAnyPermission(permissions);
    }
    
    return true;
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isAuthorized()) {
      e.preventDefault();
      if (onUnauthorizedClick) {
        onUnauthorizedClick();
      } else {
        toast.error('Access denied. Insufficient permissions.');
      }
      return;
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`${className} ${!isAuthorized() ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={!isAuthorized() || props.disabled}
    >
      {children}
    </button>
  );
};