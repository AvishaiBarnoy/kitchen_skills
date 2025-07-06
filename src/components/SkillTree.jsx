/** @jsxImportSource react */
import { useState, useMemo } from "react";
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";

// ---- Skill data ----
const skillData = [
  { id: "grip", name: "Grip", max: 3, tier: 0, prereq: [] },
  { id: "knifeTypes", name: "Knife Types", max: 3, tier: 0, prereq: [] },
  { id: "sharpen", name: "Sharpen", max: 3, tier: 0, prereq: [] },
  { id: "speed", name: "Speed", max: 5, tier: 0, prereq: ["grip"] },

  { id: "slice", name: "Slice", max: 3, tier: 1, prereq: [] },
  { id: "peel", name: "Peel", max: 1, tier: 1, prereq: [] },
  { id: "coins", name: "Coins", max: 1, tier: 1, prereq: ["slice"] },
  { id: "baton", name: "Baton", max: 1, tier: 1, prereq: ["slice"] },

  { id: "chop", name: "Chop", max: 2, tier: 2, prereq: ["slice", "grip"] },
  { id: "diceLarge", name: "Dice Large", max: 1, tier: 2, prereq: ["slice", "grip"] },
  { id: "core", name: "Core", max: 1, tier: 2, prereq: ["peel", "grip"] },
  { id: "deboning", name: "Deboning", max: 2, tier: 2, prereq: ["knifeTypes", "grip"] },

  { id: "diceMedium", name: "Dice Medium", max: 1, tier: 3, prereq: ["diceLarge", "grip"] },
  { id: "batonnet", name: "Batonnet", max: 1, tier: 3, prereq: ["baton", "grip"] },
  { id: "filleting", name: "Filleting", max: 2, tier: 3, prereq: ["deboning", "grip"] },

  { id: "diceSmall", name: "Dice Small", max: 1, tier: 4, prereq: ["diceMedium", "grip"] },
  { id: "julienne", name: "Julienne", max: 2, tier: 4, prereq: ["batonnet", "grip"] },
  { id: "pinBoning", name: "Pin Boning", max: 1, tier: 4, prereq: ["filleting", "grip"] },

  { id: "mince", name: "Mince", max: 1, tier: 5, prereq: ["diceSmall", "chop", "grip"] },
  { id: "fineJulienne", name: "Fine Julienne", max: 1, tier: 5, prereq: ["julienne", "grip"] },
  { id: "chiffonade", name: "Chiffonade", max: 1, tier: 5, prereq: ["julienne", "grip"] },
  { id: "brunoise", name: "Brunoise", max: 1, tier: 5, prereq: ["julienne", "diceSmall", "grip"] },
];

// pre-compute tier list for layout
const tiers = [...new Set(skillData.map((s) => s.tier))].sort((a, b) => a - b);


function SkillNode({ skill, points, canClick, onClick }) {
  const pct = points / skill.max;
  const locked = !canClick;

  const colorClasses = locked
    ? "bg-gray-700 border-gray-600 text-gray-400"
    : pct === 1
    ? "bg-green-700 border-green-500 text-white"
    : "bg-gray-800 border-gray-500 text-white";

  return (
    <motion.div
      whileHover={{ scale: canClick ? 1.05 : 1 }}
      onClick={() => canClick && onClick(skill.id)}
      className={locked ? "pointer-events-none select-none opacity-50" : "cursor-pointer"}
    >
      <Card
        className={`w-24 h-24 rounded-full border-2 shadow-md flex flex-col items-center justify-center transition ${colorClasses}`}
      >
        <CardContent className="flex flex-col items-center justify-center p-0 gap-1">
          <span className="font-semibold text-sm leading-none">{skill.name}</span>
          <span className="text-xs">{points}/{skill.max}</span>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SkillTree() {
  const [points, setPoints] = useState(() =>
    Object.fromEntries(skillData.map((s) => [s.id, 0]))
  );

  // a skill is unlocked if every prerequisite has ≥1 point
  const canClick = useMemo(() => {
    const out = {};
    for (const s of skillData) {
      out[s.id] = s.prereq.every((p) => points[p] > 0);
    }
    return out;
  }, [points]);

  const addPoint = (id) => {
    setPoints((prev) => {
      const skill = skillData.find((s) => s.id === id);
      if (!skill || prev[id] >= skill.max) return prev;
      return { ...prev, [id]: prev[id] + 1 };
    });
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">Knife-Skill Tree</h1>
      {tiers.map((tier) => (
        <div key={tier} className="flex justify-center gap-4 flex-wrap">
          {skillData
            .filter((s) => s.tier === tier)
            .map((skill) => (
              <SkillNode
                key={skill.id}
                skill={skill}
                points={points[skill.id]}
                canClick={canClick[skill.id]}
                onClick={addPoint}
              />
            ))}
        </div>
      ))}
    </div>
  );
}

