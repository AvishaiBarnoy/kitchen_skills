/** @jsxImportSource react */
import { useState, useEffect } from "react";
import { useSkillTreeStore } from "../store/skillTreeStore";
import { allPaths } from "../data/paths";
import { achievements } from "../data/achievements";
import SkillNode from "./skills/SkillNode";
import PathLegend from "./skills/PathLegend";
import { 
  AchievementButton, 
  AchievementNotification, 
  AchievementsModal 
} from "./achievements";

export default function SkillTree() {
  // Get state and actions from the Zustand store using selectors
  const compactMode = useSkillTreeStore((state) => state.compactMode);
  const highlightPaths = useSkillTreeStore((state) => state.highlightPaths);
  const unlockedAchievements = useSkillTreeStore((state) => state.unlockedAchievements);
  const newlyUnlocked = useSkillTreeStore((state) => state.newlyUnlocked);
  
  // Get computed values using selectors
  const skills = useSkillTreeStore((state) => state.getSkills());
  const safePoints = useSkillTreeStore((state) => state.getSafePoints());
  const unlocked = useSkillTreeStore((state) => state.getUnlocked());
  const stats = useSkillTreeStore((state) => state.getStats());
  
  // Get actions
  const toggleCompactMode = useSkillTreeStore((state) => state.toggleCompactMode);
  const addPoint = useSkillTreeStore((state) => state.addPoint);
  const subtractPoint = useSkillTreeStore((state) => state.subtractPoint);
  const resetTree = useSkillTreeStore((state) => state.resetTree);
  const toggleHighlightPath = useSkillTreeStore((state) => state.toggleHighlightPath);
  const clearNewlyUnlocked = useSkillTreeStore((state) => state.clearNewlyUnlocked);
  const getAchievementProgress = useSkillTreeStore((state) => state.getAchievementProgress);
  const initializeAchievements = useSkillTreeStore((state) => state.initializeAchievements);

  // Modal and notification state (kept local as UI-only state)
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  // Initialize achievements from localStorage on mount
  useEffect(() => {
    initializeAchievements();
  }, [initializeAchievements]);

  // Handle newly unlocked achievements
  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      // Show notification for the first newly unlocked achievement
      setCurrentNotification(newlyUnlocked[0]);
    }
  }, [newlyUnlocked]);

  // === EVENT HANDLERS ===
  const handleSkillClick = (skillId) => {
    addPoint(skillId);
  };

  const handleSkillRightClick = (e, skillId) => {
    e.preventDefault();
    subtractPoint(skillId);
  };

  const handleNotificationDismiss = () => {
    setCurrentNotification(null);
    clearNewlyUnlocked();
  };

  // === RENDER ===
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black text-gray-200 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-300 mb-2">
            🔪 Kitchen Skills Tracker
          </h1>
          <p className="text-slate-400">
            Master knife skills through structured learning
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <button
            onClick={toggleCompactMode}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            {compactMode ? "Full View" : "Compact View"}
          </button>
          
          <button
            onClick={resetTree}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Reset Tree
          </button>

          <AchievementButton 
            onClick={() => setShowAchievementsModal(true)}
            unlockedCount={unlockedAchievements.size}
            totalCount={achievements.length}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-300">
              {stats.totalPoints}
            </div>
            <div className="text-sm text-slate-400">Total Points</div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-300">
              {stats.skillsUnlocked}/{stats.totalSkills}
            </div>
            <div className="text-sm text-slate-400">Skills Unlocked</div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-300">
              {stats.completionPercentage}%
            </div>
            <div className="text-sm text-slate-400">Completion</div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-300">
              {unlockedAchievements.size}/{achievements.length}
            </div>
            <div className="text-sm text-slate-400">Achievements</div>
          </div>
        </div>

        {/* Path Legend */}
        <PathLegend
          paths={allPaths}
          highlightPaths={highlightPaths}
          onToggleHighlight={toggleHighlightPath}
        />

        {/* Skill Tree */}
        <div className="relative bg-slate-900 rounded-xl p-8 overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <SkillNode
                key={skill.id}
                skill={skill}
                currentPoints={safePoints[skill.id]}
                isUnlocked={unlocked[skill.id]}
                isHighlighted={highlightPaths.includes(skill.path)}
                onClick={() => handleSkillClick(skill.id)}
                onRightClick={(e) => handleSkillRightClick(e, skill.id)}
              />
            ))}
          </div>
        </div>

        {/* Achievement Notification */}
        {currentNotification && (
          <AchievementNotification
            achievement={currentNotification}
            onDismiss={handleNotificationDismiss}
          />
        )}

        {/* Achievements Modal */}
        {showAchievementsModal && (
          <AchievementsModal
            achievements={achievements}
            unlockedAchievements={unlockedAchievements}
            getProgress={getAchievementProgress}
            onClose={() => setShowAchievementsModal(false)}
          />
        )}
      </div>
    </div>
  );
}

