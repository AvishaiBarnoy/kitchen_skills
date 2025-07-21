/** @jsxImportSource react */
import { useMemo, useState, useEffect } from "react";
import useSkillTreeWithStore from "../hooks/useSkillTreeStore";
import useAchievements from "../hooks/useAchievements";
import useSkillTreeStore from "../stores/skillTreeStore";
import useAchievementStore from "../stores/achievementStore";
import { pathColors } from "../data/paths";
import { getTreeInfo } from "../data/skillTrees";
import { achievements } from "../data/achievements";
import SkillNode from "./skills/SkillNode";
import PathLegend from "./skills/PathLegend";
import TreeSelector from "./layout/TreeSelector";
import { 
  AchievementButton, 
  AchievementNotification, 
  AchievementsModal 
} from "./achievements";

export default function SkillTree() {
  const {
    compactMode,
    toggleCompactMode,
    skills,
    safePoints,
    unlocked,
    addPoint,
    subtractPoint,
    resetTree,
    highlightPaths,
    toggleHighlightPath,
    currentTreeId,
  } = useSkillTreeWithStore();

  // Achievement system (still using the hook for logic, but store for state)
  const {
    unlockedAchievements,
    newlyUnlocked,
    clearNewlyUnlocked,
    getAchievementProgress,
    stats,
  } = useAchievements(safePoints, skills);

  // Modal and notification state from store
  const {
    showAchievementsModal,
    setShowAchievementsModal,
    currentNotification,
    setCurrentNotification,
    notificationQueue,
    setNotificationQueue,
    addToNotificationQueue,
    removeFromNotificationQueue,
  } = useAchievementStore();

  // Handle newly unlocked achievements
  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      // Add new achievements to the queue using store method
      newlyUnlocked.forEach(achievement => {
        addToNotificationQueue(achievement);
      });
      
      // Clear the newly unlocked from the hook
      clearNewlyUnlocked();
    }
  }, [newlyUnlocked, clearNewlyUnlocked, addToNotificationQueue]);

  // Show notifications from the queue
  useEffect(() => {
    if (notificationQueue.length > 0 && !currentNotification) {
      setCurrentNotification(notificationQueue[0]);
    }
  }, [notificationQueue, currentNotification, setCurrentNotification]);

  const handleNotificationDismiss = () => {
    // Remove from queue and clear current using store method
    removeFromNotificationQueue();
    
    // Show next notification after a brief delay if there are more
    if (notificationQueue.length > 1) {
      setTimeout(() => {
        setCurrentNotification(notificationQueue[1]);
      }, 500);
    }
  };

  return (
    <div className="p-6">
      {/* Tree Selector */}
      <TreeSelector />
      
      <div className="mb-4 flex flex-wrap items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-200">Cooking Skills</h1>
        <div className="flex gap-2">
          <AchievementButton
            stats={stats}
            onClick={() => setShowAchievementsModal(true)}
            hasNewAchievements={notificationQueue.length > 0}
          />
          <button
            onClick={toggleCompactMode}
            className="px-2 py-1 text-sm rounded bg-slate-700 text-white hover:bg-slate-600"
          >
            {compactMode ? "Switch to Full View" : "Switch to Compact View"}
          </button>
          <button
            onClick={resetTree}
            className="px-2 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
          >
            Reset
          </button>
        </div>
      </div>

      <PathLegend
        allPaths={getTreeInfo(currentTreeId)?.paths || []}
        highlightPaths={highlightPaths}
        toggleHighlightPath={toggleHighlightPath}
      />

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}
      >
        {skills.map((skill) => {
          if (!skill) return null;
          const isUnlocked = unlocked[skill.id];
          const isDimmed =
            highlightPaths.length > 0 && !highlightPaths.includes(skill.path);

          return (
            <SkillNode
              key={skill.id}
              skill={skill}
              points={safePoints[skill.id] || 0}
              isUnlocked={isUnlocked}
              isDimmed={isDimmed}
              addPoint={addPoint}
              subtractPoint={subtractPoint}
            />
          );
        })}
      </div>

      {/* Achievement Modal */}
      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        achievements={achievements}
        unlockedAchievements={unlockedAchievements}
        getAchievementProgress={getAchievementProgress}
        stats={stats}
      />

      {/* Achievement Notifications */}
      {currentNotification && (
        <AchievementNotification
          achievement={currentNotification}
          onDismiss={handleNotificationDismiss}
        />
      )}
    </div>
  );
}

