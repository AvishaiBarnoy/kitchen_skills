/** @jsxImportSource react */
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Network, Eye, EyeOff, X, BookOpen, Target } from "lucide-react";
import useSkillTreeWithStore from "@/hooks/useSkillTreeStore";
import useAchievements from "@/hooks/useAchievements";
import useSkillTreeStore from "@/stores/skillTreeStore";
import useAchievementStore from "@/stores/achievementStore";
import { pathColors } from "@/data/paths";
import { getTreeInfo } from "@/data/skillTrees";
import { achievements } from "@/data/achievements";
import SkillNode from "./skills/SkillNode";
import ReactFlowSkillGraph from "./skills/ReactFlowSkillGraph";
import PathLegend from "./skills/PathLegend";
import TreeSelector from "./layout/TreeSelector";
import { 
  AchievementButton, 
  AchievementNotification, 
  AchievementsModal 
} from "./achievements";

export default function SkillTree() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'flow'
  const [isResponsiveMode, setIsResponsiveMode] = useState(false);



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

  // Fallback to direct data access if store returns empty (ensures skills always display)
  const fallbackSkills = useMemo(() => {
    const treeInfo = getTreeInfo(currentTreeId);
    if (!treeInfo) return [];
    return compactMode ? (treeInfo.compactData || []) : (treeInfo.fullData || []);
  }, [currentTreeId, compactMode]);
  
  const effectiveSkills = (skills && skills.length > 0) ? skills : fallbackSkills;
  const effectiveSafePoints = safePoints || {};
  const effectiveUnlocked = unlocked || {};



  // Achievement system (still using the hook for logic, but store for state)
  const { skillPoints, activeLearningPath, clearActiveLearningPath } = useSkillTreeStore(); // Get all skill points across all trees
  const {
    unlockedAchievements,
    newlyUnlocked,
    clearNewlyUnlocked,
    getAchievementProgress,
    stats,
  } = useAchievements(skillPoints, skills);

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

  // Check screen size for responsive mode
  useEffect(() => {
    const checkScreenSize = () => {
      setIsResponsiveMode(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // Learning path data (same as in LearningPaths.jsx)
  const learningPaths = {
    beginner: {
      name: 'Beginner Cook',
      skills: [
        { treeId: 'knife-skills', skillIds: ['grip', 'knifeTypes', 'basic'], label: 'Basic knife handling' },
        { treeId: 'knife-skills', skillIds: ['rockChop', 'julienne'], label: 'Simple cutting techniques' },
        { treeId: 'knife-skills', skillIds: ['safety'], label: 'Kitchen safety' }
      ]
    },
    vegetarian: {
      name: 'Vegetarian Prep Master',
      skills: [
        { treeId: 'knife-skills', skillIds: ['julienne', 'brunoise', 'chiffonade'], label: 'Precision cuts' },
        { treeId: 'knife-skills', skillIds: ['tournee', 'carving'], label: 'Advanced vegetable prep' }
      ]
    },
    protein: {
      name: 'Protein Mastery',
      skills: [
        { treeId: 'knife-skills', skillIds: ['boning', 'filleting', 'carving'], label: 'Protein breakdown' },
        { treeId: 'knife-skills', skillIds: ['speed'], label: 'Efficiency techniques' }
      ]
    },
    baking: {
      name: 'Baking Fundamentals',
      skills: [
        { treeId: 'baking', skillIds: ['measuring', 'mixing'], label: 'Baking basics' },
        { treeId: 'baking', skillIds: ['yeastDough', 'lamination'], label: 'Dough techniques' }
      ]
    },
    sauces: {
      name: 'Sauce Master',
      skills: [
        { treeId: 'sauces', skillIds: ['bechamel', 'veloute', 'hollandaise'], label: 'Mother sauces' },
        { treeId: 'sauces', skillIds: ['emulsification', 'reduction'], label: 'Advanced techniques' }
      ]
    },
    pastry: {
      name: 'Pastry Arts',
      skills: [
        { treeId: 'knife-skills', skillIds: ['pastry'], label: 'Pastry knife skills' },
        { treeId: 'baking', skillIds: ['decoration', 'pastryDough'], label: 'Decorative techniques' }
      ]
    }
  };

  // Get highlighted skills for current learning path
  const getHighlightedSkills = () => {
    if (!activeLearningPath || !learningPaths[activeLearningPath]) return [];
    
    const pathData = learningPaths[activeLearningPath];
    const highlightedSkills = [];
    
    pathData.skills.forEach(skillGroup => {
      if (skillGroup.treeId === currentTreeId) {
        highlightedSkills.push(...skillGroup.skillIds);
      }
    });
    
    return highlightedSkills;
  };

  const highlightedSkills = getHighlightedSkills();

  // Enhanced canAddPoint function with prerequisites checking
  const canAddPoint = (skillId) => {
    const skill = skills.find(s => s && s.id === skillId);
    if (!skill || !unlocked[skillId]) return false;
    
    // Check if already maxed
    if ((safePoints[skillId] || 0) >= skill.max) return false;
    
    // Check prerequisites
    if (skill.prereq && skill.prereq.length > 0) {
      return skill.prereq.every(prereq => {
        const prereqPoints = safePoints[prereq.id] || 0;
        return prereqPoints >= prereq.points;
      });
    }
    
    return true;
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Tree Selector */}
      <TreeSelector />
      
      {/* Header with Controls */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-amber-200">
          Cooking Skills
        </h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <AchievementButton
            stats={stats}
            onClick={() => setShowAchievementsModal(true)}
            hasNewAchievements={notificationQueue.length > 0}
          />
          
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('flow')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'flow'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title="Flow Chart View"
            >
              <Network size={18} />
            </button>
          </div>

          {/* Responsive mode toggle (only show in grid view) */}
          {viewMode === 'grid' && (
            <button
              onClick={toggleCompactMode}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
            >
              {compactMode ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="hidden sm:inline">
                {compactMode ? "Full View" : "Compact"}
              </span>
            </button>
          )}
          
          <button
            onClick={resetTree}
            className="px-3 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </motion.div>

      {/* Learning Path Banner */}
      <AnimatePresence>
        {activeLearningPath && learningPaths[activeLearningPath] && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-4 border border-blue-500/30 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Learning Path: {learningPaths[activeLearningPath].name}
                  </h3>
                  <p className="text-sm text-blue-300">
                    {highlightedSkills.length > 0 
                      ? `Focusing on ${highlightedSkills.length} skills in this tree`
                      : 'Switch to the relevant skill tree to see highlighted skills'
                    }
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={clearActiveLearningPath}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Exit learning path"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
            
            {highlightedSkills.length > 0 && (
              <div className="mt-3 flex items-center text-sm text-blue-200">
                <Target className="w-4 h-4 mr-2" />
                <span>Highlighted skills in this view will help you progress in this learning path</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Path Legend (only show in grid view) */}
      <AnimatePresence>
        {viewMode === 'grid' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PathLegend
              allPaths={getTreeInfo(currentTreeId)?.paths || []}
              highlightPaths={highlightPaths}
              toggleHighlightPath={toggleHighlightPath}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`
              grid gap-4 
              ${isResponsiveMode 
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' 
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
              }
            `}
                      >
            {/* Fallback message (should rarely appear now) */}
            {(!effectiveSkills || effectiveSkills.length === 0) && (
              <div className="col-span-full text-center p-8 bg-yellow-900/20 rounded-xl border border-yellow-500/30">
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">No Skills Available</h3>
                <p className="text-yellow-300 mb-4">
                  No skills found for tree: {currentTreeId}
                </p>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.reload();
                  }}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Reset Application
                </button>
              </div>
            )}
            
            {effectiveSkills && effectiveSkills.length > 0 && effectiveSkills.map((skill, index) => {
              if (!skill) return null;
              const isUnlocked = effectiveUnlocked[skill.id] || false;
              const isDimmed =
                highlightPaths.length > 0 && !highlightPaths.includes(skill.path);
              const isHighlightedForLearningPath = highlightedSkills.includes(skill.id);

              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300
                  }}
                >
                  <SkillNode
                    skill={skill}
                    points={effectiveSafePoints[skill.id] || 0}
                    isUnlocked={isUnlocked}
                    isDimmed={isDimmed}
                    addPoint={addPoint}
                    subtractPoint={subtractPoint}
                    canAddPoint={canAddPoint}
                    isHighlightedForLearningPath={isHighlightedForLearningPath}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="flow-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ReactFlowSkillGraph
              skills={effectiveSkills}
              safePoints={effectiveSafePoints}
              unlocked={effectiveUnlocked}
              addPoint={addPoint}
              subtractPoint={subtractPoint}
              highlightPaths={highlightPaths}
              canAddPoint={canAddPoint}
              highlightedSkills={highlightedSkills}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
      <AnimatePresence>
        {currentNotification && (
          <AchievementNotification
            achievement={currentNotification}
            onDismiss={handleNotificationDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

