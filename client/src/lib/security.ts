import { toast } from '@/lib/toast';

// Security utilities
export interface SecurityContext {
  userId: string;
  roles: string[];
  permissions: string[];
  isAuthenticated: boolean;
}

// Permission definitions
export const PERMISSIONS = {
  // Members
  MEMBER_CREATE: 'member:create',
  MEMBER_READ: 'member:read', 
  MEMBER_UPDATE: 'member:update',
  MEMBER_DELETE: 'member:delete',
  
  // Tasks
  TASK_CREATE: 'task:create',
  TASK_READ: 'task:read',
  TASK_UPDATE: 'task:update',
  TASK_DELETE: 'task:delete',
  TASK_ASSIGN: 'task:assign',
  
  // Finance
  FINANCE_CREATE: 'finance:create',
  FINANCE_READ: 'finance:read',
  FINANCE_UPDATE: 'finance:update',
  FINANCE_DELETE: 'finance:delete',
  FINANCE_EXPORT: 'finance:export',
  
  // Documents
  DOCUMENT_CREATE: 'document:create',
  DOCUMENT_READ: 'document:read',
  DOCUMENT_UPDATE: 'document:update',
  DOCUMENT_DELETE: 'document:delete',
  DOCUMENT_UPLOAD: 'document:upload',
  
  // Programmes
  PROGRAMME_CREATE: 'programme:create',
  PROGRAMME_READ: 'programme:read',
  PROGRAMME_UPDATE: 'programme:update',
  PROGRAMME_DELETE: 'programme:delete',
  
  // Admin
  ADMIN_ALL: 'admin:all',
  SETTINGS_MANAGE: 'settings:manage'
} as const;

// Role-based permissions
export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  leader: [
    PERMISSIONS.MEMBER_READ,
    PERMISSIONS.MEMBER_UPDATE,
    PERMISSIONS.TASK_CREATE,
    PERMISSIONS.TASK_READ,
    PERMISSIONS.TASK_UPDATE,
    PERMISSIONS.TASK_ASSIGN,
    PERMISSIONS.FINANCE_READ,
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.DOCUMENT_UPDATE,
    PERMISSIONS.PROGRAMME_CREATE,
    PERMISSIONS.PROGRAMME_READ,
    PERMISSIONS.PROGRAMME_UPDATE,
  ],
  volunteer: [
    PERMISSIONS.MEMBER_READ,
    PERMISSIONS.TASK_READ,
    PERMISSIONS.TASK_UPDATE,
    PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.PROGRAMME_READ,
  ],
  member: [
    PERMISSIONS.MEMBER_READ,
    PERMISSIONS.TASK_READ,
    PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.PROGRAMME_READ,
  ]
};

// Get user security context
export const getSecurityContext = (): SecurityContext => {
  // In a real app, this would come from auth service
  return {
    userId: 'user-1',
    roles: ['admin'], // Default to admin for now
    permissions: ROLE_PERMISSIONS.admin,
    isAuthenticated: true
  };
};

// Check if user has permission
export const hasPermission = (permission: string): boolean => {
  const context = getSecurityContext();
  return context.isAuthenticated && context.permissions.includes(permission);
};

// Check if user has any of the given permissions
export const hasAnyPermission = (permissions: string[]): boolean => {
  return permissions.some(permission => hasPermission(permission));
};

// Check if user has all of the given permissions
export const hasAllPermissions = (permissions: string[]): boolean => {
  return permissions.every(permission => hasPermission(permission));
};

// Security decorator for functions
export const requirePermission = (permission: string) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function (...args: any[]) {
      if (!hasPermission(permission)) {
        toast.error('Access denied. Insufficient permissions.');
        return;
      }
      return method.apply(this, args);
    };
  };
};

// Validate input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone format
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Rate limiting
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export const rateLimit = (key: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(key);
  
  if (!userLimit || now - userLimit.timestamp > windowMs) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    toast.error('Too many requests. Please try again later.');
    return false;
  }
  
  userLimit.count++;
  return true;
};

// Audit logging
export const auditLog = (action: string, resource: string, details?: any): void => {
  const context = getSecurityContext();
  const logEntry = {
    timestamp: new Date().toISOString(),
    userId: context.userId,
    action,
    resource,
    details: details ? JSON.stringify(details) : undefined,
    userAgent: navigator.userAgent,
    ip: 'client-side' // In real app, would be server-side
  };
  
  // In a real app, this would send to audit service
  console.log('AUDIT:', logEntry);
  
  // Store locally for demo (in real app, would be server-side)
  const auditLogs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
  auditLogs.push(logEntry);
  localStorage.setItem('auditLogs', JSON.stringify(auditLogs.slice(-1000))); // Keep last 1000 entries
};

// Session management
export const validateSession = (): boolean => {
  const lastActivity = localStorage.getItem('lastActivity');
  if (!lastActivity) return false;
  
  const THIRTY_MINUTES = 30 * 60 * 1000;
  const timeSinceActivity = Date.now() - parseInt(lastActivity);
  
  if (timeSinceActivity > THIRTY_MINUTES) {
    localStorage.removeItem('lastActivity');
    toast.error('Session expired. Please refresh the page.');
    return false;
  }
  
  return true;
};

// Update session activity
export const updateSessionActivity = (): void => {
  localStorage.setItem('lastActivity', Date.now().toString());
};

// Initialize security
export const initializeSecurity = (): void => {
  // Update activity on user interaction
  ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
    document.addEventListener(event, updateSessionActivity, { passive: true });
  });
  
  // Check session every minute
  setInterval(validateSession, 60000);
};