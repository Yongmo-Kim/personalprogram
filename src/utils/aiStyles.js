export const SEGMENT_META = {
  hardware: { label: 'AI 인프라/하드웨어', color: 'emerald', classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  'cloud-bigtech': { label: '클라우드/빅테크', color: 'blue', classes: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  'foundation-models': { label: '파운데이션 모델', color: 'fuchsia', classes: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30' },
  'mlops-data': { label: '데이터/MLOps', color: 'amber', classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  applications: { label: 'AI 애플리케이션', color: 'violet', classes: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  'robotics-av': { label: '로보틱스/자율주행', color: 'orange', classes: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
  'security-gov': { label: 'AI 보안/거버넌스', color: 'slate', classes: 'bg-slate-500/15 text-slate-300 border-slate-500/30' }
};

export const SEGMENTS = Object.entries(SEGMENT_META).map(([id, meta]) => ({ id, ...meta }));

export const ACCENT_CLASSES = {
  emerald: { hero: 'border-emerald-500/40 bg-emerald-500/10', logo: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200', text: 'text-emerald-300' },
  blue: { hero: 'border-blue-500/40 bg-blue-500/10', logo: 'border-blue-400/40 bg-blue-500/15 text-blue-200', text: 'text-blue-300' },
  fuchsia: { hero: 'border-fuchsia-500/40 bg-fuchsia-500/10', logo: 'border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-200', text: 'text-fuchsia-300' },
  amber: { hero: 'border-amber-500/40 bg-amber-500/10', logo: 'border-amber-400/40 bg-amber-500/15 text-amber-200', text: 'text-amber-300' },
  violet: { hero: 'border-violet-500/40 bg-violet-500/10', logo: 'border-violet-400/40 bg-violet-500/15 text-violet-200', text: 'text-violet-300' },
  orange: { hero: 'border-orange-500/40 bg-orange-500/10', logo: 'border-orange-400/40 bg-orange-500/15 text-orange-200', text: 'text-orange-300' },
  slate: { hero: 'border-slate-500/40 bg-slate-500/10', logo: 'border-slate-400/40 bg-slate-500/15 text-slate-200', text: 'text-slate-300' },
};

export const getPrimarySegment = (company) => company?.segments?.[0] || 'hardware';

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
