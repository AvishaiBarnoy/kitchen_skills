// src/components/SkillNode.jsx
/** @jsxImportSource react */
import React from "react";
import { pathColors } from "../../data/paths";

export default function SkillNode({ skill, points, isUnlocked, isDimmed, addPoint, subtractPoint }) {
  const baseColor = isUnlocked
    ? isDimmed
      ? "bg-gray-300 text-black"
      : `${pathColors[skill.path] || pathColors.default} text-white`
    : "bg-gray-500 text-black";

  return (
    <div
      onClick={() => isUnlocked && addPoint(skill.id)}
      onContextMenu={(e) => {
        e.preventDefault();
        subtractPoint(skill.id);
      }}
      className={`rounded-full p-2 shadow-md text-sm cursor-pointer text-center transition-colors duration-200 ${baseColor}`}
    >
      <div className="font-semibold uppercase text-xs">{skill.name}</div>
      <div className="text-xs font-mono">{points} / {skill.max}</div>
      <div className="text-[10px] italic mt-1 leading-tight">{skill.description}</div>
    </div>
  );
}

