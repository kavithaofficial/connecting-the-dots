import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-extrabold',
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Custom Vector Symbol: Connected Nodes with a Golden Pathway */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center rounded-xl bg-navy-900 text-white shadow-sm ring-1 ring-navy-800 transition-transform group-hover:scale-105`}>
        <svg viewBox="0 0 32 32" fill="none" className="w-5/6 h-5/6" xmlns="http://www.w3.org/2000/svg">
          {/* Pathway connections */}
          <path d="M7 16L16 8L25 16L16 24L7 16Z" stroke="#486581" strokeWidth="2" strokeLinejoin="round" />
          <path d="M16 8V24" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M7 16H25" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          {/* Nodes */}
          <circle cx="7" cy="16" r="3" fill="#D97706" />
          <circle cx="25" cy="16" r="3" fill="#D97706" />
          <circle cx="16" cy="8" r="3" fill="#F59E0B" />
          <circle cx="16" cy="24" r="3" fill="#F59E0B" />
          {/* Central convergence node */}
          <circle cx="16" cy="16" r="3.5" fill="#FFFFFF" />
        </svg>
      </div>
      {showText && (
        <span className={`${textSizes[size]} tracking-tight text-navy-950 flex items-center gap-1`}>
          Connecting <span className="text-gold-600">the Dots</span>
        </span>
      )}
    </Link>
  );
};
