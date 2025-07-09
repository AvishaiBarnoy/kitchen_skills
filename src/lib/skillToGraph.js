// src/lib/skillToGraph.js
export function convertSkillsToGraph(skills, points = {}) {
  const nodes = skills.map((skill) => ({
    id: skill.id,
    type: "skillNode",
    position: { x: skill.tier * 200, y: Math.random() * 500 }, // improve layout later
    data: { skill, points: points[skill.id] || 0 },
  }));

  const edges = [];
  for (const skill of skills) {
    for (const prereq of skill.prereq) {
      edges.push({
        id: `${prereq.id}->${skill.id}`,
        source: prereq.id,
        target: skill.id,
        label: `${prereq.points}pt`,
        animated: true,
        style: { stroke: "#888" },
      });
    }
  }

  return { nodes, edges };
}

