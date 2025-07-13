import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSkillGraph } from '../useSkillGraph'

// Mock the skills data
vi.mock('../../data/skills', () => ({
  fullSkillsData: [
    { id: 'grip', name: 'Grip', tier: 0, prereq: [] },
    { id: 'slice', name: 'Slice', tier: 1, prereq: [{ id: 'grip', points: 1 }] },
    { id: 'dice', name: 'Dice', tier: 2, prereq: [{ id: 'slice', points: 2 }] },
  ],
}))

// Mock the convertSkillsToGraph function
vi.mock('../../lib/skillToGraph', () => ({
  convertSkillsToGraph: vi.fn((skills, points) => ({
    nodes: skills.map(skill => ({
      id: skill.id,
      data: { skill, points: points[skill.id] || 0 },
    })),
    edges: [],
  })),
}))

describe('useSkillGraph', () => {
  it('should return graph data with nodes and edges', () => {
    const { result } = renderHook(() => useSkillGraph())
    
    expect(result.current).toHaveProperty('nodes')
    expect(result.current).toHaveProperty('edges')
    expect(result.current.nodes).toHaveLength(3)
  })

  it('should include points in the graph data', () => {
    const points = { grip: 2, slice: 1 }
    const { result } = renderHook(() => useSkillGraph(points))
    
    const gripNode = result.current.nodes.find(node => node.id === 'grip')
    expect(gripNode.data.points).toBe(2)
    
    const sliceNode = result.current.nodes.find(node => node.id === 'slice')
    expect(sliceNode.data.points).toBe(1)
  })

  it('should handle empty points object', () => {
    const { result } = renderHook(() => useSkillGraph({}))
    
    result.current.nodes.forEach(node => {
      expect(node.data.points).toBe(0)
    })
  })

  it('should memoize result and only recalculate when points change', () => {
    const points = { grip: 1 }
    
    const { result, rerender } = renderHook(() => useSkillGraph(points))
    
    const firstResult = result.current
    
    // Re-render with same points
    rerender()
    
    // Should be the same object reference (memoized)
    expect(result.current).toBe(firstResult)
  })

  it('should recalculate when points change', () => {
    let points = { grip: 1 }
    
    const { result, rerender } = renderHook(({ points }) => useSkillGraph(points), {
      initialProps: { points }
    })
    
    const firstResult = result.current
    
    // Change points and rerender
    points = { grip: 2 }
    rerender({ points })
    
    // Should be a different object reference
    expect(result.current).not.toBe(firstResult)
  })
})