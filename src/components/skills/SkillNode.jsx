/** @jsxImportSource react */
import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { pathColors } from "../../data/paths";
import { useSkillTreeStore } from "../../store/skillTreeStore";

export default function SkillNode({
  skill,
  currentPoints,
  isUnlocked,
  isHighlighted,
  onClick,
  onRightClick,
}) {
  const canAddPoint = useSkillTreeStore((state) => state.canAddPoint);
  
  if (!skill) return null;

  const canAdd = canAddPoint(skill.id);
  const points = currentPoints || 0;

  let tooltipContent = "";
  if (!canAdd) {
    tooltipContent =
      "Requires: " +
      skill.prereq.map((req) => `${req.points} pts in "${req.id}"`).join(", ");
  } else if (isUnlocked && skill.prereq.length > 0) {
    tooltipContent =
      "Prerequisites: " +
      skill.prereq.map((req) => `${req.points} pts in "${req.id}"`).join(", ");
  }

  const baseColor = isUnlocked
    ? isHighlighted
      ? `${pathColors[skill.path] || pathColors.default} text-white ring-2 ring-yellow-400`
      : `${pathColors[skill.path] || pathColors.default} text-white`
    : "bg-slate-600 text-slate-300";

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            onClick={() => isUnlocked && canAdd && onClick()}
            onContextMenu={(e) => {
              e.preventDefault();
              onRightClick(e);
            }}
            className={`rounded-lg p-4 shadow-lg text-sm text-center transition-all duration-200 cursor-pointer hover:scale-105
              ${baseColor}
              ${!canAdd ? "opacity-60 cursor-not-allowed" : ""}
              ${points >= skill.max ? "ring-2 ring-green-400" : ""}
            `}
          >
            <div className="font-semibold text-sm mb-1">{skill.name}</div>
            <div className="text-xs font-mono mb-2">
              {points >= skill.max ? "MAX" : `${points} / ${skill.max}`}
            </div>
            <div className="text-[11px] opacity-80 leading-tight">
              {skill.description}
            </div>
            
            {/* Path indicator */}
            <div className="text-[10px] mt-2 opacity-60 capitalize">
              {skill.path}
            </div>
          </div>
        </Tooltip.Trigger>
        {tooltipContent && (
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-xl z-50 max-w-xs border border-slate-700"
              side="top"
              align="center"
            >
              {tooltipContent}
              <Tooltip.Arrow className="fill-slate-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        )}
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

