import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { fullSkillsData, compactSkillData } from '../data/skills';
import { achievements, achievementTypes } from '../data/achievements';
import { computeUnlocks } from '../lib/utils';

const STORAGE_KEY = 'knife-skill-achievements';

export const useSkillTreeStore = create(
  subscribeWithSelector((set, get) => ({
    // === SKILL TREE STATE ===
    compactMode: false,
    points: {},
    highlightPaths: [],

    // === ACHIEVEMENTS STATE ===
    unlockedAchievements: new Set(),
    newlyUnlocked: [],

    // === COMPUTED VALUES (as functions) ===
    getSkills: () => {
      const { compactMode } = get();
      return compactMode ? compactSkillData : fullSkillsData;
    },

    getSafePoints: () => {
      const { points } = get();
      const skills = get().getSkills();
      const result = {};
      for (const skill of skills) {
        result[skill.id] = points[skill.id] ?? 0;
      }
      return result;
    },

    getUnlocked: () => {
      const { points } = get();
      const skills = get().getSkills();
      return computeUnlocks(skills, points);
    },

    getTotalPoints: () => {
      const safePoints = get().getSafePoints();
      return Object.values(safePoints).reduce((sum, points) => sum + points, 0);
    },

    getStats: () => {
      const safePoints = get().getSafePoints();
      const skills = get().getSkills();
      const totalPoints = Object.values(safePoints).reduce((sum, points) => sum + points, 0);
      const skillsUnlocked = skills.filter(skill => safePoints[skill.id] > 0).length;
      const totalSkills = skills.length;
      
      // Calculate path completion
      const pathProgress = {};
      const paths = [...new Set(skills.map(skill => skill.path))];
      
      for (const path of paths) {
        const pathSkills = skills.filter(skill => skill.path === path);
        const completedSkills = pathSkills.filter(skill => 
          safePoints[skill.id] >= skill.max
        ).length;
        pathProgress[path] = {
          completed: completedSkills,
          total: pathSkills.length,
          percentage: Math.round((completedSkills / pathSkills.length) * 100)
        };
      }

      return {
        totalPoints,
        skillsUnlocked,
        totalSkills,
        pathProgress,
        completionPercentage: Math.round((skillsUnlocked / totalSkills) * 100)
      };
    },

    // === SKILL TREE ACTIONS ===
    canAddPoint: (id) => {
      const { points } = get();
      const skills = get().getSkills();
      const skill = skills.find((s) => s.id === id);
      if (!skill) return false;

      const current = points[id] || 0;
      if (current >= skill.max) return false;

      const prereqs = skill.prereq || [];
      return prereqs.every(
        (req) => (points[req.id] || 0) >= req.points
      );
    },

    addPoint: (id) => {
      const { points } = get();
      const skills = get().getSkills();
      const skill = skills.find((s) => s.id === id);
      const max = skill?.max ?? Infinity;

      // Check if we can add point
      const current = points[id] || 0;
      if (current >= max) return;

      const prereqs = skill.prereq || [];
      const canAdd = prereqs.every(
        (req) => (points[req.id] || 0) >= req.points
      );

      if (!canAdd) return;

      set((state) => ({
        ...state,
        points: {
          ...state.points,
          [id]: current + 1,
        },
      }));
    },

    subtractPoint: (id) => {
      set((state) => ({
        ...state,
        points: {
          ...state.points,
          [id]: Math.max(0, (state.points[id] || 0) - 1),
        },
      }));
    },

    resetTree: () => {
      set((state) => ({
        ...state,
        points: {},
      }));
    },

    toggleCompactMode: () => {
      set((state) => ({
        ...state,
        compactMode: !state.compactMode,
      }));
    },

    toggleHighlightPath: (path) => {
      set((state) => ({
        ...state,
        highlightPaths: state.highlightPaths.includes(path)
          ? state.highlightPaths.filter((p) => p !== path)
          : [...state.highlightPaths, path],
      }));
    },

    // === ACHIEVEMENTS ACTIONS ===
    initializeAchievements: () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          set((state) => ({
            ...state,
            unlockedAchievements: new Set(parsed),
          }));
        } catch (error) {
          console.error('Failed to parse stored achievements:', error);
        }
      }
    },

    checkAchievementCondition: (achievement) => {
      const safePoints = get().getSafePoints();
      const skills = get().getSkills();
      const totalPoints = get().getTotalPoints();
      
      switch (achievement.type) {
        case achievementTypes.FIRST_STEPS:
        case achievementTypes.TOTAL_POINTS:
          return totalPoints >= achievement.condition.totalPoints;

        case achievementTypes.SKILL_MASTERY:
          return (safePoints[achievement.condition.skillId] || 0) >= achievement.condition.points;

        case achievementTypes.PATH_COMPLETION:
          const pathSkills = skills.filter(skill => skill.path === achievement.condition.path);
          return pathSkills.every(skill => 
            (safePoints[skill.id] || 0) >= skill.max
          );

        case achievementTypes.SKILL_COMBINATION:
          return achievement.condition.skills.every(requirement => 
            (safePoints[requirement.skillId] || 0) >= requirement.points
          );

        case achievementTypes.MILESTONE:
          return totalPoints >= achievement.condition.totalPoints;

        default:
          return false;
      }
    },

    checkForNewAchievements: () => {
      const { unlockedAchievements } = get();
      const newUnlocked = [];

      for (const achievement of achievements) {
        if (!unlockedAchievements.has(achievement.id) && get().checkAchievementCondition(achievement)) {
          newUnlocked.push(achievement);
        }
      }

      if (newUnlocked.length > 0) {
        set((state) => {
          const newUnlockedSet = new Set([...state.unlockedAchievements, ...newUnlocked.map(a => a.id)]);
          
          // Save to localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify([...newUnlockedSet]));
          
          return {
            ...state,
            unlockedAchievements: newUnlockedSet,
            newlyUnlocked: [...state.newlyUnlocked, ...newUnlocked],
          };
        });
      }

      return newUnlocked;
    },

    clearNewlyUnlocked: () => {
      set((state) => ({
        ...state,
        newlyUnlocked: [],
      }));
    },

    getAchievementProgress: (achievement) => {
      const safePoints = get().getSafePoints();
      const skills = get().getSkills();
      const totalPoints = get().getTotalPoints();
      
      switch (achievement.type) {
        case achievementTypes.FIRST_STEPS:
        case achievementTypes.TOTAL_POINTS:
        case achievementTypes.MILESTONE:
          return {
            current: totalPoints,
            target: achievement.condition.totalPoints,
            percentage: Math.min(100, Math.round((totalPoints / achievement.condition.totalPoints) * 100))
          };

        case achievementTypes.SKILL_MASTERY:
          const current = safePoints[achievement.condition.skillId] || 0;
          const target = achievement.condition.points;
          return {
            current,
            target,
            percentage: Math.min(100, Math.round((current / target) * 100))
          };

        case achievementTypes.PATH_COMPLETION:
          const pathSkills = skills.filter(skill => skill.path === achievement.condition.path);
          const completedSkills = pathSkills.filter(skill => 
            (safePoints[skill.id] || 0) >= skill.max
          ).length;
          return {
            current: completedSkills,
            target: pathSkills.length,
            percentage: Math.min(100, Math.round((completedSkills / pathSkills.length) * 100))
          };

        case achievementTypes.SKILL_COMBINATION:
          const completedRequirements = achievement.condition.skills.filter(requirement => 
            (safePoints[requirement.skillId] || 0) >= requirement.points
          ).length;
          return {
            current: completedRequirements,
            target: achievement.condition.skills.length,
            percentage: Math.min(100, Math.round((completedRequirements / achievement.condition.skills.length) * 100))
          };

        default:
          return { current: 0, target: 1, percentage: 0 };
      }
    },
  }))
);

// Subscribe to points changes to check for new achievements
useSkillTreeStore.subscribe(
  (state) => state.points,
  () => {
    const store = useSkillTreeStore.getState();
    store.checkForNewAchievements();
  }
);