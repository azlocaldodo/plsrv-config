import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export default function Card({ children, title, className = '' }: CardProps) {
  return (
    <div className={`bg-themed-card elevated-card border border-themed rounded-2xl p-4 md:p-5 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-themed mb-4 pb-2 border-b border-themed">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
