export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-surface rounded-xl shadow-lg border border-border p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  );
};
