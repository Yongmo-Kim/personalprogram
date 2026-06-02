export const SEGMENT_META = {
  idm: { label: 'IDM', color: 'slate', classes: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
  fabless: { label: 'Fabless', color: 'violet', classes: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  chipless: { label: 'Chipless', color: 'indigo', classes: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
  'design-house': { label: 'Design House', color: 'purple', classes: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  foundry: { label: 'Foundry', color: 'blue', classes: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  osat: { label: 'OSAT', color: 'amber', classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  'supply-chain': { label: '소/부/장', color: 'orange', classes: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
};

export const SEGMENTS = Object.entries(SEGMENT_META).map(([id, meta]) => ({ id, ...meta }));

export const ACCENT_CLASSES = {
  emerald: {
    hero: 'border-emerald-500/40 bg-emerald-500/10',
    logo: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200',
    text: 'text-emerald-300',
  },
  blue: {
    hero: 'border-blue-500/40 bg-blue-500/10',
    logo: 'border-blue-400/40 bg-blue-500/15 text-blue-200',
    text: 'text-blue-300',
  },
  violet: {
    hero: 'border-violet-500/40 bg-violet-500/10',
    logo: 'border-violet-400/40 bg-violet-500/15 text-violet-200',
    text: 'text-violet-300',
  },
  purple: {
    hero: 'border-purple-500/40 bg-purple-500/10',
    logo: 'border-purple-400/40 bg-purple-500/15 text-purple-200',
    text: 'text-purple-300',
  },
  slate: {
    hero: 'border-slate-500/40 bg-slate-500/10',
    logo: 'border-slate-400/40 bg-slate-500/15 text-slate-200',
    text: 'text-slate-300',
  },
  amber: {
    hero: 'border-amber-500/40 bg-amber-500/10',
    logo: 'border-amber-400/40 bg-amber-500/15 text-amber-200',
    text: 'text-amber-300',
  },
  cyan: {
    hero: 'border-cyan-500/40 bg-cyan-500/10',
    logo: 'border-cyan-400/40 bg-cyan-500/15 text-cyan-200',
    text: 'text-cyan-300',
  },
  orange: {
    hero: 'border-orange-500/40 bg-orange-500/10',
    logo: 'border-orange-400/40 bg-orange-500/15 text-orange-200',
    text: 'text-orange-300',
  },
  rose: {
    hero: 'border-rose-500/40 bg-rose-500/10',
    logo: 'border-rose-400/40 bg-rose-500/15 text-rose-200',
    text: 'text-rose-300',
  },
  indigo: {
    hero: 'border-indigo-500/40 bg-indigo-500/10',
    logo: 'border-indigo-400/40 bg-indigo-500/15 text-indigo-200',
    text: 'text-indigo-300',
  },
  fuchsia: {
    hero: 'border-fuchsia-500/40 bg-fuchsia-500/10',
    logo: 'border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-200',
    text: 'text-fuchsia-300',
  },
};

export const getPrimarySegment = (company) => company?.segments?.[0] || 'idm';

export const getAccentColor = (company) => {
  if (company?.accentColor) return company.accentColor;
  return SEGMENT_META[getPrimarySegment(company)]?.color || 'blue';
};

export const getAccentClasses = (companyOrColor) => {
  const color = typeof companyOrColor === 'string' ? companyOrColor : getAccentColor(companyOrColor);
  return ACCENT_CLASSES[color] || ACCENT_CLASSES.blue;
};

export const getSegmentClasses = (segment) => SEGMENT_META[segment]?.classes || 'bg-surface text-textMuted border-border';

export const getSegmentLabel = (segment) => SEGMENT_META[segment]?.label || segment;
