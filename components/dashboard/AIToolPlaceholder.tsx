import React from 'react';

interface AIToolPlaceholderProps {
    icon: React.ElementType;
    title: string;
    message: string;
}

export const AIToolPlaceholder: React.FC<AIToolPlaceholderProps> = ({ icon: Icon, title, message }) => (
    <div className="text-center p-8 h-full flex flex-col justify-center items-center text-dark-text-secondary">
        <Icon className="w-12 h-12 mb-4" />
        <h4 className="font-bold text-white text-lg">{title}</h4>
        <p className="text-sm mt-2 max-w-xs">{message}</p>
    </div>
);
