import { ReactNode } from 'react';
import { cn } from '@/lib';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

function Card({ children, className, hover = false, padding = 'md' }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden',
        hover && 'transition-shadow duration-200 hover:shadow-lg',
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('border-b border-gray-200 dark:border-gray-700 pb-4', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

function CardTitle({ children, className, as: Tag = 'h3' }: CardTitleProps) {
  return (
    <Tag className={cn('font-semibold text-gray-900 dark:text-gray-100', className)}>
      {children}
    </Tag>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn('text-sm text-gray-500 dark:text-gray-400 mt-1', className)}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('', className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('border-t border-gray-200 dark:border-gray-700 pt-4 mt-4', className)}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };