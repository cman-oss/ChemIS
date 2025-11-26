
import React from 'react';

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.5 5L5 9.5l5.5 1.5L12 18l1.5-5 5.5-1.5-5.5-1.5z"/>
        <path d="M18 6h.01"/>
        <path d="M6 18h.01"/>
    </svg>
);
