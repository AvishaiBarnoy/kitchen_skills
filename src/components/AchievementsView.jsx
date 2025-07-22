/** @jsxImportSource react */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Lock, Filter, Search, Award, Target, Zap } from 'lucide-react';
import { achievements } from '@/data/achievements';
import useSkillTreeStore from '@/stores/skillTreeStore';
import useAchievements from '@/hooks/useAchievements';

const AchievementsView = () => {
  const { skillPoints } = useSkillTreeStore();
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get all skills for achievement logic
  const allSkills = Object.values(skillPoints).reduce((acc, treePoints) => {
    return { ...acc, ...treePoints };
  }, {});

  const { unlockedAchievements, getAchievementProgress } = useAchievements(skillPoints, []);

  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || 
                       (filterType === 'unlocked' && unlockedAchievements[achievement.id]) ||
                       (filterType === 'locked' && !unlockedAchievements[achievement.id]) ||
                       (filterType === achievement.type);
    return matchesSearch && matchesType;
  });

  // Group achievements by type
  const achievementsByType = filteredAchievements.reduce((acc, achievement) => {
    const type = achievement.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(achievement);
    return acc;
  }, {});

  // Calculate statistics
  const totalAchievements = achievements.length;
  const unlockedCount = Object.keys(unlockedAchievements).length;
  const progressPercentage = Math.round((unlockedCount / totalAchievements) * 100);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'uncommon': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'rare': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'epic': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'legendary': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'skill_mastery': return <Target className="w-5 h-5" />;
      case 'path_completion': return <Award className="w-5 h-5" />;
      case 'total_points': return <Zap className="w-5 h-5" />;
      case 'skill_combination': return <Star className="w-5 h-5" />;
      case 'first_steps': return <Trophy className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'skill_mastery': return 'Skill Mastery';
      case 'path_completion': return 'Path Completion';
      case 'total_points': return 'Point Milestones';
      case 'skill_combination': return 'Combinations';
      case 'first_steps': return 'First Steps';
      default: return 'Other';
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Achievements', icon: Trophy },
    { value: 'unlocked', label: 'Unlocked', icon: Star },
    { value: 'locked', label: 'Locked', icon: Lock },
    { value: 'skill_mastery', label: 'Skill Mastery', icon: Target },
    { value: 'path_completion', label: 'Path Completion', icon: Award },
    { value: 'total_points', label: 'Point Milestones', icon: Zap },
    { value: 'first_steps', label: 'First Steps', icon: Trophy },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
          <Trophy className="mr-3 h-8 w-8 text-yellow-400" />
          Achievements
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-6">
          Track your culinary milestones and unlock special recognition badges as you master new skills.
        </p>

        {/* Progress Stats */}
        <div className="flex items-center justify-center space-x-8 mb-8">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-2">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-gray-600"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${progressPercentage * 2.26} 226`}
                  className="text-yellow-400"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">{progressPercentage}%</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm">Completion</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-1">{unlockedCount}</div>
            <p className="text-gray-300 text-sm">Unlocked</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-400 mb-1">{totalAchievements - unlockedCount}</div>
            <p className="text-gray-300 text-sm">Remaining</p>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/40 rounded-xl p-6 border border-slate-700"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setFilterType(option.value)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${filterType === option.value
                      ? 'bg-yellow-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <AnimatePresence>
        {Object.keys(achievementsByType).length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 text-gray-400"
          >
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No achievements found matching your criteria.</p>
          </motion.div>
        ) : (
          Object.entries(achievementsByType).map(([type, typeAchievements], typeIndex) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + typeIndex * 0.1 }}
              className="space-y-4"
            >
              {/* Type Header */}
              <div className="flex items-center space-x-3">
                {getTypeIcon(type)}
                <h2 className="text-xl font-bold text-white">{getTypeName(type)}</h2>
                <span className="text-sm text-gray-400">({typeAchievements.length})</span>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {typeAchievements.map((achievement, index) => {
                  const isUnlocked = !!unlockedAchievements[achievement.id];
                  const progress = getAchievementProgress(achievement.id);

                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className={`
                        relative overflow-hidden rounded-xl p-6 border-2 transition-all duration-300
                        ${isUnlocked
                          ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/50 shadow-lg shadow-yellow-500/10'
                          : 'bg-slate-800/40 border-gray-600 hover:border-gray-500'
                        }
                      `}
                    >
                      {/* Unlock Badge */}
                      {isUnlocked && (
                        <div className="absolute top-2 right-2">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Star className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}

                      {/* Achievement Icon */}
                      <div className="text-4xl mb-3">{achievement.icon}</div>

                      {/* Achievement Info */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className={`font-bold ${isUnlocked ? 'text-yellow-300' : 'text-white'}`}>
                            {achievement.name}
                          </h3>
                        </div>

                        <p className={`text-sm ${isUnlocked ? 'text-gray-300' : 'text-gray-400'}`}>
                          {achievement.description}
                        </p>

                        {/* Rarity Badge */}
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity?.charAt(0).toUpperCase() + achievement.rarity?.slice(1)}
                          </span>

                          {/* Progress */}
                          {!isUnlocked && progress && (
                            <span className="text-xs text-gray-400">
                              {Math.round(progress * 100)}%
                            </span>
                          )}
                        </div>

                        {/* Progress Bar for locked achievements */}
                        {!isUnlocked && progress > 0 && (
                          <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                            <div 
                              className="bg-yellow-400 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${progress * 100}%` }}
                            ></div>
                          </div>
                        )}
                      </div>

                      {/* Lock Overlay for locked achievements */}
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
                          <Lock className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center bg-slate-800/40 rounded-xl p-8 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-2">Keep Learning to Unlock More!</h3>
        <p className="text-gray-400 mb-4">
          Each achievement represents a significant milestone in your culinary journey.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1" />
            <span>Recognition badges</span>
          </div>
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-1" />
            <span>Progress tracking</span>
          </div>
          <div className="flex items-center">
            <Trophy className="w-4 h-4 mr-1" />
            <span>Milestone celebration</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AchievementsView;