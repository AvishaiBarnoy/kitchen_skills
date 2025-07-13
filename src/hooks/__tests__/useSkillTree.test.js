import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useSkillTree from '../useSkillTree'

// Mock the skills data
vi.mock('../../data/skills', () => ({
  fullSkillsData: [
    { id: 'grip', name: 'Grip', max: 3, tier: 0, prereq: [], path: 'meta' },
    { id: 'slice', name: 'Slice', max: 3, tier: 1, prereq: [{ id: 'grip', points: 1 }], path: 'basic' },
    { id: 'dice', name: 'Dice', max: 3, tier: 2, prereq: [{ id: 'slice', points: 2 }], path: 'vegetable' },
  ],
  compactSkillData: [
    { id: 'grip', name: 'Grip', max: 3, tier: 0, prereq: [], path: 'meta' },
    { id: 'slice', name: 'Slice', max: 3, tier: 1, prereq: [{ id: 'grip', points: 1 }], path: 'basic' },
  ],
}))

describe('useSkillTree', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useSkillTree())
    
    expect(result.current.compactMode).toBe(false)
    expect(result.current.skills).toHaveLength(3) // fullSkillsData
    expect(result.current.safePoints).toEqual({
      grip: 0,
      slice: 0,
      dice: 0,
    })
    expect(result.current.highlightPaths).toEqual([])
  })

  it('should toggle compact mode', () => {
    const { result } = renderHook(() => useSkillTree())
    
    act(() => {
      result.current.toggleCompactMode()
    })
    
    expect(result.current.compactMode).toBe(true)
    expect(result.current.skills).toHaveLength(2) // compactSkillData
  })

  it('should add points to a skill when prerequisites are met', () => {
    const { result } = renderHook(() => useSkillTree())
    
    act(() => {
      result.current.addPoint('grip')
    })
    
    expect(result.current.safePoints.grip).toBe(1)
  })

  it('should not add points beyond max skill level', () => {
    const { result } = renderHook(() => useSkillTree())
    
    act(() => {
      result.current.addPoint('grip')
      result.current.addPoint('grip')
      result.current.addPoint('grip')
      result.current.addPoint('grip') // Should not add this one
    })
    
    expect(result.current.safePoints.grip).toBe(3)
  })

  it('should not add points when prerequisites are not met', () => {
    const { result } = renderHook(() => useSkillTree())
    
    act(() => {
      result.current.addPoint('slice') // requires grip: 1
    })
    
    expect(result.current.safePoints.slice).toBe(0)
  })

  it('should subtract points from a skill', () => {
    const { result } = renderHook(() => useSkillTree())
    
    act(() => {
      result.current.addPoint('grip')
      result.current.addPoint('grip')
    })
    
    expect(result.current.safePoints.grip).toBe(2)
    
    act(() => {
      result.current.subtractPoint('grip')
    })
    
    expect(result.current.safePoints.grip).toBe(1)
  })

  it('should not subtract points below zero', () => {
    const { result } = renderHook(() => useSkillTree())
    
    act(() => {
      result.current.subtractPoint('grip')
    })
    
    expect(result.current.safePoints.grip).toBe(0)
  })

  it('should reset all points', () => {
    const { result } = renderHook(() => useSkillTree())
    
    act(() => {
      result.current.addPoint('grip')
      result.current.addPoint('grip')
    })
    
    expect(result.current.safePoints.grip).toBe(2)
    
    act(() => {
      result.current.resetTree()
    })
    
    expect(result.current.safePoints.grip).toBe(0)
  })

  it('should correctly determine if a skill can have points added', () => {
    const { result } = renderHook(() => useSkillTree())
    
    // Grip has no prerequisites
    expect(result.current.canAddPoint('grip')).toBe(true)
    
    // Slice requires grip: 1
    expect(result.current.canAddPoint('slice')).toBe(false)
    
    act(() => {
      result.current.addPoint('grip')
    })
    
    expect(result.current.canAddPoint('slice')).toBe(true)
  })

  it('should handle highlight paths', () => {
    const { result } = renderHook(() => useSkillTree())
    
    act(() => {
      result.current.toggleHighlightPath('basic')
    })
    
    expect(result.current.highlightPaths).toContain('basic')
    
    act(() => {
      result.current.toggleHighlightPath('basic')
    })
    
    expect(result.current.highlightPaths).not.toContain('basic')
  })

  it('should compute unlocked skills correctly', () => {
    const { result } = renderHook(() => useSkillTree())
    
    // Initially, only skills with no prerequisites should be unlocked
    expect(result.current.unlocked.grip).toBe(true)
    expect(result.current.unlocked.slice).toBe(false)
    expect(result.current.unlocked.dice).toBe(false)
    
    act(() => {
      result.current.addPoint('grip')
    })
    
    expect(result.current.unlocked.slice).toBe(true)
    expect(result.current.unlocked.dice).toBe(false)
  })

  it('should handle non-existent skill gracefully', () => {
    const { result } = renderHook(() => useSkillTree())
    
    expect(result.current.canAddPoint('nonexistent')).toBe(false)
    
    act(() => {
      result.current.addPoint('nonexistent')
    })
    
    // Should not crash or change any state
    expect(result.current.safePoints.grip).toBe(0)
  })
})