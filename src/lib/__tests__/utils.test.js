import { describe, it, expect } from 'vitest'
import { buildSkillLookup, isSkillFullyUnlocked, computeUnlocks } from '../utils'

describe('buildSkillLookup', () => {
  it('should create a lookup object from skills array', () => {
    const skills = [
      { id: 'grip', name: 'Grip', prereq: [] },
      { id: 'slice', name: 'Slice', prereq: [] },
    ]
    
    const lookup = buildSkillLookup(skills)
    
    expect(lookup).toEqual({
      grip: { id: 'grip', name: 'Grip', prereq: [] },
      slice: { id: 'slice', name: 'Slice', prereq: [] },
    })
  })
})

describe('isSkillFullyUnlocked', () => {
  const skills = [
    { id: 'grip', name: 'Grip', prereq: [] },
    { id: 'slice', name: 'Slice', prereq: [{ id: 'grip', points: 1 }] },
    { id: 'dice', name: 'Dice', prereq: [{ id: 'slice', points: 2 }] },
  ]
  const lookup = buildSkillLookup(skills)

  it('should return true for skills with no prerequisites', () => {
    const result = isSkillFullyUnlocked(skills[0], {}, lookup)
    expect(result).toBe(true)
  })

  it('should return true when all prerequisites are met', () => {
    const points = { grip: 1 }
    const result = isSkillFullyUnlocked(skills[1], points, lookup)
    expect(result).toBe(true)
  })

  it('should return false when prerequisites are not met', () => {
    const points = { grip: 0 }
    const result = isSkillFullyUnlocked(skills[1], points, lookup)
    expect(result).toBe(false)
  })

  it('should return false when prerequisite points are insufficient', () => {
    const points = { grip: 1, slice: 1 }
    const result = isSkillFullyUnlocked(skills[2], points, lookup)
    expect(result).toBe(false)
  })

  it('should return true when nested prerequisites are met', () => {
    const points = { grip: 1, slice: 2 }
    const result = isSkillFullyUnlocked(skills[2], points, lookup)
    expect(result).toBe(true)
  })

  it('should handle missing points gracefully', () => {
    const points = {}
    const result = isSkillFullyUnlocked(skills[1], points, lookup)
    expect(result).toBe(false)
  })
})

describe('computeUnlocks', () => {
  const skills = [
    { id: 'grip', name: 'Grip', prereq: [] },
    { id: 'slice', name: 'Slice', prereq: [{ id: 'grip', points: 1 }] },
    { id: 'dice', name: 'Dice', prereq: [{ id: 'slice', points: 2 }] },
    { id: 'mince', name: 'Mince', prereq: [{ id: 'dice', points: 1 }] },
  ]

  it('should return unlocked status for all skills', () => {
    const points = { grip: 1, slice: 2, dice: 1 }
    const result = computeUnlocks(skills, points)
    
    expect(result).toEqual({
      grip: true,
      slice: true,
      dice: true,
      mince: true,
    })
  })

  it('should return false for skills with unmet prerequisites', () => {
    const points = { grip: 1 }
    const result = computeUnlocks(skills, points)
    
    expect(result).toEqual({
      grip: true,
      slice: true,
      dice: false,
      mince: false,
    })
  })

  it('should handle empty points object', () => {
    const points = {}
    const result = computeUnlocks(skills, points)
    
    expect(result).toEqual({
      grip: true,
      slice: false,
      dice: false,
      mince: false,
    })
  })
})