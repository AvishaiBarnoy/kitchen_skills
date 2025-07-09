/** @jsxImportSource react */
import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { pathColors } from "../../data/paths";

export default function SkillNode({
  skill,
  points,
  isUnlocked,
  isDimmed,
  addPoint,
  subtractPoint,
  canAddPoint,
}) {
  if (!skill) return null;

  const canAdd = typeof canAddPoint === "function" ? canAddPoint(skill.id) : true;

  // Determine tooltip content
  let tooltipContent = "";
  if (!canAdd) {
    tooltipContent = `Requires: ` + skill.prereq.map(req => `${req.points} pts in "${req.id}"`).join(", ");
  } else if (isUnlocked && skill.prereq.length > 0) {
    tooltipContent = `Prerequisites: ` + skill.prereq.map(req => `${req.points} pts in "${req.id}"`).join(", ");
  }

  const baseColor = isUnlocked
    ? isDimmed
      ? "bg-gray-300 text-black"
      : `${pathColors[skill.path] || pathColors.default} text-white`
    : "bg-gray-500 text-black";

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            onClick={() => isUnlocked && canAdd && addPoint(skill.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              subtractPoint(skill.id);
            }}
            className={`rounded-full p-2 shadow-md text-sm text-center transition-colors duration-200
              ${baseColor}
              ${!canAdd ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <div className="font-semibold uppercase text-xs">{skill.name}</div>
            <div className="text-xs font-mono">
              {points >= skill.max ? "MAX" : `${points} / ${skill.max}`}
            </div>
            <div className="text-[10px] italic mt-1 leading-tight">{skill.description}</div>
          </div>
        </Tooltip.Trigger>
        {tooltipContent && (
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-gray-900 text-white px-3 py-1 rounded text-xs shadow z-50 max-w-xs"
              side="top"
              align="center"
            >
              {tooltipContent}
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        )}
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

