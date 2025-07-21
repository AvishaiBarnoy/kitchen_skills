/** @jsxImportSource react */
import { motion } from "framer-motion";
import { pathColors } from "../../data/paths";

export default function PathLegend({ allPaths, highlightPaths, toggleHighlightPath }) {
  if (!allPaths || allPaths.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-gray-800 rounded-xl p-4 border border-gray-700"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm font-medium text-gray-300"
        >
          Learning Paths:
        </motion.span>
        
        <div className="flex flex-wrap gap-2">
          {allPaths.map((path, index) => {
            const isHighlighted = highlightPaths.includes(path);
            const colorClass = pathColors[path] || pathColors.default;
            
            return (
              <motion.button
                key={path}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.4 + index * 0.1,
                  type: "spring",
                  stiffness: 300
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.1 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleHighlightPath(path)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                  border-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900
                  ${isHighlighted
                    ? `${colorClass} text-white border-white shadow-lg`
                    : `bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500 hover:text-white`
                  }
                `}
                aria-pressed={isHighlighted}
                title={`${isHighlighted ? 'Hide' : 'Show'} ${path} skills`}
              >
                <motion.span
                  key={isHighlighted ? 'highlighted' : 'normal'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {path}
                </motion.span>
                
                {isHighlighted && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="ml-1 inline-block"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
        
        {highlightPaths.length > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onClick={() => highlightPaths.forEach(path => toggleHighlightPath(path))}
            className="text-xs text-gray-400 hover:text-white transition-colors ml-auto"
            title="Clear all filters"
          >
            Clear All
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

