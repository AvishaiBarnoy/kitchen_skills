import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useSkillTreeStore from '../skillTreeStore';

// Mock localStorage
const mockStorage = {};
const mockLocalStorage = {
  getItem: vi.fn((key) => mockStorage[key] || null),
  setItem: vi.fn((key, value) => { mockStorage[key] = value }),
  removeItem: vi.fn((key) => { delete mockStorage[key] }),
  clear: vi.fn(() => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]) }),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

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
}));

describe('useSkillTreeStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
    
    // Reset the store to initial state
    const { result } = renderHook(() => useSkillTreeStore());
    act(() => {
      result.current.resetTree();
      result.current.setCompactMode(false);
      result.current.setHighlightPaths([]);
    });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    expect(result.current.compactMode).toBe(false);
    expect(result.current.currentTreeId).toBe('knife-skills');
    expect(result.current.highlightPaths).toEqual([]);
    expect(result.current.getCurrentSkills()).toHaveLength(3); // fullSkillsData
  });

  it('should toggle compact mode', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    act(() => {
      result.current.toggleCompactMode();
    });
    
    expect(result.current.compactMode).toBe(true);
    expect(result.current.getCurrentSkills()).toHaveLength(2); // compactSkillData
  });

  it('should manage skill points correctly', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    // Initially no points
    expect(result.current.getSafePoints().grip).toBe(0);
    
    // Add point to grip (no prerequisites)
    act(() => {
      result.current.addPoint('grip');
    });
    
    expect(result.current.getSafePoints().grip).toBe(1);
  });

  it('should respect prerequisites when adding points', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    // Try to add point to slice without grip prerequisite
    expect(result.current.canAddPoint('slice')).toBe(false);
    
    act(() => {
      result.current.addPoint('slice');
    });
    
    expect(result.current.getSafePoints().slice).toBe(0); // Should not add
    
    // Add prerequisite first
    act(() => {
      result.current.addPoint('grip');
    });
    
    expect(result.current.canAddPoint('slice')).toBe(true);
    
    act(() => {
      result.current.addPoint('slice');
    });
    
    expect(result.current.getSafePoints().slice).toBe(1);
  });

  it('should respect max skill points', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    // Add maximum points to grip (max: 3)
    act(() => {
      result.current.addPoint('grip');
      result.current.addPoint('grip');
      result.current.addPoint('grip');
    });
    
    expect(result.current.getSafePoints().grip).toBe(3);
    expect(result.current.canAddPoint('grip')).toBe(false);
    
    // Try to add more
    act(() => {
      result.current.addPoint('grip');
    });
    
    expect(result.current.getSafePoints().grip).toBe(3); // Should stay at max
  });

  it('should subtract points correctly', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    // Add some points
    act(() => {
      result.current.addPoint('grip');
      result.current.addPoint('grip');
    });
    
    expect(result.current.getSafePoints().grip).toBe(2);
    
    // Subtract one
    act(() => {
      result.current.subtractPoint('grip');
    });
    
    expect(result.current.getSafePoints().grip).toBe(1);
    
    // Can't go below 0
    act(() => {
      result.current.subtractPoint('grip');
      result.current.subtractPoint('grip');
    });
    
    expect(result.current.getSafePoints().grip).toBe(0);
  });

  it('should reset tree correctly', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    // Add some points
    act(() => {
      result.current.addPoint('grip');
      result.current.addPoint('grip');
    });
    
    expect(result.current.getSafePoints().grip).toBe(2);
    
    // Reset
    act(() => {
      result.current.resetTree();
    });
    
    expect(result.current.getSafePoints().grip).toBe(0);
  });

  it('should manage highlight paths', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    expect(result.current.highlightPaths).toEqual([]);
    
    // Toggle path on
    act(() => {
      result.current.toggleHighlightPath('meta');
    });
    
    expect(result.current.highlightPaths).toEqual(['meta']);
    
    // Add another path
    act(() => {
      result.current.toggleHighlightPath('basic');
    });
    
    expect(result.current.highlightPaths).toEqual(['meta', 'basic']);
    
    // Toggle first path off
    act(() => {
      result.current.toggleHighlightPath('meta');
    });
    
    expect(result.current.highlightPaths).toEqual(['basic']);
  });

  it('should compute unlocked skills correctly', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    const unlocked = result.current.getUnlockedSkills();
    
    // Grip should be unlocked (no prerequisites)
    expect(unlocked.grip).toBe(true);
    
    // Slice should be locked (needs grip)
    expect(unlocked.slice).toBe(false);
    
    // Add grip point
    act(() => {
      result.current.addPoint('grip');
    });
    
    const newUnlocked = result.current.getUnlockedSkills();
    
    // Now slice should be unlocked
    expect(newUnlocked.slice).toBe(true);
    
    // Dice should still be locked (needs 2 slice points)
    expect(newUnlocked.dice).toBe(false);
  });

  it('should support multiple skill trees', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    // Add points to knife skills
    act(() => {
      result.current.addPoint('grip');
    });
    
    expect(result.current.getSafePoints().grip).toBe(1);
    
    // Switch to a different tree
    act(() => {
      result.current.setCurrentTree('baking-skills');
    });
    
    expect(result.current.currentTreeId).toBe('baking-skills');
    
    // Points should be preserved but in different tree context
    // (grip would be 0 in new tree since it's tree-specific)
    const newTreePoints = result.current.getCurrentPoints();
    expect(newTreePoints.grip).toBeUndefined();
    
    // Switch back to knife skills
    act(() => {
      result.current.setCurrentTree('knife-skills');
    });
    
    // Original points should be restored
    expect(result.current.getSafePoints().grip).toBe(1);
  });
});