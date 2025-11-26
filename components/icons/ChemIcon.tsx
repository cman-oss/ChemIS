
import React from 'react';

export const ChemIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4" />
    <path d="M15 6h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4" />
    <path d="M9 12h6" />
    <path d="m12 12-2 4" />
    <path d="m12 12 2-4" />
  </svg>
);
