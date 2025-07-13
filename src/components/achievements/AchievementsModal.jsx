/** @jsxImportSource react */
import React, { useState } from 'react';
import AchievementCard from './AchievementCard';

export default function AchievementsModal({ 
  isOpen, 
  onClose, 
  achievements, 
  unlockedAchievements, 
  getAchievementProgress, 
  stats 
}) {
  const [activeTab, setActiveTab] = useState('all');

  if (!isOpen) return null;

  const rarityTabs = [
    { id: 'all', name: 'All', color: 'gray' },
    { id: 'common', name: 'Common', color: 'gray' },
    { id: 'rare', name: 'Rare', color: 'blue' },
    { id: 'epic', name: 'Epic', color: 'purple' },
    { id: 'legendary', name: 'Legendary', color: 'yellow' }
  ];

  const filteredAchievements = activeTab === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.rarity === activeTab);

  const getTabCount = (rarity) => {
    if (rarity === 'all') return achievements.length;
    return achievements.filter(a => a.rarity === rarity).length;
  };

  const getTabUnlockedCount = (rarity) => {
    const rarityAchievements = rarity === 'all' 
      ? achievements 
      : achievements.filter(a => a.rarity === rarity);
    return rarityAchievements.filter(a => unlockedAchievements.has(a.id)).length;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-purple-900 to-blue-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Achievements</h2>
              <p className="text-gray-300 mt-1">
                Track your cooking mastery progress
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.unlocked}</div>
              <div className="text-sm text-gray-300">Unlocked</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.percentage}%</div>
              <div className="text-sm text-gray-300">Complete</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.remaining}</div>
              <div className="text-sm text-gray-300">Remaining</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 bg-gray-800">
          <div className="flex overflow-x-auto">
            {rarityTabs.map(tab => {
              const count = getTabCount(tab.id);
              const unlocked = getTabUnlockedCount(tab.id);
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                    ${activeTab === tab.id
                      ? 'border-blue-400 text-blue-400 bg-blue-400/10'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                    }
                  `}
                >
                  {tab.name}
                  <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded">
                    {unlocked}/{count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map(achievement => {
              const isUnlocked = unlockedAchievements.has(achievement.id);
              const progress = getAchievementProgress(achievement);
              
              return (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  progress={progress}
                  isUnlocked={isUnlocked}
                />
              );
            })}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No achievements in this category yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800 text-center">
          <p className="text-sm text-gray-400">
            Keep practicing to unlock more achievements! 🏆
          </p>
        </div>
      </div>
    </div>
  );
}