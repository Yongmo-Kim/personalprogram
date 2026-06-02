export const DefenseLogo = ({ item, size = 'md' }) => {
  const sizes = {
    sm: 'h-10 w-16 text-[10px]',
    md: 'h-14 w-24 text-xs',
    lg: 'h-24 w-44 text-base',
  };
  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-xl border border-sky-400/30 bg-slate-950/90 p-2 font-black tracking-wide text-sky-200 shadow-inner ${sizes[size] || sizes.md}`}
      aria-label={`${item.nameKo || item.name} logo`}
    >
      <span className="max-w-full truncate text-center leading-tight">{item.logoText || item.nameKo || item.name}</span>
    </div>
  );
};
