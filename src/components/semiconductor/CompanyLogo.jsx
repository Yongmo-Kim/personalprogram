import { useState } from 'react';
import { getAccentClasses } from '../../utils/semiconductorStyles';

const LOGO_COLORS = {
  emerald: 'text-emerald-700',
  blue: 'text-blue-700',
  violet: 'text-violet-700',
  purple: 'text-purple-700',
  slate: 'text-slate-700',
  amber: 'text-amber-700',
  cyan: 'text-cyan-700',
  orange: 'text-orange-700',
  rose: 'text-rose-700',
  indigo: 'text-indigo-700',
  fuchsia: 'text-fuchsia-700',
};

export const CompanyLogo = ({ company, size = 'md' }) => {
  const [failed, setFailed] = useState(false);
  const accent = getAccentClasses(company);
  const wordmarkColor = LOGO_COLORS[company.accentColor] || 'text-blue-700';
  const sizes = {
    sm: 'h-10 w-16 text-xs',
    md: 'h-14 w-24 text-sm',
    lg: 'h-24 w-44 text-lg',
  };
  const wordmarkSizes = {
    sm: 'text-[11px]',
    md: 'text-sm',
    lg: 'text-2xl',
  };
  const logoSrc = company.logo || company.logoUrl;

  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-xl border bg-white/95 p-2 font-black tracking-wide shadow-inner ${sizes[size] || sizes.md} ${
        logoSrc && !failed ? 'border-border' : accent.logo
      }`}
      aria-label={`${company.nameKo || company.name} logo`}
    >
      {logoSrc && !failed ? (
        <img
          src={logoSrc}
          alt={`${company.nameKo || company.name} logo`}
          className="h-full w-full object-contain"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-white text-center">
          <span className={`max-w-full truncate font-black leading-none tracking-tight ${wordmarkColor} ${wordmarkSizes[size] || wordmarkSizes.md}`}>
            {company.name || company.logoText}
          </span>
          {size === 'lg' && company.nameKo && company.nameKo !== company.name && (
            <span className={`mt-1 max-w-full truncate text-sm font-bold ${wordmarkColor}`}>{company.nameKo}</span>
          )}
        </div>
      )}
    </div>
  );
};
