import { useState, useEffect, useMemo } from 'react';
import { achievements, achievementTypes } from '../data/achievements';
import { skillTrees, getSkillsForTree } from '../data/skillTrees';

const STORAGE_KEY = 'knife-skill-achievements';

// Helper function to load achievements from localStorage synchronously
const loadStoredAchievements = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Set(parsed);
    }
  } catch (error) {
    console.error('Failed to parse stored achievements:', error);
  }
  return new Set();
};

export default function useAchievements(allSkillPoints, currentTreeSkills) {
  // Get all skills from all trees for accurate achievement calculation
  const getAllSkills = () => {
    const allSkills = [];
    Object.keys(skillTrees).forEach(treeId => {
      const treeSkills = getSkillsForTree(treeId, false); // Always use full data for achievements
      allSkills.push(...treeSkills);
    });
    return allSkills;
  };

  const allSkills = useMemo(() => getAllSkills(), []);
  
  // Calculate total skill points across ALL trees
  const totalPoints = useMemo(() => {
    let total = 0;
    Object.values(allSkillPoints).forEach(treePoints => {
      Object.values(treePoints).forEach(points => {
        total += points;
      });
    });
    return total;
  }, [allSkillPoints]);
  // ✅ SOLUTION: Initialize with localStorage data immediately (synchronous)
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => loadStoredAchievements());
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);

  // Helper function to get skill points for a specific skill across all trees
  const getSkillPoints = (skillId) => {
    for (const treeId of Object.keys(allSkillPoints)) {
      const treePoints = allSkillPoints[treeId] || {};
      if (treePoints[skillId] !== undefined) {
        return treePoints[skillId];
      }
    }
    return 0;
  };

  // Check if a single achievement condition is met
  const checkAchievementCondition = (achievement) => {
    switch (achievement.type) {
      case achievementTypes.FIRST_STEPS:
      case achievementTypes.TOTAL_POINTS:
        return totalPoints >= achievement.condition.totalPoints;

      case achievementTypes.SKILL_MASTERY:
        return getSkillPoints(achievement.condition.skillId) >= achievement.condition.points;

      case achievementTypes.PATH_COMPLETION:
        // Check if all skills in a path are maxed out across ALL trees
        const pathSkills = allSkills.filter(skill => skill.path === achievement.condition.path);
        
        // Prevent false positives: if no skills exist for this path, return false
        if (pathSkills.length === 0) {
          return false;
        }
        
        return pathSkills.every(skill => 
          getSkillPoints(skill.id) >= skill.max
        );

      case achievementTypes.SKILL_COMBINATION:
        // Check if all required skills meet their point thresholds
        return achievement.condition.skills.every(requirement => 
          getSkillPoints(requirement.skillId) >= requirement.points
        );

      default:
        return false;
    }
  };

  // Check for newly unlocked achievements
  useEffect(() => {
    const currentlyUnlocked = new Set();
    const newUnlocks = [];

    achievements.forEach(achievement => {
      const isUnlocked = checkAchievementCondition(achievement);
      
      if (isUnlocked) {
        currentlyUnlocked.add(achievement.id);
        
        // If this is newly unlocked, add to newUnlocks
        if (!unlockedAchievements.has(achievement.id)) {
          newUnlocks.push(achievement);
        }
      }
    });

    // Update unlocked achievements if there are changes
    if (currentlyUnlocked.size !== unlockedAchievements.size || 
        [...currentlyUnlocked].some(id => !unlockedAchievements.has(id))) {
      setUnlockedAchievements(currentlyUnlocked);
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...currentlyUnlocked]));
    }

    // Set newly unlocked achievements
    if (newUnlocks.length > 0) {
      setNewlyUnlocked(newUnlocks);
    }
  }, [allSkillPoints, totalPoints, allSkills, unlockedAchievements]);

  // Clear newly unlocked achievements (called after showing notification)
  const clearNewlyUnlocked = () => {
    setNewlyUnlocked([]);
  };

  // Get achievement progress for achievements that aren't unlocked yet
  const getAchievementProgress = (achievement) => {
    if (unlockedAchievements.has(achievement.id)) {
      return { progress: 100, isComplete: true };
    }

    switch (achievement.type) {
      case achievementTypes.FIRST_STEPS:
      case achievementTypes.TOTAL_POINTS:
        const progress = Math.min((totalPoints / achievement.condition.totalPoints) * 100, 100);
        return { 
          progress: Math.round(progress), 
          current: totalPoints, 
          target: achievement.condition.totalPoints,
          isComplete: false
        };

      case achievementTypes.SKILL_MASTERY:
        const currentPoints = getSkillPoints(achievement.condition.skillId);
        const targetPoints = achievement.condition.points;
        return { 
          progress: Math.round((currentPoints / targetPoints) * 100), 
          current: currentPoints, 
          target: targetPoints,
          isComplete: false
        };

      case achievementTypes.PATH_COMPLETION:
        const pathSkills = allSkills.filter(skill => skill.path === achievement.condition.path);
        if (pathSkills.length === 0) {
          return { progress: 0, current: 0, target: 1, isComplete: false };
        }
        const maxedSkills = pathSkills.filter(skill => 
          getSkillPoints(skill.id) >= skill.max
        ).length;
        return { 
          progress: Math.round((maxedSkills / pathSkills.length) * 100), 
          current: maxedSkills, 
          target: pathSkills.length,
          isComplete: false
        };

      case achievementTypes.SKILL_COMBINATION:
        const completedRequirements = achievement.condition.skills.filter(requirement => 
          getSkillPoints(requirement.skillId) >= requirement.points
        ).length;
        return { 
          progress: Math.round((completedRequirements / achievement.condition.skills.length) * 100), 
          current: completedRequirements, 
          target: achievement.condition.skills.length,
          isComplete: false
        };

      default:
        return { progress: 0, isComplete: false };
    }
  };

  // Get achievements by rarity
  const achievementsByRarity = useMemo(() => {
    const grouped = { common: [], rare: [], epic: [], legendary: [] };
    achievements.forEach(achievement => {
      grouped[achievement.rarity].push(achievement);
    });
    return grouped;
  }, []);

  // Get achievement statistics
  const stats = useMemo(() => {
    const total = achievements.length;
    const unlocked = unlockedAchievements.size;
    const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;
    
    return {
      total,
      unlocked,
      percentage,
      remaining: total - unlocked
    };
  }, [unlockedAchievements]);

  return {
    unlockedAchievements,
    newlyUnlocked,
    clearNewlyUnlocked,
    getAchievementProgress,
    achievementsByRarity,
    stats,
    totalPoints
  };
}