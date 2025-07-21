/** @jsxImportSource react */
import React, { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  Position,
} from 'reactflow';
import { motion } from 'framer-motion';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

import SkillNode from './SkillNode';
import { pathColors } from '@/data/paths';

// Custom node wrapper for React Flow
const SkillNodeWrapper = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: data.index * 0.05 }}
    >
      <SkillNode {...data} />
    </motion.div>
  );
};

// Define node types for React Flow
const nodeTypes = {
  skillNode: SkillNodeWrapper,
};

const ReactFlowSkillGraph = ({
  skills,
  safePoints,
  unlocked,
  addPoint,
  subtractPoint,
  highlightPaths,
  canAddPoint,
}) => {
  // Create layout using Dagre
  const createLayoutedElements = useCallback((skills) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ 
      rankdir: 'TB', // Top to Bottom
      nodesep: 100,   // Horizontal spacing between nodes
      ranksep: 120,   // Vertical spacing between ranks
      marginx: 50,
      marginy: 50,
    });

    // Add nodes to dagre graph
    skills.forEach((skill) => {
      if (!skill) return;
      dagreGraph.setNode(skill.id, { 
        width: 160, 
        height: 120 
      });
    });

    // Add edges (dependencies) to dagre graph
    const edges = [];
    skills.forEach((skill) => {
      if (!skill || !skill.prereq) return;
      skill.prereq.forEach((prereq) => {
        dagreGraph.setEdge(prereq.id, skill.id);
        edges.push({
          id: `${prereq.id}-${skill.id}`,
          source: prereq.id,
          target: skill.id,
          type: 'smoothstep',
          style: {
            stroke: unlocked[skill.id] ? '#10b981' : '#6b7280',
            strokeWidth: unlocked[skill.id] ? 3 : 2,
            opacity: highlightPaths.length > 0 && !highlightPaths.includes(skill.path) ? 0.3 : 1,
          },
          animated: unlocked[skill.id] && unlocked[prereq.id],
          markerEnd: {
            type: 'arrowclosed',
            color: unlocked[skill.id] ? '#10b981' : '#6b7280',
          },
        });
      });
    });

    // Calculate layout
    dagre.layout(dagreGraph);

    // Convert to React Flow format
    const nodes = skills.map((skill, index) => {
      if (!skill) return null;
      
      const nodeWithPosition = dagreGraph.node(skill.id);
      const isDimmed = highlightPaths.length > 0 && !highlightPaths.includes(skill.path);
      
      return {
        id: skill.id,
        type: 'skillNode',
        position: {
          x: nodeWithPosition.x - nodeWithPosition.width / 2,
          y: nodeWithPosition.y - nodeWithPosition.height / 2,
        },
        data: {
          skill,
          points: safePoints[skill.id] || 0,
          isUnlocked: unlocked[skill.id],
          isDimmed,
          addPoint,
          subtractPoint,
          canAddPoint,
          index,
        },
        style: {
          background: 'transparent',
          border: 'none',
          width: nodeWithPosition.width,
          height: nodeWithPosition.height,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      };
    }).filter(Boolean);

    return { nodes, edges };
  }, [safePoints, unlocked, highlightPaths, addPoint, subtractPoint, canAddPoint]);

  // Generate nodes and edges
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => createLayoutedElements(skills),
    [skills, createLayoutedElements]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // Update nodes when skills change
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = createLayoutedElements(skills);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [skills, createLayoutedElements, setNodes, setEdges]);

  // Minimap node color function
  const minimapNodeColor = useCallback((node) => {
    const skill = node.data.skill;
    const isUnlocked = node.data.isUnlocked;
    const isDimmed = node.data.isDimmed;
    
    if (!isUnlocked) return '#6b7280'; // Gray for locked
    if (isDimmed) return '#9ca3af'; // Light gray for dimmed
    
    // Use path color for unlocked nodes
    const pathColor = pathColors[skill.path] || pathColors.default;
    // Extract color from Tailwind classes (simplified)
    const colorMap = {
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#10b981',
      'bg-red-500': '#ef4444',
      'bg-purple-500': '#8b5cf6',
      'bg-yellow-500': '#eab308',
      'bg-pink-500': '#ec4899',
      'bg-indigo-500': '#6366f1',
      'bg-orange-500': '#f97316',
    };
    
    return colorMap[pathColor] || '#8b5cf6';
  }, []);

  const proOptions = { hideAttribution: true };

  return (
    <div className="h-[70vh] w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        minZoom={0.2}
        maxZoom={2}
        attributionPosition="bottom-left"
        proOptions={proOptions}
        fitView
        fitViewOptions={{
          padding: 0.1,
          includeHiddenNodes: false,
        }}
      >
        {/* Background Pattern */}
        <Background 
          color="#374151" 
          gap={20} 
          size={1}
          variant="dots"
        />
        
        {/* Zoom/Pan Controls */}
        <Controls 
          position="top-right"
          className="bg-gray-800 border-gray-600"
          showInteractive={false}
        />
        
        {/* Minimap */}
        <MiniMap
          nodeColor={minimapNodeColor}
          nodeStrokeWidth={3}
          nodeStrokeColor="#ffffff"
          position="bottom-right"
          className="bg-gray-800 border border-gray-600 rounded"
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowSkillGraph;