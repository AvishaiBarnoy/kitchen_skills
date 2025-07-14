/** @jsxImportSource react */
import { pathColors } from "../../data/paths";

export default function PathLegend({ paths, highlightPaths, onToggleHighlight }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {paths.map((path) => (
        <button
          key={path.id}
          onClick={() => onToggleHighlight(path.id)}
          className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
            highlightPaths.includes(path.id)
              ? "bg-opacity-90 border-white ring-2 ring-yellow-400"
              : "bg-opacity-30 border-slate-500 hover:bg-opacity-50"
          } ${pathColors[path.id] || pathColors.default}`}
        >
          {path.name}
        </button>
      ))}
    </div>
  );
}

