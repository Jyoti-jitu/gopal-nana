interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = false,
  light = false,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`space-y-3 ${centered ? "text-center" : "text-left"} ${className}`}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          light 
            ? "bg-slate-800 text-brand-red border border-slate-700" 
            : "bg-rose-50 text-brand-red border border-rose-100"
        }`}>
          <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
          {eyebrow}
        </div>
      )}
      
      <h2 className={`text-3xl sm:text-4xl lg:text-4xl font-extrabold tracking-tight ${
        light ? "text-white" : "text-brand-navy"
      }`}>
        {title}
      </h2>

      {subtitle && (
        <p className={`max-w-3xl text-base sm:text-lg leading-relaxed ${
          centered ? "mx-auto" : ""
        } ${light ? "text-slate-300" : "text-slate-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
