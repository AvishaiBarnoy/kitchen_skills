/** @jsxImportSource react */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

const pathColors = {
  vegetable: "bg-emerald-800/80",
  decorative: "bg-pink-800/80",
  protein: "bg-red-800/80",
  pastry: "bg-yellow-700/80",
  meta: "bg-gray-700/80",
  basic: "bg-sky-800/80",
  default: "bg-purple-800/80",
};

const allPaths = Object.keys(pathColors);

const skillData = [
  { id: "grip", name: "Grip", max: 3, tier: 0, prereq: [], path: "meta", description: "Fundamental skill to hold the knife safely with a pinch grip for control and power." },
  { id: "knifeTypes", name: "Knife Types", max: 3, tier: 0, prereq: [], path: "meta", description: "Identify, handle, and select different types of knives (chef's, boning, paring, serrated, etc.)." },
  { id: "sharpen", name: "Sharpen", max: 3, tier: 0, prereq: [], path: "meta", description: "Learn honing and sharpening using rods, stones, and pull-through sharpeners." },
  { id: "speed", name: "Speed", max: 5, tier: 0, prereq: [{ id: "grip", points: 1 }], path: "meta", description: "Develop rhythm, efficiency, and safe fast movement through repetitive tasks." },
  { id: "slice", name: "Slice", max: 3, tier: 1, prereq: [], path: "basic", description: "Basic push-pull cut for consistent thickness across ingredients." },
  { id: "peel", name: "Peel", max: 1, tier: 1, prereq: [], path: "basic", description: "Use a paring knife or peeler for fruit and vegetable skin removal." },
  { id: "coins", name: "Coins", max: 1, tier: 1, prereq: [{ id: "slice", points: 1 }], path: "basic", description: "Even circular slices from cylindrical items like cucumbers or carrots." },
  { id: "baton", name: "Baton", max: 1, tier: 1, prereq: [{ id: "slice", points: 1 }], path: "basic", description: "Thick rectangular sticks (e.g. for crudités)." },
  { id: "chop", name: "Chop", max: 2, tier: 2, prereq: [{ id: "slice", points: 1 }], path: "basic", description: "Rapid downward cut, often for herbs and vegetables." },
  { id: "diceLarge", name: "Dice Large", max: 1, tier: 2, prereq: [{ id: "slice", points: 1 }], path: "vegetable", description: "Cut into large uniform cubes (typically ~20 mm)." },
  { id: "core", name: "Core", max: 1, tier: 2, prereq: [{ id: "peel", points: 1 }], path: "vegetable", description: "Remove seeds, stems, or internal cores of fruits and vegetables." },
  { id: "deboning", name: "Deboning", max: 2, tier: 2, prereq: [{ id: "knifeTypes", points: 1 }], path: "protein", description: "Extract bones cleanly from meat, fish, and poultry." },
  { id: "diceMedium", name: "Dice Medium", max: 1, tier: 3, prereq: [{ id: "diceLarge", points: 1 }], path: "vegetable", description: "Cut into medium cubes (~12 mm)." },
  { id: "batonnet", name: "Batonnet", max: 1, tier: 3, prereq: [{ id: "baton", points: 1 }], path: "vegetable", description: "Medium rectangular sticks (6 mm x 6 mm x 5 cm)." },
  { id: "filleting", name: "Filleting", max: 2, tier: 3, prereq: [{ id: "deboning", points: 1 }], path: "protein", description: "Separate meat or fish from bones with precision." },
  { id: "oblique", name: "Oblique/Roll-Cut", max: 1, tier: 3, prereq: [{ id: "coins", points: 1 }], path: "vegetable", description: "Cut on alternating angles for decorative irregular wedges." },
  { id: "diceSmall", name: "Dice Small", max: 1, tier: 4, prereq: [{ id: "diceMedium", points: 1 }], path: "vegetable", description: "Small uniform cubes (~6 mm), often for mirepoix." },
  { id: "julienne", name: "Julienne", max: 2, tier: 4, prereq: [{ id: "batonnet", points: 1 }], path: "vegetable", description: "Thin matchstick cuts (3 mm x 3 mm x 5 cm)." },
  { id: "pinBoning", name: "Pin Boning", max: 1, tier: 4, prereq: [{ id: "filleting", points: 1 }], path: "protein", description: "Remove tiny bones left in fillets using tweezers or fingers." },
  { id: "tourné", name: "Tourné", max: 1, tier: 4, prereq: [{ id: "oblique", points: 1 }], path: "vegetable", description: "Football-shaped cut with 7 sides, often for presentation." },
  { id: "paysanne", name: "Paysanne", max: 1, tier: 4, prereq: [{ id: "diceMedium", points: 1 }], path: "vegetable", description: "Thin square, triangle, or round slices for quick cooking." },
  { id: "mince", name: "Mince", max: 1, tier: 5, prereq: [{ id: "diceSmall", points: 1 }, { id: "chop", points: 1 }], path: "basic", description: "Very fine chopping into small particles (e.g. garlic)." },
  { id: "fineJulienne", name: "Fine Julienne", max: 1, tier: 5, prereq: [{ id: "julienne", points: 1 }], path: "vegetable", description: "Ultra-thin matchsticks (~1 mm wide)." },
  { id: "chiffonade", name: "Chiffonade", max: 1, tier: 5, prereq: [{ id: "julienne", points: 2 }], path: "vegetable", description: "Ribbon-like strips of leafy herbs or greens." },
  { id: "brunoise", name: "Brunoise", max: 1, tier: 5, prereq: [{ id: "julienne", points: 1 }, { id: "diceSmall", points: 1 }], path: "vegetable", description: "1–2 mm precision cubes, often derived from julienne." },
  { id: "scoring", name: "Scoring Dough", max: 1, tier: 5, prereq: [{ id: "slice", points: 1 }], path: "pastry", description: "Slash dough to control expansion during baking." },
  { id: "supreme", name: "Supreme Segments", max: 1, tier: 5, prereq: [{ id: "peel", points: 1 }], path: "vegetable", description: "Segment citrus cleanly, removing all membranes." },
  { id: "butterfly", name: "Butterfly Cut", max: 1, tier: 5, prereq: [{ id: "filleting", points: 1 }], path: "protein", description: "Slice meat or fish almost in half and open it like a book." },
  { id: "spatchcock", name: "Spatchcock", max: 1, tier: 5, prereq: [{ id: "deboning", points: 1 }], path: "protein", description: "Split and flatten poultry for even grilling or roasting." },
  { id: "frenching", name: "Frenching Bones", max: 1, tier: 5, prereq: [{ id: "deboning", points: 1 }], path: "protein", description: "Scrape meat from bones for a clean presentation." },
  { id: "trimming", name: "Trimming Fat/Skin", max: 1, tier: 5, prereq: [{ id: "deboning", points: 1 }], path: "protein", description: "Remove excess fat or connective tissue from meats." },
  { id: "bias", name: "Bias Slice", max: 1, tier: 5, prereq: [{ id: "slice", points: 1 }], path: "pastry", description: "Angled slicing for larger surface area and elegant shape." },
  { id: "scalloping", name: "Scalloping", max: 1, tier: 5, prereq: [{ id: "slice", points: 1 }], path: "pastry", description: "Wavy decorative cuts along the edge of dough or fruit." },
  { id: "fluting", name: "Fluting Mushrooms", max: 1, tier: 5, prereq: [{ id: "peel", points: 1 }], path: "decorative", description: "Decorative grooves cut into mushroom caps." },
  { id: "channel", name: "Channel Cuts", max: 1, tier: 5, prereq: [{ id: "peel", points: 1 }], path: "decorative", description: "Striped peel patterns using a channel knife." },
  { id: "twist", name: "Citrus Twist", max: 1, tier: 5, prereq: [{ id: "peel", points: 1 }], path: "decorative", description: "Spiral garnish from citrus peel, often for drinks." },
];

const paths = Array.from(new Set(skillData.map((s) => s.path)));
const maxTier = Math.max(...skillData.map((s) => s.tier));
export default function SkillTree() {
  const [points, setPoints] = useState(() => Object.fromEntries(skillData.map((s) => [s.id, 0])));
  const [highlightPaths, setHighlightPaths] = useState([]);

  const unlocked = useMemo(() => {
    const out = {};
    for (const s of skillData) {
      out[s.id] = s.prereq.every((p) => points[p.id] >= p.points);
    }
    return out;
  }, [points]);

  const addPoint = (id) => {
    const skill = skillData.find((s) => s.id === id);
    if (!skill || points[id] >= skill.max) return;
    setPoints((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const subtractPoint = (id) => {
    if (points[id] <= 0) return;
    setPoints((prev) => ({ ...prev, [id]: prev[id] - 1 }));
  };

  const resetTree = () => {
    setPoints(Object.fromEntries(skillData.map((s) => [s.id, 0])));
  };

  const toggleHighlightPath = (path) => {
    setHighlightPaths((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const cell = 120;
  const positions = useMemo(() => {
    const out = {};
    for (const s of skillData) {
      const col = paths.indexOf(s.path);
      const row = s.tier;
      out[s.id] = {
        x: col * cell + cell / 2,
        y: row * cell + cell / 2,
        col,
        row,
      };
    }
    return out;
  }, []);

  return (
    <div className="relative p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-amber-300 drop-shadow-lg font-fantasy">Knife Skill Tree</h1>
        <div className="flex gap-2">
          <button onClick={resetTree} className="px-3 py-1 rounded bg-red-200 hover:bg-red-300 font-fantasy">
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {allPaths.map((path) => (
          <button
            key={path}
            className={`px-2 py-1 text-sm rounded border-2 font-fantasy ${
              highlightPaths.includes(path)
                ? "bg-amber-800 text-yellow-200 border-yellow-400"
                : "bg-amber-900/50 text-yellow-100 border-yellow-700"
            } ${pathColors[path]}`}
            onClick={() => toggleHighlightPath(path)}
          >
            {path.charAt(0).toUpperCase() + path.slice(1)}
          </button>
        ))}
      </div>

      <div
        className="relative mx-auto"
        style={{ width: paths.length * cell, height: (maxTier + 1) * cell }}
      >
        <svg className="absolute inset-0 pointer-events-none" strokeWidth="2">
          {skillData.map((skill) =>
            skill.prereq.map((p) => {
              const from = positions[p.id];
              const to = positions[skill.id];
              if (!from || !to) return null;
              return (
                <line
                  key={`${skill.id}-${p.id}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#fde68a"
                />
              );
            })
          )}
        </svg>
        {skillData.map((skill) => {
          const pos = positions[skill.id];
          const isUnlocked = unlocked[skill.id];
          const bgClass = isUnlocked
            ? highlightPaths.length > 0 && !highlightPaths.includes(skill.path)
              ? "bg-gray-200"
              : pathColors[skill.path] || pathColors.default
            : "bg-gray-300";
          const textClass = isUnlocked && !(highlightPaths.length > 0 && !highlightPaths.includes(skill.path))
            ? "text-yellow-100"
            : "text-black";
          return (
            <motion.div
              key={skill.id}
              whileHover={{ scale: 1.05 }}
              className="absolute group"
              style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
            >
              <div
                onClick={() => isUnlocked && addPoint(skill.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  subtractPoint(skill.id);
                }}
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl border-2 border-amber-700 cursor-pointer font-fantasy ${bgClass} ${textClass}`}
              >
                <div className="text-sm font-semibold text-center px-1">{skill.name}</div>
                <div className="text-xs">{points[skill.id]} / {skill.max}</div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-full mt-2 hidden group-hover:block bg-black text-yellow-100 text-xs p-2 rounded w-40 z-10">
                <div className="font-semibold mb-1">{skill.name}</div>
                <div>{skill.description}</div>
                <div className="mt-1">Points: {points[skill.id]} / {skill.max}</div>
                {skill.prereq.length > 0 && (
                  <div className="mt-1 italic">
                    Requires {skill.prereq.map((p, i) => {
                      const reqName = skillData.find((s) => s.id === p.id)?.name || p.id;
                      return `${reqName} (${p.points})${i < skill.prereq.length - 1 ? ', ' : ''}`;
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
