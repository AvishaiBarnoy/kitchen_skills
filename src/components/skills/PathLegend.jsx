/** @jsxImportSource react */
import { pathColors } from "../../data/paths";

export default function PathLegend({ highlightPaths, toggleHighlightPath }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {Object.entries(pathColors).map(([path, color]) => (
        <button
          key={path}
          onClick={() => toggleHighlightPath(path)}
          className={`px-2 py-1 text-xs rounded border ${highlightPaths.includes(path)
            ? "bg-opacity-90 border-white"
            : "bg-opacity-30 border-gray-500"} ${color}`}
        >
          {path.charAt(0).toUpperCase() + path.slice(1)}
        </button>
      ))}
    </div>
  );
}

