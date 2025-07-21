import { useState } from 'react';
import useSkillTreeStore from '../../stores/skillTreeStore';
import { learningPaths, skillTrees, getSkillsForTree } from '../../data/skillTrees';

export default function LearningPathModal({ pathId, onClose }) {
  if (!pathId) return null;
  
  const path = learningPaths[pathId];
  const { skillPoints, setCurrentTree, currentTreeId, setActiveLearningPath } = useSkillTreeStore();
  
  if (!path) return null;

  // Calculate progress for this learning path
  const calculateProgress = () => {
    let completed = 0;
    let total = path.skills.length;
    
    path.skills.forEach(({ treeId, skillId, targetPoints }) => {
      const treePoints = skillPoints[treeId] || {};
      const currentPoints = treePoints[skillId] || 0;
      if (currentPoints >= targetPoints) {
        completed++;
      }
    });
    
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const progress = calculateProgress();

  // Group skills by tree for better organization
  const skillsByTree = path.skills.reduce((acc, skill) => {
    if (!acc[skill.treeId]) {
      acc[skill.treeId] = [];
    }
    acc[skill.treeId].push(skill);
    return acc;
  }, {});

  const handleSkillClick = (treeId, skillId) => {
    if (treeId !== currentTreeId) {
      setCurrentTree(treeId);
    }
    onClose();
    // Scroll to skill would happen here if we had skill IDs in the DOM
  };

  const handleStartPath = () => {
    setActiveLearningPath(pathId);
    // Switch to the first tree that has skills in this path
    const firstTreeId = path.skills[0]?.treeId;
    if (firstTreeId && firstTreeId !== currentTreeId) {
      setCurrentTree(firstTreeId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-600 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{path.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{path.name}</h2>
                <p className="text-gray-300">{path.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-300">Progress</span>
              <span className="text-gray-300">{progress.completed}/{progress.total} skills completed ({progress.percentage}%)</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Learning Path Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{path.skills.length}</div>
                <div className="text-sm text-gray-300">Total Skills</div>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{Object.keys(skillsByTree).length}</div>
                <div className="text-sm text-gray-300">Skill Trees</div>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">{progress.percentage}%</div>
                <div className="text-sm text-gray-300">Complete</div>
              </div>
            </div>
          </div>

          {/* Skills by Tree */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Required Skills</h3>
            {Object.entries(skillsByTree).map(([treeId, treeSkills]) => {
              const tree = skillTrees[treeId];
              const allSkills = getSkillsForTree(treeId, false);
              
              return (
                <div key={treeId} className="bg-slate-700/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{tree.icon}</span>
                    <h4 className="text-lg font-medium text-white">{tree.name}</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {treeSkills.map(({ skillId, targetPoints }) => {
                      const skill = allSkills.find(s => s.id === skillId);
                      const currentPoints = (skillPoints[treeId] || {})[skillId] || 0;
                      const isCompleted = currentPoints >= targetPoints;
                      
                      if (!skill) return null;
                      
                      return (
                        <div 
                          key={skillId}
                          onClick={() => handleSkillClick(treeId, skillId)}
                          className="flex items-center justify-between p-3 bg-slate-800/50 rounded cursor-pointer hover:bg-slate-800/70 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                            <div>
                              <div className="font-medium text-white">{skill.name}</div>
                              <div className="text-sm text-gray-400">{skill.description}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-300">
                            {currentPoints}/{targetPoints} points
                            {isCompleted && <span className="ml-2 text-green-400">✓</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-600 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Click on any skill to navigate to its tree and location
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleStartPath}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 transition-colors"
            >
              {progress.percentage > 0 ? 'Continue Path' : 'Start Learning Path'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}