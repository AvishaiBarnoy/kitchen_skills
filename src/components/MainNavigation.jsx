import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Trophy, BookOpen, Target, Play, User } from 'lucide-react';
import SkillGraph from './skillGraph';
import Profile from './Profile';
import LearningPaths from './LearningPaths';
import AchievementsView from './AchievementsView';
import ResponsiveWrapper from './layout/ResponsiveWrapper';
import { skillTrees, getAvailableTreeIds } from '@/data/skillTrees';
import { achievements } from '@/data/achievements';
import useSkillTreeStore from '@/stores/skillTreeStore';
import useAchievementStore from '@/stores/achievementStore';

export default function MainNavigation() {
  const [currentView, setCurrentView] = useState('home');
  
  // Store data with error handling
  const skillTreeStoreData = useSkillTreeStore() || {};
  const achievementStoreData = useAchievementStore() || {};
  
  const { skillPoints = {} } = skillTreeStoreData;
  const { unlockedAchievements = {} } = achievementStoreData;
  
  // Convert unlockedAchievements object to array length
  const unlockedAchievementsCount = Object.keys(unlockedAchievements || {}).length;
  
  // Calculate overall progress with error handling
  let availableTreeIds = [];
  let totalProgress = { earned: 0, total: 0 };
  let overallProgressPercentage = 0;
  
  try {
    availableTreeIds = getAvailableTreeIds() || [];
    totalProgress = availableTreeIds.reduce((acc, treeId) => {
      const tree = skillTrees[treeId];
      if (!tree) return acc;
      
      const points = skillPoints[treeId] || {};
      const earnedPoints = Object.values(points).reduce((sum, pts) => sum + (pts || 0), 0);
      const skills = tree.fullData || [];
      const totalPossible = skills.reduce((sum, skill) => sum + (skill?.max || 0), 0);
      
      return {
        earned: acc.earned + earnedPoints,
        total: acc.total + totalPossible
      };
    }, { earned: 0, total: 0 });
    
    overallProgressPercentage = totalProgress.total > 0 
      ? Math.round((totalProgress.earned / totalProgress.total) * 100) 
      : 0;
  } catch (error) {
    console.warn('Error calculating progress:', error);
  }

  if (currentView === 'skillTree') {
    return (
      <ResponsiveWrapper className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black text-gray-200">
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView('home')}
                className="flex items-center space-x-2 text-purple-300 hover:text-purple-100 transition-colors"
              >
                <ChefHat className="h-6 w-6" />
                <span className="font-semibold">Kitchen Skills</span>
              </motion.button>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('profile')}
                  className="flex items-center space-x-1 text-gray-400 hover:text-purple-300 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">Profile</span>
                </motion.button>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-400"
                >
                  Progress: {overallProgressPercentage}%
                </motion.div>
              </div>
            </div>
          </div>
        </motion.nav>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SkillGraph />
        </motion.div>
      </ResponsiveWrapper>
    );
  }

  if (currentView === 'profile') {
    return (
      <ResponsiveWrapper className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black text-gray-200">
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView('home')}
                className="flex items-center space-x-2 text-purple-300 hover:text-purple-100 transition-colors"
              >
                <ChefHat className="h-6 w-6" />
                <span className="font-semibold">Kitchen Skills</span>
              </motion.button>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('skillTree')}
                  className="flex items-center space-x-1 text-gray-400 hover:text-purple-300 transition-colors"
                >
                  <Target className="h-4 w-4" />
                  <span className="text-sm">Skills</span>
                </motion.button>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-400"
                >
                  Progress: {overallProgressPercentage}%
                </motion.div>
              </div>
            </div>
          </div>
        </motion.nav>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Profile />
        </motion.div>
      </ResponsiveWrapper>
    );
  }

  if (currentView === 'learningPaths') {
    return (
      <ResponsiveWrapper className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black text-gray-200">
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView('home')}
                className="flex items-center space-x-2 text-purple-300 hover:text-purple-100 transition-colors"
              >
                <ChefHat className="h-6 w-6" />
                <span className="font-semibold">Kitchen Skills</span>
              </motion.button>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('skillTree')}
                  className="flex items-center space-x-1 text-gray-400 hover:text-purple-300 transition-colors"
                >
                  <Target className="h-4 w-4" />
                  <span className="text-sm">Skills</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('achievements')}
                  className="flex items-center space-x-1 text-gray-400 hover:text-purple-300 transition-colors"
                >
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm">Achievements</span>
                </motion.button>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-400"
                >
                  Progress: {overallProgressPercentage}%
                </motion.div>
              </div>
            </div>
          </div>
        </motion.nav>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <LearningPaths onNavigateToSkills={() => setCurrentView('skillTree')} />
        </motion.div>
      </ResponsiveWrapper>
    );
  }

  if (currentView === 'achievements') {
    return (
      <ResponsiveWrapper className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black text-gray-200">
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView('home')}
                className="flex items-center space-x-2 text-purple-300 hover:text-purple-100 transition-colors"
              >
                <ChefHat className="h-6 w-6" />
                <span className="font-semibold">Kitchen Skills</span>
              </motion.button>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('skillTree')}
                  className="flex items-center space-x-1 text-gray-400 hover:text-purple-300 transition-colors"
                >
                  <Target className="h-4 w-4" />
                  <span className="text-sm">Skills</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('learningPaths')}
                  className="flex items-center space-x-1 text-gray-400 hover:text-purple-300 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">Paths</span>
                </motion.button>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-400"
                >
                  Progress: {overallProgressPercentage}%
                </motion.div>
              </div>
            </div>
          </div>
        </motion.nav>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AchievementsView />
        </motion.div>
      </ResponsiveWrapper>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black text-gray-200">
      {/* Header */}
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-purple-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Kitchen Skills Tracker</h1>
                <p className="text-gray-400">Master culinary techniques through RPG-style progression</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-300">{totalProgress.earned}</div>
                <div className="text-xs text-gray-400">Skill Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{unlockedAchievementsCount}</div>
                <div className="text-xs text-gray-400">Achievements</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Overview */}
        <section className="mb-12">
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-400" />
              Your Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-600"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${overallProgressPercentage * 2.26} 226`}
                      className="text-purple-400"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{overallProgressPercentage}%</span>
                  </div>
                </div>
                <p className="text-gray-300">Overall Progress</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">{availableTreeIds.length}</div>
                <p className="text-gray-300">Skill Trees Available</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{achievements?.length || 0}</div>
                <p className="text-gray-300">Total Achievements</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Skill Trees */}
            <motion.div 
              onClick={() => setCurrentView('skillTree')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700 p-6 cursor-pointer hover:bg-slate-700/40 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                    <Play className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Skill Trees</h3>
                </div>
                <div className="text-sm text-purple-300 bg-purple-500/20 px-2 py-1 rounded">
                  {availableTreeIds.length} available
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-3">
                Explore interactive skill trees and unlock new culinary techniques
              </p>
              <div className="text-xs text-purple-300">Click to start learning →</div>
            </motion.div>

            {/* Learning Paths */}
            <motion.div 
              onClick={() => setCurrentView('learningPaths')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700 p-6 cursor-pointer hover:bg-slate-700/40 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <BookOpen className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Learning Paths</h3>
                </div>
                <div className="text-sm text-blue-300 bg-blue-500/20 px-2 py-1 rounded">
                  6 paths
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-3">
                Follow structured learning paths designed for progressive skill building
              </p>
              <div className="text-xs text-blue-300">Explore paths →</div>
            </motion.div>

            {/* Achievements */}
            <motion.div 
              onClick={() => setCurrentView('achievements')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700 p-6 cursor-pointer hover:bg-slate-700/40 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                    <Trophy className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Achievements</h3>
                </div>
                <div className="text-sm text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded">
                  {unlockedAchievementsCount}/{achievements?.length || 0}
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-3">
                Track your milestones and unlock special recognition badges
              </p>
              <div className="text-xs text-yellow-300">View progress →</div>
            </motion.div>

            {/* Profile */}
            <motion.div 
              onClick={() => setCurrentView('profile')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700 p-6 cursor-pointer hover:bg-slate-700/40 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                    <User className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Profile</h3>
                </div>
                <div className="text-sm text-purple-300 bg-purple-500/20 px-2 py-1 rounded">
                  {overallProgressPercentage}%
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-3">
                View detailed progress, statistics, and manage your culinary journey
              </p>
              <div className="text-xs text-purple-300">View profile →</div>
            </motion.div>
          </div>
        </section>

        {/* Skill Trees Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Available Skill Trees</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableTreeIds.map(treeId => {
              const tree = skillTrees[treeId];
              if (!tree) return null;
              
              const points = skillPoints[treeId] || {};
              const earnedPoints = Object.values(points).reduce((sum, pts) => sum + (pts || 0), 0);
              const skills = tree.fullData || [];
              const totalPossible = skills.reduce((sum, skill) => sum + (skill?.max || 0), 0);
              const treeProgress = totalPossible > 0 ? Math.round((earnedPoints / totalPossible) * 100) : 0;

              return (
                <div 
                  key={treeId}
                  onClick={() => setCurrentView('skillTree')}
                  className="bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700 p-6 cursor-pointer hover:bg-slate-700/40 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{tree.name || treeId}</h3>
                    <div className="text-sm text-gray-400">{treeProgress}%</div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{tree.description || 'No description available'}</p>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-slate-600 rounded-full h-2 mb-3">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${treeProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{earnedPoints} / {totalPossible} points</span>
                    <span>{skills.length} skills</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm">
          <p>Master culinary techniques through structured, RPG-style progression</p>
          <p className="mt-2">Built with React • Inspired by professional kitchen training</p>
        </footer>
      </main>
    </div>
  );
}