"use client";

type Props = {
  filters: string[];
  active: string;
  onChange: (filter: string) => void;
};

export default function FilterBar({ filters, active, onChange }: Props) {
  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-2 sm:gap-3 rounded-full border border-white/10 bg-black/60 p-2 sm:p-3 min-w-max sm:min-w-0 sm:flex-wrap">
        {filters.map((filter) => {
          const isActive = filter === active;
          return (
            <button
              key={filter}
              onClick={() => onChange(filter)}
              className={`rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                isActive
                  ? "border-cyan-neon bg-cyan-neon text-black shadow-neon"
                  : "border-white/15 text-white/80 hover:border-cyan-neon hover:text-white"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}

