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

describe('useSkillTreeStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
    
    // Clear all stores
    useSkillTreeStore.getState().resetTree();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    expect(result.current.compactMode).toBe(false);
    expect(result.current.currentTreeId).toBe('knife-skills');
    expect(result.current.highlightPaths).toEqual([]);
    expect(result.current.getCurrentSkills().length).toBeGreaterThan(0);
  });

  it('should toggle compact mode', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    const initialLength = result.current.getCurrentSkills().length;
    
    act(() => {
      result.current.toggleCompactMode();
    });
    
    expect(result.current.compactMode).toBe(true);
    const compactLength = result.current.getCurrentSkills().length;
    expect(compactLength).toBeLessThan(initialLength);
  });

  it('should manage skill points correctly', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    // Get first skill that has no prerequisites
    const skills = result.current.getCurrentSkills();
    const skillWithNoPrereq = skills.find(skill => !skill.prereq || skill.prereq.length === 0);
    
    if (skillWithNoPrereq) {
      // Initially no points
      expect(result.current.getSafePoints()[skillWithNoPrereq.id]).toBe(0);
      
      // Add point
      act(() => {
        result.current.addPoint(skillWithNoPrereq.id);
      });
      
      expect(result.current.getSafePoints()[skillWithNoPrereq.id]).toBe(1);
    }
  });

  it('should respect prerequisites when adding points', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    const skills = result.current.getCurrentSkills();
    const skillWithPrereq = skills.find(skill => skill.prereq && skill.prereq.length > 0);
    
    if (skillWithPrereq) {
      // Should not be able to add point without prerequisites
      expect(result.current.canAddPoint(skillWithPrereq.id)).toBe(false);
      
      act(() => {
        result.current.addPoint(skillWithPrereq.id);
      });
      
      expect(result.current.getSafePoints()[skillWithPrereq.id]).toBe(0); // Should not add
      
      // Add prerequisite first
      const prereq = skillWithPrereq.prereq[0];
      act(() => {
        // Add enough points to meet prerequisite
        for (let i = 0; i < prereq.points; i++) {
          result.current.addPoint(prereq.id);
        }
      });
      
      expect(result.current.canAddPoint(skillWithPrereq.id)).toBe(true);
      
      act(() => {
        result.current.addPoint(skillWithPrereq.id);
      });
      
      expect(result.current.getSafePoints()[skillWithPrereq.id]).toBe(1);
    }
  });

  it('should respect max skill points', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    const skills = result.current.getCurrentSkills();
    const skillWithLowMax = skills.find(skill => skill.max && skill.max <= 2);
    
    if (skillWithLowMax) {
      // Add points up to max
      act(() => {
        for (let i = 0; i < skillWithLowMax.max + 1; i++) {
          result.current.addPoint(skillWithLowMax.id);
        }
      });
      
      expect(result.current.getSafePoints()[skillWithLowMax.id]).toBe(skillWithLowMax.max);
    }
  });

  it('should subtract points correctly', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    const skills = result.current.getCurrentSkills();
    const skillWithNoPrereq = skills.find(skill => !skill.prereq || skill.prereq.length === 0);
    
    if (skillWithNoPrereq) {
      // Add some points first
      act(() => {
        result.current.addPoint(skillWithNoPrereq.id);
        result.current.addPoint(skillWithNoPrereq.id);
      });
      
      expect(result.current.getSafePoints()[skillWithNoPrereq.id]).toBe(2);
      
      // Subtract point
      act(() => {
        result.current.subtractPoint(skillWithNoPrereq.id);
      });
      
      expect(result.current.getSafePoints()[skillWithNoPrereq.id]).toBe(1);
    }
  });

  it('should reset tree correctly', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    const skills = result.current.getCurrentSkills();
    const skillWithNoPrereq = skills.find(skill => !skill.prereq || skill.prereq.length === 0);
    
    if (skillWithNoPrereq) {
      // Add some points
      act(() => {
        result.current.addPoint(skillWithNoPrereq.id);
      });
      
      expect(result.current.getSafePoints()[skillWithNoPrereq.id]).toBe(1);
      
      // Reset
      act(() => {
        result.current.resetTree();
      });
      
      expect(result.current.getSafePoints()[skillWithNoPrereq.id]).toBe(0);
    }
  });

  it('should manage highlight paths', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    act(() => {
      result.current.setHighlightPaths(['meta', 'basic']);
    });
    
    expect(result.current.highlightPaths).toEqual(['meta', 'basic']);
    
    act(() => {
      result.current.toggleHighlightPath('vegetable');
    });
    
    expect(result.current.highlightPaths).toEqual(['meta', 'basic', 'vegetable']);
    
    act(() => {
      result.current.toggleHighlightPath('meta');
    });
    
    expect(result.current.highlightPaths).toEqual(['basic', 'vegetable']);
  });

  it('should compute unlocked skills correctly', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    const skills = result.current.getCurrentSkills();
    const skillWithNoPrereq = skills.find(skill => !skill.prereq || skill.prereq.length === 0);
    const skillWithPrereq = skills.find(skill => skill.prereq && skill.prereq.length > 0);
    
    if (skillWithNoPrereq && skillWithPrereq) {
      const unlocked = result.current.getUnlockedSkills();
      
      // Skills with no prerequisites should be unlocked
      expect(unlocked[skillWithNoPrereq.id]).toBe(true);
      
      // Skills with prerequisites should be locked initially
      expect(unlocked[skillWithPrereq.id]).toBe(false);
      
      // Add prerequisite points
      const prereq = skillWithPrereq.prereq[0];
      act(() => {
        for (let i = 0; i < prereq.points; i++) {
          result.current.addPoint(prereq.id);
        }
      });
      
      const newUnlocked = result.current.getUnlockedSkills();
      expect(newUnlocked[skillWithPrereq.id]).toBe(true);
    }
  });

  it('should support multiple skill trees', () => {
    const { result } = renderHook(() => useSkillTreeStore());
    
    expect(result.current.currentTreeId).toBe('knife-skills');
    
    act(() => {
      result.current.setCurrentTree('baking');
    });
    
    expect(result.current.currentTreeId).toBe('baking');
    expect(result.current.getCurrentSkills().length).toBeGreaterThan(0);
  });
});