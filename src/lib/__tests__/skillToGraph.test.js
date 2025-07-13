import { describe, it, expect } from 'vitest'
import { convertSkillsToGraph } from '../skillToGraph'

describe('convertSkillsToGraph', () => {
  const mockSkills = [
    {
      id: 'grip',
      name: 'Grip',
      tier: 0,
      prereq: [],
    },
    {
      id: 'slice',
      name: 'Slice',
      tier: 1,
      prereq: [{ id: 'grip', points: 1 }],
    },
    {
      id: 'dice',
      name: 'Dice',
      tier: 2,
      prereq: [{ id: 'slice', points: 2 }],
    },
  ]

  it('should convert skills to graph format with nodes and edges', () => {
    const result = convertSkillsToGraph(mockSkills)
    
    expect(result).toHaveProperty('nodes')
    expect(result).toHaveProperty('edges')
    expect(result.nodes).toHaveLength(3)
    expect(result.edges).toHaveLength(2)
  })

  it('should create correct node structure', () => {
    const result = convertSkillsToGraph(mockSkills)
    const gripNode = result.nodes.find(node => node.id === 'grip')
    
    expect(gripNode).toEqual({
      id: 'grip',
      type: 'skillNode',
      position: { x: 0, y: expect.any(Number) },
      data: { skill: mockSkills[0], points: 0 },
    })
  })

  it('should create correct edge structure', () => {
    const result = convertSkillsToGraph(mockSkills)
    const sliceEdge = result.edges.find(edge => edge.target === 'slice')
    
    expect(sliceEdge).toEqual({
      id: 'grip->slice',
      source: 'grip',
      target: 'slice',
      label: '1pt',
      animated: true,
      style: { stroke: '#888' },
    })
  })

  it('should include points in node data when provided', () => {
    const points = { grip: 2, slice: 1 }
    const result = convertSkillsToGraph(mockSkills, points)
    
    const gripNode = result.nodes.find(node => node.id === 'grip')
    expect(gripNode.data.points).toBe(2)
    
    const sliceNode = result.nodes.find(node => node.id === 'slice')
    expect(sliceNode.data.points).toBe(1)
  })

  it('should position nodes based on tier', () => {
    const result = convertSkillsToGraph(mockSkills)
    
    const gripNode = result.nodes.find(node => node.id === 'grip')
    const sliceNode = result.nodes.find(node => node.id === 'slice')
    const diceNode = result.nodes.find(node => node.id === 'dice')
    
    expect(gripNode.position.x).toBe(0)
    expect(sliceNode.position.x).toBe(200)
    expect(diceNode.position.x).toBe(400)
  })

  it('should handle skills with no prerequisites', () => {
    const skillsWithNoPrereqs = [
      { id: 'grip', name: 'Grip', tier: 0, prereq: [] },
    ]
    
    const result = convertSkillsToGraph(skillsWithNoPrereqs)
    
    expect(result.nodes).toHaveLength(1)
    expect(result.edges).toHaveLength(0)
  })

  it('should handle skills with multiple prerequisites', () => {
    const skillsWithMultiplePrereqs = [
      { id: 'grip', name: 'Grip', tier: 0, prereq: [] },
      { id: 'slice', name: 'Slice', tier: 1, prereq: [] },
      { id: 'advanced', name: 'Advanced', tier: 2, prereq: [
        { id: 'grip', points: 1 },
        { id: 'slice', points: 2 },
      ]},
    ]
    
    const result = convertSkillsToGraph(skillsWithMultiplePrereqs)
    
    expect(result.nodes).toHaveLength(3)
    expect(result.edges).toHaveLength(2)
    
    const advancedEdges = result.edges.filter(edge => edge.target === 'advanced')
    expect(advancedEdges).toHaveLength(2)
  })
})