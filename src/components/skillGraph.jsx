/** @jsxImportSource react */
import { useMemo } from "react";
import useSkillTree from "../hooks/useSkillTree";
import { allPaths } from "../data/paths";
import SkillNode from "./skills/SkillNode";
import PathLegend from "./skills/PathLegend";

export default function SkillTree() {
  const {
    compactMode,
    toggleCompactMode,
    skills,
    safePoints,
    unlocked,
    addPoint,
    subtractPoint,
    resetTree,
    highlightPaths,
    toggleHighlightPath,
  } = useSkillTree();

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-200">Knife Skill Tree</h1>
        <div className="flex gap-2">
          <button
            onClick={toggleCompactMode}
            className="px-2 py-1 text-sm rounded bg-slate-700 text-white hover:bg-slate-600"
          >
            {compactMode ? "Switch to Full View" : "Switch to Compact View"}
          </button>
          <button
            onClick={resetTree}
            className="px-2 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
          >
            Reset
          </button>
        </div>
      </div>

      <PathLegend
        allPaths={allPaths}
        highlightPaths={highlightPaths}
        toggleHighlightPath={toggleHighlightPath}
      />

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}
      >
        {skills.map((skill) => {
          if (!skill) return null;
          const isUnlocked = unlocked[skill.id];
          const isDimmed =
            highlightPaths.length > 0 && !highlightPaths.includes(skill.path);

          return (
            <SkillNode
              key={skill.id}
              skill={skill}
              points={safePoints[skill.id] || 0}
              isUnlocked={isUnlocked}
              isDimmed={isDimmed}
              addPoint={addPoint}
              subtractPoint={subtractPoint}
            />
          );
        })}
      </div>
    </div>
  );
}

