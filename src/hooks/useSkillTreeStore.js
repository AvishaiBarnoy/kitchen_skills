import { useMemo } from 'react';
import useSkillTreeStore from '../stores/skillTreeStore';

/**
 * Hook that provides a compatible interface with the original useSkillTree
 * but uses the new Zustand store for global state management.
 * This maintains backward compatibility while enabling global state.
 */
export default function useSkillTreeWithStore() {
  const store = useSkillTreeStore();
  
  // Compute derived values using useMemo for performance
  const skills = useMemo(() => store.getCurrentSkills(), [store.compactMode, store.currentTreeId]);
  const safePoints = useMemo(() => store.getSafePoints(), [skills, store.skillPoints, store.currentTreeId]);
  const unlocked = useMemo(() => store.getUnlockedSkills(), [safePoints, skills]);
  
  return {
    // State
    compactMode: store.compactMode,
    skills,
    safePoints,
    unlocked,
    highlightPaths: store.highlightPaths,
    
    // Actions - these maintain the same API as the original hook
    toggleCompactMode: store.toggleCompactMode,
    addPoint: store.addPoint,
    subtractPoint: store.subtractPoint,
    resetTree: store.resetTree,
    toggleHighlightPath: store.toggleHighlightPath,
    canAddPoint: store.canAddPoint,
    
    // Additional store methods for future use
    setCurrentTree: store.setCurrentTree,
    currentTreeId: store.currentTreeId,
  };
}