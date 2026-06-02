export const DEFENSE_SEGMENT_META = {
  aerospace: { label: 'Aerospace', color: 'sky', classes: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  missile: { label: 'Missile', color: 'rose', classes: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
  land: { label: 'Land Systems', color: 'emerald', classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  naval: { label: 'Naval', color: 'blue', classes: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  electronics: { label: 'C4ISR/Electronics', color: 'violet', classes: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  munition: { label: 'Munition', color: 'amber', classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  propulsion: { label: 'Propulsion', color: 'orange', classes: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
  cyber: { label: 'Cyber/Space', color: 'cyan', classes: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
  prime: { label: 'Prime Contractor', color: 'slate', classes: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
};

export const DEFENSE_SEGMENTS = Object.entries(DEFENSE_SEGMENT_META).map(([id, meta]) => ({ id, ...meta }));

export const getDefenseSegmentClasses = (segment) =>
  DEFENSE_SEGMENT_META[segment]?.classes || 'bg-surface text-textMuted border-border';

export const getDefenseSegmentLabel = (segment) =>
  DEFENSE_SEGMENT_META[segment]?.label || segment;
