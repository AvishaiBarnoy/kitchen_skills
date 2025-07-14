/** @jsxImportSource react */
import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { pathColors } from "../../data/paths";

/**
 * SkillNode component represents a single skill in the skill tree
 * Optimized with React.memo to prevent unnecessary re-renders
 * @param {Object} skill - The skill data object
 * @param {number} points - Current points invested in this skill
 * @param {boolean} isUnlocked - Whether the skill is unlocked
 * @param {boolean} isDimmed - Whether the skill should appear dimmed
 * @param {Function} addPoint - Function to add a point to the skill
 * @param {Function} subtractPoint - Function to subtract a point from the skill
 * @param {Function} canAddPoint - Function to check if a point can be added
 */
const SkillNode = React.memo(function SkillNode({
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (isUnlocked && canAdd) {
                  addPoint(skill.id);
                }
              } else if (e.key === 'Backspace' || e.key === 'Delete') {
                e.preventDefault();
                subtractPoint(skill.id);
              }
            }}
            tabIndex={isUnlocked ? 0 : -1}
            role="button"
            aria-label={`${skill.name} skill. ${points} out of ${skill.max} points. ${skill.description}. ${tooltipContent || (canAdd ? 'Click to add point, right-click to remove' : '')}`}
            className={`rounded-full p-2 shadow-md text-sm text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900
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
});

export default SkillNode;

