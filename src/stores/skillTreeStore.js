import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSkillsForTree } from '../data/skillTrees';
import { computeUnlocks } from '../lib/utils';

const useSkillTreeStore = create(
  persist(
    (set, get) => ({
      // Current skill tree state
      currentTreeId: 'knife-skills',
      compactMode: false,
      highlightPaths: [],
      
      // Learning path state
      activeLearningPath: null,
      learningPathProgress: {},
      
      // Skill points for all trees (will support multiple trees in the future)
      skillPoints: {
        'knife-skills': {}
      },
      
      // UI state
      showAchievementsModal: false,
      currentNotification: null,
      notificationQueue: [],
      
      // Getters
      getCurrentSkills: () => {
        const state = get();
        return getSkillsForTree(state.currentTreeId, state.compactMode);
      },
      
      getCurrentPoints: () => {
        const state = get();
        return state.skillPoints[state.currentTreeId] || {};
      },
      
      getSafePoints: () => {
        const state = get();
        const skills = getSkillsForTree(state.currentTreeId, state.compactMode);
        const points = state.skillPoints[state.currentTreeId] || {};
        const result = {};
        for (const skill of skills) {
          result[skill.id] = points[skill.id] ?? 0;
        }
        return result;
      },
      
      getUnlockedSkills: () => {
        const state = get();
        const skills = getSkillsForTree(state.currentTreeId, state.compactMode);
        const points = state.skillPoints[state.currentTreeId] || {};
        const safePoints = {};
        for (const skill of skills) {
          safePoints[skill.id] = points[skill.id] ?? 0;
        }
        return computeUnlocks(skills, safePoints);
      },
      
      // Actions
      setCompactMode: (compactMode) => set({ compactMode }),
      
      toggleCompactMode: () => set((state) => ({ compactMode: !state.compactMode })),
      
      setHighlightPaths: (paths) => set({ highlightPaths: paths }),
      
      toggleHighlightPath: (path) => set((state) => ({
        highlightPaths: state.highlightPaths.includes(path)
          ? state.highlightPaths.filter(p => p !== path)
          : [...state.highlightPaths, path]
      })),
      
      canAddPoint: (skillId) => {
        const state = get();
        const skills = getSkillsForTree(state.currentTreeId, state.compactMode);
        const points = state.skillPoints[state.currentTreeId] || {};
        
        const skill = skills.find((s) => s.id === skillId);
        if (!skill) return false;

        const current = points[skillId] || 0;
        if (current >= skill.max) return false;

        const prereqs = skill.prereq || [];
        return prereqs.every(
          (req) => (points[req.id] || 0) >= req.points
        );
      },
      
      addPoint: (skillId) => set((state) => {
        const store = get();
        if (!store.canAddPoint(skillId)) return state;
        
        const skills = getSkillsForTree(state.currentTreeId, state.compactMode);
        
        const skill = skills.find((s) => s.id === skillId);
        const max = skill?.max ?? Infinity;
        
        const currentTreeId = state.currentTreeId;
        const currentPoints = state.skillPoints[currentTreeId] || {};
        const current = currentPoints[skillId] || 0;
        
        if (current >= max) return state;
        
        return {
          ...state,
          skillPoints: {
            ...state.skillPoints,
            [currentTreeId]: {
              ...currentPoints,
              [skillId]: current + 1
            }
          }
        };
      }),
      
      subtractPoint: (skillId) => set((state) => {
        const currentTreeId = state.currentTreeId;
        const currentPoints = state.skillPoints[currentTreeId] || {};
        const current = currentPoints[skillId] || 0;
        
        return {
          ...state,
          skillPoints: {
            ...state.skillPoints,
            [currentTreeId]: {
              ...currentPoints,
              [skillId]: Math.max(0, current - 1)
            }
          }
        };
      }),
      
      resetTree: () => set((state) => ({
        ...state,
        skillPoints: {
          ...state.skillPoints,
          [state.currentTreeId]: {}
        }
      })),
      
      // Achievement modal state
      setShowAchievementsModal: (show) => set({ showAchievementsModal: show }),
      
      // Notification state
      setCurrentNotification: (notification) => set({ currentNotification: notification }),
      
      setNotificationQueue: (queue) => set({ notificationQueue: queue }),
      
      addToNotificationQueue: (achievement) => set((state) => {
        const isAlreadyQueued = state.notificationQueue.find(item => item.id === achievement.id);
        if (isAlreadyQueued) return state;
        
        return {
          ...state,
          notificationQueue: [...state.notificationQueue, achievement]
        };
      }),
      
      removeFromNotificationQueue: () => set((state) => ({
        ...state,
        notificationQueue: state.notificationQueue.slice(1),
        currentNotification: null
      })),
      
      // Future: Switch between different skill trees
      setCurrentTree: (treeId) => set((state) => {
        // Initialize skill points for new tree if it doesn't exist
        const newSkillPoints = state.skillPoints[treeId] 
          ? state.skillPoints 
          : { ...state.skillPoints, [treeId]: {} };
          
        return {
          ...state,
          currentTreeId: treeId,
          skillPoints: newSkillPoints
        };
      }),
      
      // Learning path actions
      setActiveLearningPath: (pathId) => set({ activeLearningPath: pathId }),
      
      clearActiveLearningPath: () => set({ activeLearningPath: null }),
      
      getLearningPathProgress: (pathId) => {
        const { skillPoints } = get();
        // This will be calculated based on the learning path requirements
        return get().learningPathProgress[pathId] || { completed: 0, total: 0 };
      },
    }),
    {
      name: 'skill-tree-storage',
      // Only persist the skill points and user preferences, not UI state
      partialize: (state) => ({
        currentTreeId: state.currentTreeId,
        compactMode: state.compactMode,
        skillPoints: state.skillPoints,
      }),
    }
  )
);

export default useSkillTreeStore;