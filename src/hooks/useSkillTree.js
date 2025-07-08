import { useState, useMemo } from "react";
import { fullSkillsData, compactSkillData } from "../data/skills";

export default function useSkillTree() {
  const [compactMode, setCompactMode] = useState(false);
  const skills = compactMode ? compactSkillData : fullSkillsData;

  const [points, setPoints] = useState(() =>
    Object.fromEntries(skills.map((s) => [s.id, 0]))
  );

  const [highlightPaths, setHighlightPaths] = useState([]);

  // Ensure every skill gets a valid point value (prevents NaN)
  const safePoints = useMemo(() => {
    const result = {};
    for (const skill of skills) {
      result[skill.id] = points[skill.id] ?? 0;
    }
    return result;
  }, [points, skills]);

  const unlocked = useMemo(() => {
    const result = {};
    for (const skill of skills) {
      result[skill.id] = skill.prereq.every((p) => safePoints[p.id] >= p.points);
    }
    return result;
  }, [safePoints, skills]);

  const addPoint = (id) => {
    const skill = skills.find((s) => s.id === id);
    if (!skill || safePoints[id] >= skill.max) return;
    setPoints((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const subtractPoint = (id) => {
    if (!points[id] || points[id] <= 0) return;
    setPoints((prev) => ({ ...prev, [id]: prev[id] - 1 }));
  };

  const resetTree = () => {
    setPoints(Object.fromEntries(skills.map((s) => [s.id, 0])));
  };

  const toggleHighlightPath = (path) => {
    setHighlightPaths((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const toggleCompactMode = () => {
    const newMode = !compactMode;
    const newSkills = newMode ? compactSkillData : fullSkillsData;
    setCompactMode(newMode);
    setPoints(Object.fromEntries(newSkills.map((s) => [s.id, 0])));
  };

  return {
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
  };
}

