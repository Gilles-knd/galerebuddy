import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
    className?: string;
    children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
    return (
        <div className={twMerge('bg-white rounded-lg shadow-md overflow-hidden', className)}>
            {children}
        </div>
    );
}

interface CardHeaderProps {
    className?: string;
    children: React.ReactNode;
}

Card.Header = function CardHeader({ className, children }: CardHeaderProps) {
    return (
        <div className={twMerge('p-4 border-b', className)}>
            {children}
        </div>
    );
};

interface CardContentProps {
    className?: string;
    children: React.ReactNode;
}

Card.Content = function CardContent({ className, children }: CardContentProps) {
    return (
        <div className={twMerge('p-4', className)}>
            {children}
        </div>
    );
};

interface CardFooterProps {
    className?: string;
    children: React.ReactNode;
}

Card.Footer = function CardFooter({ className, children }: CardFooterProps) {
    return (
        <div className={twMerge('p-4 border-t', className)}>
            {children}
        </div>
    );
};