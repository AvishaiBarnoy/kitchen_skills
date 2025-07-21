import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAchievementStore = create(
  persist(
    (set, get) => ({
      // Achievement state
      unlockedAchievements: {},
      newlyUnlocked: [],
      
      // UI state for notifications
      currentNotification: null,
      notificationQueue: [],
      showAchievementsModal: false,
      
      // Actions
      unlockAchievement: (achievementId) => set((state) => {
        if (state.unlockedAchievements[achievementId]) {
          return state; // Already unlocked
        }
        
        return {
          ...state,
          unlockedAchievements: {
            ...state.unlockedAchievements,
            [achievementId]: Date.now()
          },
          newlyUnlocked: [...state.newlyUnlocked, achievementId]
        };
      }),
      
      clearNewlyUnlocked: () => set({ newlyUnlocked: [] }),
      
      // Notification queue management
      addToNotificationQueue: (achievement) => set((state) => {
        const isAlreadyQueued = state.notificationQueue.find(item => item.id === achievement.id);
        if (isAlreadyQueued) return state;
        
        return {
          ...state,
          notificationQueue: [...state.notificationQueue, achievement]
        };
      }),
      
      setCurrentNotification: (notification) => set({ currentNotification: notification }),
      
      removeFromNotificationQueue: () => set((state) => ({
        ...state,
        notificationQueue: state.notificationQueue.slice(1),
        currentNotification: null
      })),
      
      setNotificationQueue: (queue) => set({ notificationQueue: queue }),
      
      // Modal state
      setShowAchievementsModal: (show) => set({ showAchievementsModal: show }),
      
      // Reset achievements (for development/testing)
      resetAchievements: () => set({
        unlockedAchievements: {},
        newlyUnlocked: [],
        currentNotification: null,
        notificationQueue: [],
      }),
    }),
    {
      name: 'achievement-storage',
      // Only persist the unlocked achievements, not UI state
      partialize: (state) => ({
        unlockedAchievements: state.unlockedAchievements,
      }),
    }
  )
);

export default useAchievementStore;