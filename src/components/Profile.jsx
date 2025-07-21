import { User, Target, Trophy, BookOpen, TrendingUp, Star, Download, Upload } from 'lucide-react';
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

  // Suggest next steps
  const getNextSteps = () => {
    const suggestions = [];
    
    // Find trees with low progress
    const lowProgressTrees = stats.trees.filter(tree => tree.progress < 50);
    if (lowProgressTrees.length > 0) {
      suggestions.push({
        type: 'skill',
        title: `Continue ${lowProgressTrees[0].name}`,
        description: `You're ${lowProgressTrees[0].progress}% complete. Keep building your foundation!`,
        action: () => setCurrentTree(lowProgressTrees[0].id)
      });
    }

    // Find trees that are nearly complete
    const nearlyCompleteTrees = stats.trees.filter(tree => tree.progress >= 80 && tree.progress < 100);
    if (nearlyCompleteTrees.length > 0) {
      suggestions.push({
        type: 'achievement',
        title: `Complete ${nearlyCompleteTrees[0].name}`,
        description: `You're so close! Only ${100 - nearlyCompleteTrees[0].progress}% left to master this tree.`,
        action: () => setCurrentTree(nearlyCompleteTrees[0].id)
      });
    }

    // Achievement suggestions
    if (unlockedAchievementsList.length < totalAchievements / 2) {
      suggestions.push({
        type: 'trophy',
        title: 'Unlock More Achievements',
        description: 'Focus on completing skills to unlock recognition badges.',
        action: () => {}
      });
    }

    // If no specific suggestions, encourage exploration
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'explore',
        title: 'Explore New Skills',
        description: 'Try a different skill tree to expand your culinary expertise.',
        action: () => {}
      });
    }

    return suggestions;
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

      {/* Suggested Next Steps */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center text-white">
          <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
          Suggested Next Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nextSteps.map((step, index) => {
            const IconComponent = {
              skill: BookOpen,
              achievement: Trophy,
              trophy: Star,
              explore: Target
            }[step.type] || Target;
            
            return (
              <div 
                key={index}
                onClick={step.action}
                className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:bg-slate-600/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <IconComponent className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
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