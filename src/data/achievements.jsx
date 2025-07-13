export const achievementTypes = {
  SKILL_MASTERY: 'skill_mastery',
  PATH_COMPLETION: 'path_completion', 
  TOTAL_POINTS: 'total_points',
  SKILL_COMBINATION: 'skill_combination',
  FIRST_STEPS: 'first_steps'
};

export const achievements = [
  // First Steps Achievements
  {
    id: 'first_point',
    name: 'First Steps',
    description: 'Allocate your first skill point',
    icon: '🌱',
    type: achievementTypes.FIRST_STEPS,
    condition: { totalPoints: 1 },
    rarity: 'common'
  },
  {
    id: 'grip_master',
    name: 'Steady Hands',
    description: 'Master the fundamental grip technique',
    icon: '✋',
    type: achievementTypes.SKILL_MASTERY,
    condition: { skillId: 'grip', points: 3 },
    rarity: 'common'
  },

  // Skill Mastery Achievements
  {
    id: 'knife_expert',
    name: 'Knife Expert',
    description: 'Master knife types and selection',
    icon: '🔪',
    type: achievementTypes.SKILL_MASTERY,
    condition: { skillId: 'knifeTypes', points: 3 },
    rarity: 'common'
  },
  {
    id: 'sharp_edge',
    name: 'Sharp Edge',
    description: 'Master knife sharpening techniques',
    icon: '⚡',
    type: achievementTypes.SKILL_MASTERY,
    condition: { skillId: 'sharpen', points: 3 },
    rarity: 'common'
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Achieve maximum cutting speed',
    icon: '💨',
    type: achievementTypes.SKILL_MASTERY,
    condition: { skillId: 'speed', points: 5 },
    rarity: 'rare'
  },

  // Path Completion Achievements
  {
    id: 'vegetable_virtuoso',
    name: 'Vegetable Virtuoso',
    description: 'Complete all vegetable preparation skills',
    icon: '🥕',
    type: achievementTypes.PATH_COMPLETION,
    condition: { path: 'vegetable' },
    rarity: 'epic'
  },
  {
    id: 'protein_pro',
    name: 'Protein Professional',
    description: 'Master all protein preparation techniques',
    icon: '🥩',
    type: achievementTypes.PATH_COMPLETION,
    condition: { path: 'protein' },
    rarity: 'epic'
  },
  {
    id: 'basics_boss',
    name: 'Basics Boss',
    description: 'Master all fundamental cutting techniques',
    icon: '👑',
    type: achievementTypes.PATH_COMPLETION,
    condition: { path: 'basic' },
    rarity: 'rare'
  },
  {
    id: 'decorative_artist',
    name: 'Decorative Artist',
    description: 'Master decorative and garnish cuts',
    icon: '🎨',
    type: achievementTypes.PATH_COMPLETION,
    condition: { path: 'decorative' },
    rarity: 'legendary'
  },

  // Total Points Achievements
  {
    id: 'apprentice_chef',
    name: 'Apprentice Chef',
    description: 'Earn 10 skill points',
    icon: '👨‍🍳',
    type: achievementTypes.TOTAL_POINTS,
    condition: { totalPoints: 10 },
    rarity: 'common'
  },
  {
    id: 'skilled_cook',
    name: 'Skilled Cook',
    description: 'Earn 25 skill points',
    icon: '🍳',
    type: achievementTypes.TOTAL_POINTS,
    condition: { totalPoints: 25 },
    rarity: 'rare'
  },
  {
    id: 'master_chef',
    name: 'Master Chef',
    description: 'Earn 50 skill points',
    icon: '⭐',
    type: achievementTypes.TOTAL_POINTS,
    condition: { totalPoints: 50 },
    rarity: 'legendary'
  },

  // Skill Combination Achievements
  {
    id: 'prep_master',
    name: 'Prep Master',
    description: 'Master both dicing and julienne techniques',
    icon: '🔄',
    type: achievementTypes.SKILL_COMBINATION,
    condition: { 
      skills: [
        { skillId: 'diceMedium', points: 1 },
        { skillId: 'julienne', points: 2 }
      ]
    },
    rarity: 'rare'
  },
  {
    id: 'knife_sage',
    name: 'Knife Sage',
    description: 'Master grip, knife types, and sharpening',
    icon: '🧙‍♂️',
    type: achievementTypes.SKILL_COMBINATION,
    condition: { 
      skills: [
        { skillId: 'grip', points: 3 },
        { skillId: 'knifeTypes', points: 3 },
        { skillId: 'sharpen', points: 3 }
      ]
    },
    rarity: 'epic'
  },
  {
    id: 'precision_cutter',
    name: 'Precision Cutter',
    description: 'Master fine dicing, mincing, and julienne',
    icon: '🎯',
    type: achievementTypes.SKILL_COMBINATION,
    condition: { 
      skills: [
        { skillId: 'diceSmall', points: 1 },
        { skillId: 'mince', points: 1 },
        { skillId: 'julienne', points: 2 }
      ]
    },
    rarity: 'epic'
  }
];

export const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600', 
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500'
};

export const rarityBorders = {
  common: 'border-gray-400',
  rare: 'border-blue-400',
  epic: 'border-purple-400', 
  legendary: 'border-yellow-400'
};