/** @jsxImportSource react */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Smartphone, Tablet, Monitor } from 'lucide-react';

const ResponsiveWrapper = ({ children, className = '' }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showDeviceInfo, setShowDeviceInfo] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640); // sm breakpoint
      setIsTablet(width >= 640 && width < 1024); // between sm and lg
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDeviceIcon = () => {
    if (isMobile) return <Smartphone size={16} />;
    if (isTablet) return <Tablet size={16} />;
    return <Monitor size={16} />;
  };

  const getDeviceLabel = () => {
    if (isMobile) return 'Mobile';
    if (isTablet) return 'Tablet';
    return 'Desktop';
  };

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Device indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 right-4 z-50 lg:hidden"
      >
        <button
          onClick={() => setShowDeviceInfo(!showDeviceInfo)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 shadow-lg"
          title={`Current view: ${getDeviceLabel()}`}
        >
          {getDeviceIcon()}
          <span className="text-sm">{getDeviceLabel()}</span>
        </button>
        
        {showDeviceInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute top-full mt-2 right-0 bg-gray-900 text-white p-4 rounded-lg border border-gray-600 shadow-xl min-w-[200px]"
          >
            <div className="text-sm space-y-2">
              <div className="font-semibold text-purple-400">Current Viewport</div>
              <div>Width: {window.innerWidth}px</div>
              <div>Height: {window.innerHeight}px</div>
              <div className="pt-2 border-t border-gray-700">
                <div className="text-gray-400 text-xs">
                  {isMobile && "📱 Optimized for touch navigation"}
                  {isTablet && "📱 Tablet-friendly layout"}
                  {!isMobile && !isTablet && "🖥️ Full desktop experience"}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Main content with responsive padding */}
      <div className={`
        ${isMobile ? 'pt-20 px-4 pb-6' : ''}
        ${isTablet ? 'pt-6 px-6 pb-8' : ''}
        ${!isMobile && !isTablet ? 'pt-6 px-8 pb-8' : ''}
      `}>
        {children}
      </div>

      {/* Mobile-specific touch hints */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="fixed bottom-4 left-4 right-4 bg-gray-800 text-white p-3 rounded-lg border border-gray-600 text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="text-purple-400">💡</span>
            <span>
              Tap skills to add points • Use flow view for better navigation
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResponsiveWrapper;