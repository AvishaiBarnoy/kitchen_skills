import { User, Target, Trophy, BookOpen, TrendingUp, Star, Download, Upload, ArrowRight, CheckCircle, Zap, Clock, ChefHat, Award } from 'lucide-react';
import useSkillTreeStore from '../stores/skillTreeStore';
import useAchievementStore from '../stores/achievementStore';
import { skillTrees, getAvailableTreeIds } from '../data/skillTrees';
import { achievements } from '../data/achievements';

export default function Profile() {
  const skillTreeStoreData = useSkillTreeStore() || {};
  const achievementStoreData = useAchievementStore() || {};
  
  const { skillPoints = {}, resetTree, setCurrentTree } = skillTreeStoreData;
  const { unlockedAchievements = {} } = achievementStoreData;

  // Calculate comprehensive statistics
  const availableTreeIds = getAvailableTreeIds() || [];
  const stats = availableTreeIds.reduce((acc, treeId) => {
    const tree = skillTrees[treeId];
    if (!tree) return acc;
    
    const points = skillPoints[treeId] || {};
    const earnedPoints = Object.values(points).reduce((sum, pts) => sum + (pts || 0), 0);
    const skills = tree.fullData || [];
    const totalPossible = skills.reduce((sum, skill) => sum + (skill?.max || 0), 0);
    const completedSkills = skills.filter(skill => (points[skill.id] || 0) >= (skill.max || 1)).length;
    
    return {
      totalEarned: acc.totalEarned + earnedPoints,
      totalPossible: acc.totalPossible + totalPossible,
      totalSkills: acc.totalSkills + skills.length,
      completedSkills: acc.completedSkills + completedSkills,
      trees: [...acc.trees, {
        id: treeId,
        name: tree.name || treeId,
        description: tree.description || 'No description available',
        earnedPoints,
        totalPossible,
        skillCount: skills.length,
        completedSkills,
        progress: totalPossible > 0 ? Math.round((earnedPoints / totalPossible) * 100) : 0
      }]
    };
  }, { 
    totalEarned: 0, 
    totalPossible: 0, 
    totalSkills: 0, 
    completedSkills: 0, 
    trees: [] 
  });

  const overallProgress = stats.totalPossible > 0 
    ? Math.round((stats.totalEarned / stats.totalPossible) * 100) 
    : 0;

  const unlockedAchievementsList = Object.keys(unlockedAchievements);
  const totalAchievements = achievements?.length || 0;
  const achievementProgress = totalAchievements > 0 
    ? Math.round((unlockedAchievementsList.length / totalAchievements) * 100) 
    : 0;

  // Enhanced intelligent next steps suggestions
  const getNextSteps = () => {
    const suggestions = [];
    
    // Priority 1: Nearly complete skills (80-95% complete)
    const nearlyCompleteTrees = stats.trees.filter(tree => tree.progress >= 80 && tree.progress < 100);
    if (nearlyCompleteTrees.length > 0) {
      const tree = nearlyCompleteTrees[0];
      suggestions.push({
        type: 'complete',
        priority: 'high',
        title: `🎯 Finish ${tree.name}`,
        description: `You're ${tree.progress}% complete! Just ${100 - tree.progress}% left to master this tree.`,
        action: () => setCurrentTree(tree.id),
        timeEstimate: '5-10 minutes',
        impact: 'High - Complete mastery unlock',
        color: 'green',
        icon: CheckCircle
      });
    }

    // Priority 2: Find specific next unlockable skills
    const getNextUnlockableSkills = () => {
      const unlockableSkills = [];
      stats.trees.forEach(tree => {
        const skillData = skillTrees[tree.id];
        if (skillData && skillData.fullData) {
          const points = skillPoints[tree.id] || {};
          skillData.fullData.forEach(skill => {
            if (!skill) return;
            const currentPoints = points[skill.id] || 0;
            
            // Check if skill is not maxed and prerequisites are met
            if (currentPoints < skill.max) {
              const prerequisitesMet = !skill.prereq || skill.prereq.every(prereq => {
                const prereqPoints = points[prereq.id] || 0;
                return prereqPoints >= prereq.points;
              });
              
              if (prerequisitesMet) {
                unlockableSkills.push({
                  skill,
                  tree: tree.name,
                  treeId: tree.id,
                  currentPoints,
                  progress: currentPoints / skill.max
                });
              }
            }
          });
        }
      });
      return unlockableSkills.sort((a, b) => b.progress - a.progress); // Sort by closest to completion
    };

    const nextSkills = getNextUnlockableSkills();
    if (nextSkills.length > 0) {
      const skill = nextSkills[0];
      suggestions.push({
        type: 'skill',
        priority: 'high',
        title: `⚡ Practice "${skill.skill.name}"`,
        description: `${skill.currentPoints}/${skill.skill.max} points in ${skill.tree}. ${skill.skill.description}`,
        action: () => setCurrentTree(skill.treeId),
        timeEstimate: '3-5 minutes',
        impact: 'Medium - Skill advancement',
        color: 'blue',
        icon: Target
      });
    }

    // Priority 3: Learning path suggestions
    const learningPathSuggestions = () => {
      if (stats.totalEarned < 10) {
        return {
          type: 'path',
          priority: 'high',
          title: `🍳 Start "Beginner Cook" Path`,
          description: 'Perfect starting point with essential knife skills and kitchen safety.',
          action: () => {}, // Will be enhanced to navigate to learning paths
          timeEstimate: '2-4 weeks',
          impact: 'High - Structured foundation',
          color: 'purple',
          icon: BookOpen
        };
      } else if (stats.completedSkills >= 5) {
        return {
          type: 'path',
          priority: 'medium',
          title: `🥗 Try "Vegetarian Prep Master"`,
          description: 'Build on your knife skills with precision vegetable techniques.',
          action: () => {},
          timeEstimate: '3-5 weeks',
          impact: 'Medium - Skill specialization',
          color: 'green',
          icon: ChefHat
        };
      }
      return null;
    };

    const pathSuggestion = learningPathSuggestions();
    if (pathSuggestion) {
      suggestions.push(pathSuggestion);
    }

    // Priority 4: Achievement unlock opportunities
    const getCloseAchievements = () => {
      const closeAchievements = [];
      achievements.forEach(achievement => {
        if (unlockedAchievements[achievement.id]) return; // Skip already unlocked
        
        // Check progress towards achievement
        if (achievement.condition.totalPoints) {
          const progress = stats.totalEarned / achievement.condition.totalPoints;
          if (progress > 0.7 && progress < 1) {
            closeAchievements.push({
              achievement,
              progress,
              pointsNeeded: achievement.condition.totalPoints - stats.totalEarned
            });
          }
        }
        
        if (achievement.condition.skillId) {
          const allPoints = Object.values(skillPoints).reduce((acc, treePoints) => ({ ...acc, ...treePoints }), {});
          const currentPoints = allPoints[achievement.condition.skillId] || 0;
          const progress = currentPoints / achievement.condition.points;
          if (progress > 0.5 && progress < 1) {
            closeAchievements.push({
              achievement,
              progress,
              pointsNeeded: achievement.condition.points - currentPoints
            });
          }
        }
      });
      
      return closeAchievements.sort((a, b) => b.progress - a.progress);
    };

    const closeAchievements = getCloseAchievements();
    if (closeAchievements.length > 0 && suggestions.length < 4) {
      const achievement = closeAchievements[0];
      suggestions.push({
        type: 'achievement',
        priority: 'medium',
        title: `🏆 Unlock "${achievement.achievement.name}"`,
        description: `${Math.round(achievement.progress * 100)}% complete. ${achievement.achievement.description}`,
        action: () => {},
        timeEstimate: '2-8 minutes',
        impact: 'Medium - Recognition badge',
        color: 'yellow',
        icon: Trophy
      });
    }

    // Priority 5: Exploration suggestions
    const unexploredTrees = stats.trees.filter(tree => tree.progress < 10);
    if (unexploredTrees.length > 0 && suggestions.length < 4) {
      const tree = unexploredTrees[0];
      suggestions.push({
        type: 'explore',
        priority: 'low',
        title: `🔍 Explore ${tree.name}`,
        description: `New skill tree with ${tree.skillCount} skills to discover.`,
        action: () => setCurrentTree(tree.id),
        timeEstimate: '10-15 minutes',
        impact: 'Low - Skill discovery',
        color: 'indigo',
        icon: Star
      });
    }

    // Priority 6: Consistency suggestions
    if (stats.totalEarned > 0 && suggestions.length < 4) {
      suggestions.push({
        type: 'consistency',
        priority: 'low',
        title: `⏰ Daily Practice Session`,
        description: 'Dedicate 5-10 minutes daily to maintain skill sharpness.',
        action: () => {},
        timeEstimate: '5-10 minutes',
        impact: 'Medium - Skill retention',
        color: 'gray',
        icon: Clock
      });
    }

    // Ensure we have at least 3-4 suggestions
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'start',
        priority: 'high',
        title: `🚀 Begin Your Culinary Journey`,
        description: 'Start with basic knife skills to build your foundation.',
        action: () => setCurrentTree('knife-skills'),
        timeEstimate: '5 minutes',
        impact: 'High - Foundation building',
        color: 'blue',
        icon: ChefHat
      });
    }

    // Limit to top 4 suggestions and sort by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return suggestions
      .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
      .slice(0, 4);
  };

  const nextSteps = getNextSteps();

  // Export/Import functionality (placeholder for future backend integration)
  const exportProgress = () => {
    const data = {
      skillPoints,
      unlockedAchievements,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kitchen-skills-progress.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-purple-500/20 rounded-full">
            <User className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Your Culinary Profile</h1>
            <p className="text-gray-400">Track your journey to culinary mastery</p>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-3">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-slate-600"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${overallProgress * 1.76} 176`}
                  className="text-purple-400"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{overallProgress}%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-300">{stats.totalEarned}</div>
            <div className="text-xs text-gray-400">Total Skill Points</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-300 mb-2">{stats.completedSkills}</div>
            <div className="text-sm text-gray-300">Skills Mastered</div>
            <div className="text-xs text-gray-400">of {stats.totalSkills} total</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-2">{unlockedAchievementsList.length}</div>
            <div className="text-sm text-gray-300">Achievements</div>
            <div className="text-xs text-gray-400">{achievementProgress}% unlocked</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">{stats.trees.length}</div>
            <div className="text-sm text-gray-300">Skill Trees</div>
            <div className="text-xs text-gray-400">explored</div>
          </div>
        </div>
      </div>

      {/* Skill Trees Progress */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center text-white">
          <Target className="h-5 w-5 mr-2 text-purple-400" />
          Skill Trees Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.trees.map(tree => (
            <div key={tree.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">{tree.name}</h3>
                <span className="text-sm text-gray-400">{tree.progress}%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2 mb-3">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${tree.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{tree.earnedPoints} / {tree.totalPossible} points</span>
                <span>{tree.completedSkills} / {tree.skillCount} skills</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Suggested Next Steps */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center text-white">
            <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
            Suggested Next Steps
          </h2>
          <div className="text-sm text-gray-400">
            Personalized recommendations based on your progress
          </div>
        </div>
        
        <div className="space-y-4">
          {nextSteps.map((step, index) => {
            const IconComponent = step.icon || Target;
            
            // Color mapping for different types
            const colorClasses = {
              green: {
                bg: 'bg-green-500/10 border-green-500/30',
                icon: 'bg-green-500/20 text-green-400',
                priority: 'text-green-400',
                button: 'bg-green-600 hover:bg-green-700'
              },
              blue: {
                bg: 'bg-blue-500/10 border-blue-500/30',
                icon: 'bg-blue-500/20 text-blue-400',
                priority: 'text-blue-400',
                button: 'bg-blue-600 hover:bg-blue-700'
              },
              purple: {
                bg: 'bg-purple-500/10 border-purple-500/30',
                icon: 'bg-purple-500/20 text-purple-400',
                priority: 'text-purple-400',
                button: 'bg-purple-600 hover:bg-purple-700'
              },
              yellow: {
                bg: 'bg-yellow-500/10 border-yellow-500/30',
                icon: 'bg-yellow-500/20 text-yellow-400',
                priority: 'text-yellow-400',
                button: 'bg-yellow-600 hover:bg-yellow-700'
              },
              indigo: {
                bg: 'bg-indigo-500/10 border-indigo-500/30',
                icon: 'bg-indigo-500/20 text-indigo-400',
                priority: 'text-indigo-400',
                button: 'bg-indigo-600 hover:bg-indigo-700'
              },
              gray: {
                bg: 'bg-gray-500/10 border-gray-500/30',
                icon: 'bg-gray-500/20 text-gray-400',
                priority: 'text-gray-400',
                button: 'bg-gray-600 hover:bg-gray-700'
              }
            };
            
            const colors = colorClasses[step.color] || colorClasses.blue;
            
            return (
              <div 
                key={index}
                className={`rounded-xl p-5 border transition-all duration-200 hover:shadow-lg ${colors.bg}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-xl ${colors.icon}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-white text-lg">{step.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white/10 ${colors.priority}`}>
                          {step.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 mb-3 leading-relaxed">
                        {step.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{step.timeEstimate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4" />
                          <span>{step.impact}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={step.action}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${colors.button}`}
                      >
                        <span>Take Action</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Summary footer */}
        <div className="mt-6 pt-4 border-t border-slate-600">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Suggestions update based on your progress and activity</span>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Complete suggestions to accelerate your learning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Management */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center text-white">
          <Download className="h-5 w-5 mr-2 text-blue-400" />
          Progress Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-white mb-3">Backup Your Progress</h3>
            <p className="text-gray-400 text-sm mb-4">
              Export your skill points and achievements to keep your progress safe.
            </p>
            <button
              onClick={exportProgress}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Progress</span>
            </button>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-3">Reset Progress</h3>
            <p className="text-gray-400 text-sm mb-4">
              Start fresh with a clean slate. This action cannot be undone.
            </p>
            <div className="space-y-2">
              {stats.trees.map(tree => (
                <button
                  key={tree.id}
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to reset ${tree.name}? This cannot be undone.`)) {
                      setCurrentTree(tree.id);
                      resetTree();
                    }
                  }}
                  className="block w-full text-left text-sm bg-red-600/20 hover:bg-red-600/30 text-red-300 px-3 py-2 rounded border border-red-600/30 transition-colors"
                >
                  Reset {tree.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}