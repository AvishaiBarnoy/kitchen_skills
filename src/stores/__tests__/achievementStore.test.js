import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAchievementStore from '../achievementStore';

// Mock localStorage
const mockStorage = {};
const mockLocalStorage = {
  getItem: vi.fn((key) => mockStorage[key] || null),
  setItem: vi.fn((key, value) => { mockStorage[key] = value }),
  removeItem: vi.fn((key) => { delete mockStorage[key] }),
  clear: vi.fn(() => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]) }),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

const mockAchievement = {
  id: 'first-cut',
  name: 'First Cut',
  description: 'Make your first cut',
  icon: '🔪',
  rarity: 'common'
};

const mockAchievement2 = {
  id: 'knife-master',
  name: 'Knife Master',
  description: 'Master all knife skills',
  icon: '🏆',
  rarity: 'legendary'
};

describe('useAchievementStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
    
    // Reset the store to initial state
    const { result } = renderHook(() => useAchievementStore());
    act(() => {
      result.current.resetAchievements();
    });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useAchievementStore());
    
    expect(result.current.unlockedAchievements).toEqual({});
    expect(result.current.newlyUnlocked).toEqual([]);
    expect(result.current.currentNotification).toBeNull();
    expect(result.current.notificationQueue).toEqual([]);
    expect(result.current.showAchievementsModal).toBe(false);
  });

  it('should unlock achievements correctly', () => {
    const { result } = renderHook(() => useAchievementStore());
    
    // Unlock first achievement
    act(() => {
      result.current.unlockAchievement('first-cut');
    });
    
    expect(result.current.unlockedAchievements['first-cut']).toBeDefined();
    expect(typeof result.current.unlockedAchievements['first-cut']).toBe('number'); // timestamp
    expect(result.current.newlyUnlocked).toContain('first-cut');
  });

  it('should not unlock the same achievement twice', () => {
    const { result } = renderHook(() => useAchievementStore());
    
    // Unlock achievement
    act(() => {
      result.current.unlockAchievement('first-cut');
    });
    
    const firstTimestamp = result.current.unlockedAchievements['first-cut'];
    
    // Try to unlock again
    act(() => {
      result.current.unlockAchievement('first-cut');
    });
    
    // Should have same timestamp and not be added to newly unlocked again
    expect(result.current.unlockedAchievements['first-cut']).toBe(firstTimestamp);
    expect(result.current.newlyUnlocked.filter(id => id === 'first-cut')).toHaveLength(1);
  });

  it('should clear newly unlocked achievements', () => {
    const { result } = renderHook(() => useAchievementStore());
    
    // Unlock achievement
    act(() => {
      result.current.unlockAchievement('first-cut');
    });
    
    expect(result.current.newlyUnlocked).toContain('first-cut');
    
    // Clear newly unlocked
    act(() => {
      result.current.clearNewlyUnlocked();
    });
    
    expect(result.current.newlyUnlocked).toEqual([]);
    expect(result.current.unlockedAchievements['first-cut']).toBeDefined(); // Should still be unlocked
  });

  it('should manage notification queue correctly', () => {
    const { result } = renderHook(() => useAchievementStore());
    
    // Add to queue
    act(() => {
      result.current.addToNotificationQueue(mockAchievement);
    });
    
    expect(result.current.notificationQueue).toContain(mockAchievement);
    
    // Add second achievement
    act(() => {
      result.current.addToNotificationQueue(mockAchievement2);
    });
    
    expect(result.current.notificationQueue).toHaveLength(2);
    expect(result.current.notificationQueue).toContain(mockAchievement2);
  });

  it('should not add duplicate achievements to notification queue', () => {
    const { result } = renderHook(() => useAchievementStore());
    
    // Add to queue
    act(() => {
      result.current.addToNotificationQueue(mockAchievement);
    });
    
    expect(result.current.notificationQueue).toHaveLength(1);
    
    // Try to add same achievement again
    act(() => {
      result.current.addToNotificationQueue(mockAchievement);
    });
    
    expect(result.current.notificationQueue).toHaveLength(1); // Should still be 1
  });

  it('should remove from notification queue correctly', () => {
    const { result } = renderHook(() => useAchievementStore());
    
    // Add achievements to queue
    act(() => {
      result.current.addToNotificationQueue(mockAchievement);
      result.current.addToNotificationQueue(mockAchievement2);
    });
    
    expect(result.current.notificationQueue).toHaveLength(2);
    
    // Remove from queue
    act(() => {
      result.current.removeFromNotificationQueue();
    });
    
    expect(result.current.notificationQueue).toHaveLength(1);
    expect(result.current.notificationQueue[0]).toBe(mockAchievement2);
    expect(result.current.currentNotification).toBeNull();
  });

  it('should manage current notification state', () => {
    const { result } = renderHook(() => useAchievementStore());
    
    // Set current notification
    act(() => {
      result.current.setCurrentNotification(mockAchievement);
    });
    
    expect(result.current.currentNotification).toBe(mockAchievement);
    
    // Clear current notification
    act(() => {
      result.current.setCurrentNotification(null);
    });
    
    expect(result.current.currentNotification).toBeNull();
  });

  it('should manage achievements modal state', () => {
    const { result } = renderHook(() => useAchievementStore());
    
    expect(result.current.showAchievementsModal).toBe(false);
    
    // Show modal
    act(() => {
      result.current.setShowAchievementsModal(true);
    });
    
    expect(result.current.showAchievementsModal).toBe(true);
    
    // Hide modal
    act(() => {
      result.current.setShowAchievementsModal(false);
    });
    
    expect(result.current.showAchievementsModal).toBe(false);
  });

  it('should reset all achievements correctly', () => {
    const { result } = renderHook(() => useAchievementStore());
    
    // Set up some state
    act(() => {
      result.current.unlockAchievement('first-cut');
      result.current.addToNotificationQueue(mockAchievement);
      result.current.setCurrentNotification(mockAchievement);
    });
    
    expect(result.current.unlockedAchievements).not.toEqual({});
    expect(result.current.newlyUnlocked).not.toEqual([]);
    expect(result.current.notificationQueue).not.toEqual([]);
    expect(result.current.currentNotification).not.toBeNull();
    
    // Reset
    act(() => {
      result.current.resetAchievements();
    });
    
    expect(result.current.unlockedAchievements).toEqual({});
    expect(result.current.newlyUnlocked).toEqual([]);
    expect(result.current.notificationQueue).toEqual([]);
    expect(result.current.currentNotification).toBeNull();
  });

  it('should set notification queue directly', () => {
    const { result } = renderHook(() => useAchievementStore());
    
    const queue = [mockAchievement, mockAchievement2];
    
    act(() => {
      result.current.setNotificationQueue(queue);
    });
    
    expect(result.current.notificationQueue).toEqual(queue);
  });
});