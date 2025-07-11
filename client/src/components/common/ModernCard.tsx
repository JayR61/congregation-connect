import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ModernCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  glowing?: boolean;
  animated?: boolean;
  onClick?: () => void;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  title,
  description,
  children,
  className,
  hoverable = true,
  glowing = false,
  animated = true,
  onClick
}) => {
  const cardClasses = cn(
    'relative overflow-hidden border',
    'transition-all duration-300 ease-out',
    {
      'hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 cursor-pointer': hoverable && onClick,
      'hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1': hoverable && !onClick,
      'shadow-lg shadow-primary/30': glowing,
      'slide-up-animation': animated,
    },
    className
  );

  const CardComponent = onClick ? 'div' : Card;
  
  if (onClick) {
    return (
      <div className={cardClasses} onClick={onClick}>
        <Card className="h-full border-0 shadow-none bg-transparent">
          {(title || description) && (
            <CardHeader>
              {title && <CardTitle className="heading-gradient">{title}</CardTitle>}
              {description && <CardDescription className="text-elegant">{description}</CardDescription>}
            </CardHeader>
          )}
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className={cardClasses}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="heading-gradient">{title}</CardTitle>}
          {description && <CardDescription className="text-elegant">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
};