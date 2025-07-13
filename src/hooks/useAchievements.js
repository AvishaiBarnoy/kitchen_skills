import { useState, useEffect, useMemo } from 'react';
import { achievements, achievementTypes } from '../data/achievements';

const STORAGE_KEY = 'knife-skill-achievements';

export default function useAchievements(skillPoints, skills) {
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set());
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);

  // Load achievements from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUnlockedAchievements(new Set(parsed));
      } catch (error) {
        console.error('Failed to parse stored achievements:', error);
      }
    }
  }, []);

  // Calculate total skill points
  const totalPoints = useMemo(() => {
    return Object.values(skillPoints).reduce((sum, points) => sum + points, 0);
  }, [skillPoints]);

  // Check if a single achievement condition is met
  const checkAchievementCondition = (achievement) => {
    switch (achievement.type) {
      case achievementTypes.FIRST_STEPS:
      case achievementTypes.TOTAL_POINTS:
        return totalPoints >= achievement.condition.totalPoints;

      case achievementTypes.SKILL_MASTERY:
        return (skillPoints[achievement.condition.skillId] || 0) >= achievement.condition.points;

      case achievementTypes.PATH_COMPLETION:
        // Check if all skills in a path are maxed out
        const pathSkills = skills.filter(skill => skill.path === achievement.condition.path);
        return pathSkills.every(skill => 
          (skillPoints[skill.id] || 0) >= skill.max
        );

      case achievementTypes.SKILL_COMBINATION:
        // Check if all required skills meet their point thresholds
        return achievement.condition.skills.every(requirement => 
          (skillPoints[requirement.skillId] || 0) >= requirement.points
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
  }, [skillPoints, totalPoints, skills, unlockedAchievements]);

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
        const currentPoints = skillPoints[achievement.condition.skillId] || 0;
        const targetPoints = achievement.condition.points;
        return { 
          progress: Math.round((currentPoints / targetPoints) * 100), 
          current: currentPoints, 
          target: targetPoints,
          isComplete: false
        };

      case achievementTypes.PATH_COMPLETION:
        const pathSkills = skills.filter(skill => skill.path === achievement.condition.path);
        const maxedSkills = pathSkills.filter(skill => 
          (skillPoints[skill.id] || 0) >= skill.max
        ).length;
        return { 
          progress: Math.round((maxedSkills / pathSkills.length) * 100), 
          current: maxedSkills, 
          target: pathSkills.length,
          isComplete: false
        };

      case achievementTypes.SKILL_COMBINATION:
        const completedRequirements = achievement.condition.skills.filter(requirement => 
          (skillPoints[requirement.skillId] || 0) >= requirement.points
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