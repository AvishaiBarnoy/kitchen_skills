import { useState, useCallback, useMemo } from "react";
import { fullSkillsData, compactSkillData } from "../data/skills";
import { computeUnlocks } from "../lib/utils";
import { usePersistedSkillPoints } from "./useLocalStorage";

export default function useSkillTree() {
  const [compactMode, setCompactMode] = useState(false);
  const [highlightPaths, setHighlightPaths] = useState([]);

  const skills = compactMode ? compactSkillData : fullSkillsData;
  const [points, setPoints, resetPoints] = usePersistedSkillPoints(skills);

  const canAddPoint = (id) => {
    const skill = skills.find((s) => s.id === id);
    if (!skill) return false;

    const current = points[id] || 0;
    if (current >= skill.max) return false;

    const prereqs = skill.prereq || []; // default to empty array
    return prereqs.every(
      (req) => (points[req.id] || 0) >= req.points
    );
  };

  const addPoint = (id) => {
    const skill = skills.find((s) => s.id === id);
    const max = skill?.max ?? Infinity;

    if (!canAddPoint(id)) return;

    setPoints((prev) => {
      const current = prev[id] || 0;
      if (current >= max) return prev;
      return {
        ...prev,
        [id]: current + 1,
      };
    });
  };

  const subtractPoint = (id) => {
    setPoints((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));
  };

  const resetTree = () => {
    resetPoints();
  };

  const toggleCompactMode = () => {
    setCompactMode((prev) => !prev);
  };

  const toggleHighlightPath = (path) => {
    setHighlightPaths((prev) =>
      prev.includes(path)
        ? prev.filter((p) => p !== path)
        : [...prev, path]
    );
  };

  //const unlocked = computeUnlocks(skills, points);
  const unlocked = useMemo(() => computeUnlocks(skills, points), [points, skills])

  // Ensure every skill gets a valid point value (prevents NaN)
  const safePoints = useMemo(() => {
    const result = {};
    for (const skill of skills) {
      result[skill.id] = points[skill.id] ?? 0;
    }
    return result;
  }, [points, skills]);

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
    canAddPoint,
  };
}

