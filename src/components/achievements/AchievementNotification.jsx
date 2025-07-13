/** @jsxImportSource react */
import React, { useEffect, useState } from 'react';
import { rarityColors } from '../../data/achievements';

export default function AchievementNotification({ achievement, onDismiss }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start entrance animation
    setIsAnimating(true);
    
    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-out
      ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className={`
        bg-gradient-to-r ${rarityColors[achievement.rarity]} 
        border-2 ${achievement.rarity === 'legendary' ? 'border-yellow-400' : 'border-white/20'}
        rounded-lg shadow-2xl p-4 text-white
        animate-pulse
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold uppercase tracking-wide">
            Achievement Unlocked!
          </span>
          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Achievement Content */}
        <div className="flex items-center gap-3">
          <div className="text-3xl bg-white/20 p-2 rounded-full">
            {achievement.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg">{achievement.name}</h3>
            <p className="text-sm text-white/80">{achievement.description}</p>
            <span className="inline-block mt-1 px-2 py-1 bg-black/20 rounded text-xs font-bold uppercase">
              {achievement.rarity}
            </span>
          </div>
        </div>

        {/* Sparkle animation overlay for legendary achievements */}
        {achievement.rarity === 'legendary' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1 left-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping" />
            <div className="absolute top-3 right-3 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-2 left-3 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
          </div>
        )}
      </div>
    </div>
  );
}