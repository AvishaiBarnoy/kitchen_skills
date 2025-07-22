/** @jsxImportSource react */
import React from "react";
import { motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import { pathColors } from "@/data/paths";

/**
 * SkillNode component represents a single skill in the skill tree
 * Enhanced with animations and improved visual feedback for Stage 4
 * @param {Object} skill - The skill data object
 * @param {number} points - Current points invested in this skill
 * @param {boolean} isUnlocked - Whether the skill is unlocked
 * @param {boolean} isDimmed - Whether the skill should appear dimmed
 * @param {Function} addPoint - Function to add a point to the skill
 * @param {Function} subtractPoint - Function to subtract a point from the skill
 * @param {Function} canAddPoint - Function to check if a point can be added
 */
const SkillNode = React.memo(function SkillNode({
  skill,
  points,
  isUnlocked,
  isDimmed,
  addPoint,
  subtractPoint,
  canAddPoint,
  isHighlightedForLearningPath = false,
}) {
  if (!skill) return null;

  const canAdd = typeof canAddPoint === "function" ? canAddPoint(skill.id) : true;
  const isMaxed = points >= skill.max;
  const progress = skill.max > 0 ? (points / skill.max) * 100 : 0;

  // Enhanced tooltip content with more details
  let tooltipContent = "";
  if (!isUnlocked) {
    tooltipContent = "🔒 Locked - Complete prerequisites to unlock";
    if (skill.prereq.length > 0) {
      tooltipContent += "\nRequires: " + 
        skill.prereq.map((req) => `${req.points} pts in "${req.id}"`).join(", ");
    }
  } else if (!canAdd && skill.prereq.length > 0) {
    tooltipContent = "⚠️ Requires: " +
      skill.prereq.map((req) => `${req.points} pts in "${req.id}"`).join(", ");
  } else if (isMaxed) {
    tooltipContent = "✅ MAXED OUT - You've mastered this skill!";
  } else {
    tooltipContent = `📈 ${skill.description}\n\n💡 Click to add point • Right-click to remove`;
    if (skill.prereq.length > 0) {
      tooltipContent += "\nPrerequisites: " +
        skill.prereq.map((req) => `${req.points} pts in "${req.id}"`).join(", ");
    }
  }

  // Dynamic color based on state
  const getNodeColors = () => {
    if (!isUnlocked) {
      return {
        bg: "bg-gray-600",
        text: "text-gray-300",
        border: isHighlightedForLearningPath ? "border-blue-400 border-2" : "border-gray-500",
        ring: "focus:ring-gray-400"
      };
    }
    
    if (isDimmed) {
      return {
        bg: "bg-gray-400",
        text: "text-gray-700",
        border: "border-gray-300",
        ring: "focus:ring-gray-300"
      };
    }
    
    if (isMaxed) {
      return {
        bg: `${pathColors[skill.path] || pathColors.default} bg-opacity-100`,
        text: "text-white",
        border: isHighlightedForLearningPath ? "border-blue-400 border-2 shadow-lg shadow-blue-400/50" : "border-yellow-400 border-2",
        ring: "focus:ring-yellow-400"
      };
    }
    
    return {
      bg: `${pathColors[skill.path] || pathColors.default} bg-opacity-90`,
      text: "text-white",
      border: isHighlightedForLearningPath ? "border-blue-400 border-2 shadow-lg shadow-blue-400/50" : "border-transparent",
      ring: "focus:ring-purple-400"
    };
  };

  const colors = getNodeColors();

  // Animation variants
  const nodeVariants = {
    locked: {
      scale: 0.95,
      opacity: 0.6,
      transition: { duration: 0.2 }
    },
    unlocked: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, type: "spring", stiffness: 300 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.1 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    },
    maxed: {
      scale: 1,
      opacity: 1,
      transition: { 
        duration: 0.5, 
        type: "spring", 
        stiffness: 200,
        repeat: 1,
        repeatType: "reverse"
      }
    }
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: { 
      width: `${progress}%`,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <motion.div
            layout
            variants={nodeVariants}
            initial="locked"
            animate={isUnlocked ? (isMaxed ? "maxed" : "unlocked") : "locked"}
            whileHover={isUnlocked && canAdd ? "hover" : undefined}
            whileTap={isUnlocked && canAdd ? "tap" : undefined}
            onClick={() => isUnlocked && canAdd && addPoint(skill.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              subtractPoint(skill.id);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (isUnlocked && canAdd) {
                  addPoint(skill.id);
                }
              } else if (e.key === 'Backspace' || e.key === 'Delete') {
                e.preventDefault();
                subtractPoint(skill.id);
              }
            }}
            tabIndex={isUnlocked ? 0 : -1}
            role="button"
            aria-label={`${skill.name} skill. ${points} out of ${skill.max} points. ${skill.description}. ${tooltipContent || (canAdd ? 'Click to add point, right-click to remove' : '')}`}
            className={`
              relative rounded-xl p-3 shadow-lg text-sm text-center transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
              ${colors.bg} ${colors.text} ${colors.border} ${colors.ring}
              ${!canAdd ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
              ${isUnlocked ? "hover:shadow-xl" : ""}
              min-h-[120px] max-w-[160px]
            `}
          >
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-20 rounded-b-xl overflow-hidden">
              <motion.div
                variants={progressVariants}
                initial="initial"
                animate="animate"
                className="h-full bg-yellow-400"
              />
            </div>

            {/* Status indicator */}
            <div className="absolute -top-1 -right-1 flex flex-col space-y-1">
              {isHighlightedForLearningPath && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                  title="Learning Path Skill"
                >
                  <span className="text-xs text-white">📚</span>
                </motion.div>
              )}
              {!isUnlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-xs text-white">🔒</span>
                </motion.div>
              )}
              {isMaxed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-xs">⭐</span>
                </motion.div>
              )}
            </div>

            {/* Skill content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <div className="font-bold uppercase text-xs tracking-wide">{skill.name}</div>
              
              <motion.div 
                className="text-lg font-mono font-bold"
                key={points} // Re-animate when points change
                initial={{ scale: 1.2, color: "#fbbf24" }}
                animate={{ scale: 1, color: "inherit" }}
                transition={{ duration: 0.3 }}
              >
                {isMaxed ? "MAX" : `${points} / ${skill.max}`}
              </motion.div>
              
              <div className="text-xs opacity-90 leading-tight line-clamp-3">
                {skill.description}
              </div>
            </motion.div>
          </motion.div>
        </Tooltip.Trigger>
        
        {/* Enhanced Tooltip */}
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-gray-900 text-white px-4 py-3 rounded-lg text-sm shadow-xl z-50 max-w-sm border border-gray-700"
            side="top"
            align="center"
            sideOffset={10}
          >
            <div className="font-semibold mb-1">{skill.name}</div>
            <div className="whitespace-pre-line">{tooltipContent}</div>
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
});

export default SkillNode;

