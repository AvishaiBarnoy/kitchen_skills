// src/hooks/useSkillGraph.js
import { useMemo } from "react";
import { convertSkillsToGraph } from "../lib/skillToGraph";
import { fullSkillsData } from "../data/skills";

export function useSkillGraph(points = {}) {
  return useMemo(() => {
    return convertSkillsToGraph(fullSkillsData, points);
  }, [points]);
}

