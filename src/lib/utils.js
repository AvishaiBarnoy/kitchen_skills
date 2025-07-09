import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));
export default cn;

export function buildSkillLookup(skills) {
  const lookup = {};
  for (const skill of skills) {
    lookup[skill.id] = skill;
  }
  return lookup;
}

export function isSkillFullyUnlocked(skill, points, lookup) {
  return skill.prereq.every((pr) => {
    const actualPoints = points[pr.id] || 0;
    if (actualPoints < pr.points) return false;

    const prereqSkill = lookup[pr.id];
    if (!prereqSkill) return false;

    // Recursively check the prereq skill
    return isSkillFullyUnlocked(prereqSkill, points, lookup);
  });
}

export function computeUnlocks(skills, points) {
  const unlocked = {};
  const lookup = buildSkillLookup(skills);

  for (const skill of skills) {
    unlocked[skill.id] = isSkillFullyUnlocked(skill, points, lookup);
  }

  return unlocked;
}

