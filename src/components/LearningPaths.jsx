/** @jsxImportSource react */
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Target, Clock, Users, Star, ChevronRight, Play, ArrowRight, CheckCircle } from 'lucide-react';
import { pathColors } from '@/data/paths';
import { skillTrees, getAvailableTreeIds } from '@/data/skillTrees';
import useSkillTreeStore from '@/stores/skillTreeStore';

const LearningPaths = ({ onNavigateToSkills }) => {
  const { skillPoints, setCurrentTree, setActiveLearningPath } = useSkillTreeStore();

  // Define structured learning paths
  const learningPaths = [
    {
      id: 'beginner',
      name: 'Beginner Cook',
      description: 'Start your culinary journey with essential knife skills and basic techniques',
      difficulty: 'Beginner',
      estimatedTime: '2-4 weeks',
      icon: '👨‍🍳',
      color: 'from-green-600 to-emerald-700',
      borderColor: 'border-green-500',
      skills: [
        { treeId: 'knife', skillIds: ['grip', 'knifeTypes', 'basic'], label: 'Basic knife handling' },
        { treeId: 'knife', skillIds: ['rockChop', 'julienne'], label: 'Simple cutting techniques' },
        { treeId: 'knife', skillIds: ['safety'], label: 'Kitchen safety' }
      ]
    },
    {
      id: 'vegetarian',
      name: 'Vegetarian Prep Master',
      description: 'Master vegetable preparation techniques for plant-based cooking',
      difficulty: 'Intermediate',
      estimatedTime: '3-5 weeks',
      icon: '🥕',
      color: 'from-emerald-600 to-green-700',
      borderColor: 'border-emerald-500',
      skills: [
        { treeId: 'knife', skillIds: ['julienne', 'brunoise', 'chiffonade'], label: 'Precision cuts' },
        { treeId: 'knife', skillIds: ['tournee', 'carving'], label: 'Advanced vegetable prep' }
      ]
    },
    {
      id: 'protein',
      name: 'Protein Mastery',
      description: 'Learn professional meat, fish, and poultry preparation techniques',
      difficulty: 'Advanced',
      estimatedTime: '4-6 weeks',
      icon: '🥩',
      color: 'from-red-600 to-rose-700',
      borderColor: 'border-red-500',
      skills: [
        { treeId: 'knife', skillIds: ['boning', 'filleting', 'carving'], label: 'Protein breakdown' },
        { treeId: 'knife', skillIds: ['speed'], label: 'Efficiency techniques' }
      ]
    },
    {
      id: 'baking',
      name: 'Baking Fundamentals',
      description: 'Discover the art and science of baking from basics to advanced techniques',
      difficulty: 'Beginner to Advanced',
      estimatedTime: '6-8 weeks',
      icon: '🍞',
      color: 'from-amber-600 to-orange-700',
      borderColor: 'border-amber-500',
      skills: [
        { treeId: 'baking', skillIds: ['measuring', 'mixing'], label: 'Baking basics' },
        { treeId: 'baking', skillIds: ['yeastDough', 'lamination'], label: 'Dough techniques' }
      ]
    },
    {
      id: 'sauces',
      name: 'Sauce Master',
      description: 'Master the five mother sauces and their countless derivatives',
      difficulty: 'Intermediate to Advanced',
      estimatedTime: '5-7 weeks',
      icon: '🍯',
      color: 'from-yellow-600 to-amber-700',
      borderColor: 'border-yellow-500',
      skills: [
        { treeId: 'sauces', skillIds: ['bechamel', 'veloute', 'hollandaise'], label: 'Mother sauces' },
        { treeId: 'sauces', skillIds: ['emulsification', 'reduction'], label: 'Advanced techniques' }
      ]
    },
    {
      id: 'pastry',
      name: 'Pastry Arts',
      description: 'Explore the elegant world of pastry and dessert preparation',
      difficulty: 'Advanced',
      estimatedTime: '6-10 weeks',
      icon: '🎂',
      color: 'from-pink-600 to-rose-700',
      borderColor: 'border-pink-500',
      skills: [
        { treeId: 'knife', skillIds: ['pastry'], label: 'Pastry knife skills' },
        { treeId: 'baking', skillIds: ['decoration', 'pastryDough'], label: 'Decorative techniques' }
      ]
    }
  ];

  // Calculate progress for each path
  const calculatePathProgress = (path) => {
    let totalSkills = 0;
    let completedSkills = 0;

    path.skills.forEach(skillGroup => {
      skillGroup.skillIds.forEach(skillId => {
        totalSkills++;
        const treePoints = skillPoints[skillGroup.treeId] || {};
        const skillMaxPoints = getSkillMaxPoints(skillGroup.treeId, skillId);
        const currentPoints = treePoints[skillId] || 0;
        
        if (currentPoints >= skillMaxPoints) {
          completedSkills++;
        }
      });
    });

    return totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;
  };

  const getSkillMaxPoints = (treeId, skillId) => {
    const tree = skillTrees[treeId];
    if (!tree || !tree.fullData) return 3; // default
    const skill = tree.fullData.find(s => s && s.id === skillId);
    return skill ? skill.max : 3;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-purple-400 bg-purple-500/20';
    }
  };

  // Handle learning path selection
  const handlePathStart = (path) => {
    // Set the active learning path in the store
    setActiveLearningPath(path.id);
    
    // Navigate to the first skill tree in the path
    const firstSkillTree = path.skills[0]?.treeId;
    if (firstSkillTree) {
      setCurrentTree(firstSkillTree);
    }
    
    // Navigate to skills view if callback provided
    if (onNavigateToSkills) {
      onNavigateToSkills();
    }
  };

  // Get next suggested skills for a path
  const getNextSkills = (path) => {
    const suggestions = [];
    for (const skillGroup of path.skills) {
      const treePoints = skillPoints[skillGroup.treeId] || {};
      for (const skillId of skillGroup.skillIds) {
        const skillMaxPoints = getSkillMaxPoints(skillGroup.treeId, skillId);
        const currentPoints = treePoints[skillId] || 0;
        
        if (currentPoints < skillMaxPoints) {
          // Find the skill details
          const tree = skillTrees[skillGroup.treeId];
          const skill = tree?.fullData?.find(s => s && s.id === skillId);
          if (skill) {
            suggestions.push({
              name: skill.name,
              tree: skillGroup.treeId,
              points: currentPoints,
              maxPoints: skillMaxPoints,
              description: skill.description
            });
          }
        }
        
        // Only show first few incomplete skills
        if (suggestions.length >= 3) break;
      }
      if (suggestions.length >= 3) break;
    }
    return suggestions;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
          <BookOpen className="mr-3 h-8 w-8 text-blue-400" />
          Learning Paths
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Follow structured learning paths designed for progressive skill building. 
          Each path guides you through a logical sequence of skills to master specific culinary domains.
        </p>
      </motion.div>

      {/* Learning Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningPaths.map((path, index) => {
          const progress = calculatePathProgress(path);
          const isStarted = progress > 0;
          const isCompleted = progress === 100;
          const nextSkills = getNextSkills(path);

          return (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative overflow-hidden rounded-xl border-2 ${path.borderColor}
                bg-gradient-to-br ${path.color} bg-opacity-10
                hover:bg-opacity-20 transition-all duration-300
                group cursor-pointer
              `}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              </div>

              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{path.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        {path.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                          {path.difficulty}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {path.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Circle */}
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-gray-600"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${progress * 1.76} 176`}
                        className={isCompleted ? "text-green-400" : "text-blue-400"}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isCompleted ? (
                        <Star className="w-6 h-6 text-green-400" />
                      ) : (
                        <span className="text-sm font-bold text-white">{progress}%</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {path.description}
                </p>

                {/* Skills Preview or Next Steps */}
                <div className="space-y-2 mb-4">
                  {isStarted && !isCompleted && nextSkills.length > 0 ? (
                    <>
                      <h4 className="text-sm font-semibold text-blue-300">Next skills to practice:</h4>
                      {nextSkills.slice(0, 2).map((skill, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center text-gray-300">
                            <Target className="w-3 h-3 mr-1 text-blue-400" />
                            {skill.name}
                          </div>
                          <div className="text-gray-500">
                            {skill.points}/{skill.maxPoints}
                          </div>
                        </div>
                      ))}
                      {nextSkills.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{nextSkills.length - 2} more skills...
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <h4 className="text-sm font-semibold text-gray-300">What you'll learn:</h4>
                      {path.skills.slice(0, 2).map((skillGroup, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-400">
                          <ChevronRight className="w-3 h-3 mr-1 text-blue-400" />
                          {skillGroup.label}
                        </div>
                      ))}
                      {path.skills.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{path.skills.length - 2} more skill groups...
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Action Button */}
                <motion.button
                  onClick={() => handlePathStart(path)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full py-2 rounded-lg font-medium text-sm transition-all duration-200
                    flex items-center justify-center space-x-2
                    ${isCompleted 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : isStarted 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }
                  `}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Completed!</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      <span>{isStarted ? 'Continue Path' : 'Start Learning'}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center bg-slate-800/40 rounded-xl p-8 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-2">Ready to Start Your Culinary Journey?</h3>
        <p className="text-gray-400 mb-4">
          Choose a learning path that matches your goals and current skill level.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-1" />
            <span>Structured progression</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>Expert-designed</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1" />
            <span>Track achievements</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LearningPaths;