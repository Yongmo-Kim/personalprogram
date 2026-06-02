export const Input = ({ label, id, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-textMuted ml-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className="bg-background border border-border rounded-xl px-4 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
        {...props}
      />
    </div>
  );
};
