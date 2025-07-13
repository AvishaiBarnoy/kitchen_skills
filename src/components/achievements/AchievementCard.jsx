/** @jsxImportSource react */
import React from 'react';
import { rarityColors, rarityBorders } from '../../data/achievements';

export default function AchievementCard({ achievement, progress, isUnlocked }) {
  const { name, description, icon, rarity } = achievement;
  const { progress: progressPercent, current, target, isComplete } = progress;

  return (
    <div className={`
      relative p-4 rounded-lg border-2 transition-all duration-300
      ${isUnlocked 
        ? `bg-gradient-to-br ${rarityColors[rarity]} ${rarityBorders[rarity]} shadow-lg` 
        : 'bg-gray-800 border-gray-600 opacity-75'
      }
    `}>
      {/* Rarity indicator */}
      <div className={`
        absolute top-1 right-1 px-2 py-1 rounded text-xs font-bold uppercase
        ${isUnlocked ? 'bg-black/20' : 'bg-gray-700'}
      `}>
        {rarity}
      </div>

      {/* Icon and Title */}
      <div className="flex items-center gap-3 mb-2">
        <div className={`
          text-2xl p-2 rounded-full
          ${isUnlocked ? 'bg-white/20' : 'bg-gray-700'}
        `}>
          {icon}
        </div>
        <div>
          <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-300'}`}>
            {name}
          </h3>
          <p className={`text-sm ${isUnlocked ? 'text-white/80' : 'text-gray-400'}`}>
            {description}
          </p>
        </div>
      </div>

      {/* Progress bar (only show if not unlocked) */}
      {!isUnlocked && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>
              {typeof current !== 'undefined' && typeof target !== 'undefined' 
                ? `${current}/${target}` 
                : `${progressPercent}%`
              }
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${rarityColors[rarity]} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Unlocked indicator */}
      {isUnlocked && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
}