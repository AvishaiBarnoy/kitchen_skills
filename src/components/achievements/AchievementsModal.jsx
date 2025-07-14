/** @jsxImportSource react */
import React, { useState } from 'react';
import AchievementCard from './AchievementCard';

export default function AchievementsModal({ 
  achievements, 
  unlockedAchievements, 
  getProgress, 
  onClose 
}) {
  const [activeTab, setActiveTab] = useState('all');

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
    return achievements.filter(achievement => achievement.rarity === rarity).length;
  };

  const getTabUnlockedCount = (rarity) => {
    if (rarity === 'all') return unlockedAchievements.size;
    return achievements.filter(achievement => 
      achievement.rarity === rarity && unlockedAchievements.has(achievement.id)
    ).length;
  };

  // Calculate overall stats
  const stats = {
    unlocked: unlockedAchievements.size,
    total: achievements.length,
    percentage: Math.round((unlockedAchievements.size / achievements.length) * 100)
  };

  // Event handlers
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Add escape key listener
  React.useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">🏆 Achievements</h2>
              <p className="text-purple-100 text-sm">
                {stats.unlocked} of {stats.total} unlocked ({stats.percentage}%)
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {rarityTabs.map((tab) => {
            const count = getTabCount(tab.id);
            const unlockedCount = getTabUnlockedCount(tab.id);
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 py-3 px-4 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-slate-800 text-white border-b-2 border-purple-500' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className={`w-2 h-2 rounded-full bg-${tab.color}-500`} />
                  {tab.name}
                  <span className="text-xs opacity-70">
                    ({unlockedCount}/{count})
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {filteredAchievements.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              No achievements found for this category.
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={unlockedAchievements.has(achievement.id)}
                  progress={getProgress(achievement)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}