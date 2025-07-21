import { useState } from 'react';
import useSkillTreeStore from '../../stores/skillTreeStore';
import { skillTrees, getAvailableTreeIds, learningPaths, getSkillsForTree } from '../../data/skillTrees';

export default function TreeSelector() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPaths, setShowPaths] = useState(false);
  const { currentTreeId, setCurrentTree, skillPoints, compactMode } = useSkillTreeStore();
  
  const availableTreeIds = getAvailableTreeIds();
  const currentTree = skillTrees[currentTreeId];

  const handleTreeChange = (treeId) => {
    setCurrentTree(treeId);
    setShowDropdown(false);
  };

  const togglePathsPanel = () => {
    setShowPaths(!showPaths);
  };

  // Calculate progress for each tree
  const getTreeProgress = (treeId) => {
    const skills = getSkillsForTree(treeId, compactMode);
    const points = skillPoints[treeId] || {};
    
    const totalPossiblePoints = skills.reduce((sum, skill) => sum + skill.max, 0);
    const earnedPoints = Object.values(points).reduce((sum, pts) => sum + pts, 0);
    
    return {
      earned: earnedPoints,
      total: totalPossiblePoints,
      percentage: totalPossiblePoints > 0 ? Math.round((earnedPoints / totalPossiblePoints) * 100) : 0
    };
  };

  return (
    <div className="relative">
      {/* Main Tree Selector */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-4 py-3 bg-slate-800/90 border border-slate-600 rounded-lg hover:bg-slate-700/90 transition-colors min-w-[280px]"
          >
            <span className="text-2xl">{currentTree?.icon}</span>
            <div className="flex-1 text-left">
              <div className="font-semibold text-white">{currentTree?.name}</div>
              <div className="text-sm text-gray-300">{currentTree?.description}</div>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50">
                        {availableTreeIds.map((treeId) => {
            const tree = skillTrees[treeId];
            const isActive = treeId === currentTreeId;
            const progress = getTreeProgress(treeId);
            
            return (
              <button
                key={treeId}
                onClick={() => handleTreeChange(treeId)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700 transition-colors ${
                  isActive ? 'bg-slate-700 border-l-4 border-blue-500' : ''
                } ${treeId === availableTreeIds[availableTreeIds.length - 1] ? 'rounded-b-lg' : ''} ${
                  treeId === availableTreeIds[0] ? 'rounded-t-lg' : ''
                }`}
              >
                <span className="text-2xl">{tree.icon}</span>
                <div className="flex-1">
                  <div className={`font-medium ${isActive ? 'text-blue-400' : 'text-white'} flex items-center justify-between`}>
                    <span>{tree.name}</span>
                    <span className="text-xs font-normal text-gray-400">
                      {progress.earned}/{progress.total} ({progress.percentage}%)
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-1">{tree.description}</div>
                  {progress.total > 0 && (
                    <div className="w-full bg-gray-600 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
            </div>
          )}
        </div>

        {/* Learning Paths Toggle */}
        <button
          onClick={togglePathsPanel}
          className="flex items-center gap-2 px-4 py-3 bg-purple-800/90 border border-purple-600 rounded-lg hover:bg-purple-700/90 transition-colors"
        >
          <span className="text-lg">🎯</span>
          <span className="font-medium">Learning Paths</span>
          <svg
            className={`w-4 h-4 transition-transform ${showPaths ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Learning Paths Panel */}
      {showPaths && (
        <div className="mb-6 p-4 bg-slate-900/90 border border-slate-600 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span>🎯</span>
            Guided Learning Paths
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            Follow structured learning paths to master specific cooking domains and techniques.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(learningPaths).map(([pathId, path]) => (
              <div
                key={pathId}
                className="p-3 bg-slate-800/60 border border-slate-600 rounded-lg hover:border-slate-500 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{path.icon}</span>
                  <span className="font-medium text-white">{path.name}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{path.description}</p>
                <div className="text-xs text-gray-500">
                  {path.skills.length} skills across {new Set(path.skills.map(s => s.treeId)).size} trees
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            <p>💡 <strong>Tip:</strong> Learning paths help you focus on specific cooking goals by showing recommended skills across different skill trees.</p>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}