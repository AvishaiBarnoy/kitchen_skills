import dagre from "dagre";

export function getDagreLayout(skills) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 100 }); // Top-Bottom layout
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes
  skills.forEach(skill => {
    g.setNode(skill.id, { width: 150, height: 80 });
  });

  // Add edges from prereqs
  skills.forEach(skill => {
    (skill.prereq || []).forEach(pr => {
      g.setEdge(pr.id, skill.id);
    });
  });

  dagre.layout(g);

  const nodePositions = {};
  g.nodes().forEach(id => {
    const { x, y } = g.node(id);
    nodePositions[id] = { x, y };
  });

  return nodePositions;
}

