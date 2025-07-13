/** @jsxImportSource react */
import React from 'react';

export default function AchievementButton({ stats, onClick, hasNewAchievements = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${hasNewAchievements 
          ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white animate-pulse' 
          : 'bg-slate-700 hover:bg-slate-600 text-white'
        }
        shadow-lg hover:shadow-xl
      `}
    >
      {/* New achievement indicator */}
      {hasNewAchievements && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      )}
      
      <div className="flex items-center gap-2">
        <span className="text-lg">🏆</span>
        <div className="text-left">
          <div className="font-bold">Achievements</div>
          <div className="text-xs opacity-80">
            {stats.unlocked}/{stats.total} ({stats.percentage}%)
          </div>
        </div>
      </div>
    </button>
  );
}