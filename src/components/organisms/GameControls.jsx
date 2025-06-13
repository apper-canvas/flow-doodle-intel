import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const GameControls = ({ brushSettings, onBrushChange, onUndo, onClear, disabled = false }) => {
  const colors = [
    { name: 'Coral', value: '#FF6B6B' },
    { name: 'Turquoise', value: '#4ECDC4' },
    { name: 'Yellow', value: '#FFE66D' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Purple', value: '#686DE0' },
    { name: 'Orange', value: '#F6B93B' }
  ];

  const brushSizes = [2, 4, 6, 8, 12];

  const handleColorChange = (color) => {
    if (disabled) return;
    onBrushChange({ ...brushSettings, color });
  };

  const handleSizeChange = (size) => {
    if (disabled) return;
    onBrushChange({ ...brushSettings, size });
  };

  const handleToolChange = (tool) => {
    if (disabled) return;
    onBrushChange({ 
      ...brushSettings, 
      tool,
      color: tool === 'eraser' ? '#2A2D3A' : '#FF6B6B' // Match surface color for eraser
    });
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`flex-shrink-0 bg-surface/90 backdrop-blur-sm border-t border-white/10 p-4 ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <div className="flex items-center justify-between space-x-6">
        {/* Color Palette */}
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm font-medium">Colors:</span>
          <div className="flex space-x-2">
            {colors.map((color) => (
              <motion.button
                key={color.value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleColorChange(color.value)}
                className={`w-8 h-8 rounded-full shadow-md border-2 ${
                  brushSettings.color === color.value 
                    ? 'border-white scale-110' 
                    : 'border-gray-600 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Brush Size */}
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm font-medium">Size:</span>
          <div className="flex space-x-1">
            {brushSizes.map((size) => (
              <motion.button
                key={size}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSizeChange(size)}
                className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                  brushSettings.size === size
                    ? 'bg-primary border-primary text-white'
                    : 'bg-surface border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
              >
                <div 
                  className="rounded-full bg-current"
                  style={{ 
                    width: `${Math.max(2, size / 2)}px`, 
                    height: `${Math.max(2, size / 2)}px` 
                  }}
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleToolChange('brush')}
            className={`p-2 rounded-lg transition-colors ${
              brushSettings.tool === 'brush'
                ? 'bg-primary text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="Brush"
          >
            <ApperIcon name="Brush" className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleToolChange('eraser')}
            className={`p-2 rounded-lg transition-colors ${
              brushSettings.tool === 'eraser'
                ? 'bg-warning text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="Eraser"
          >
            <ApperIcon name="Eraser" className="w-5 h-5" />
          </motion.button>
        </div>

{/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUndo}
            className="p-2 bg-info hover:bg-info/80 text-white rounded-lg transition-colors"
            title="Undo Last Stroke"
          >
            <ApperIcon name="Undo2" className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
            className="p-2 bg-error hover:bg-error/80 text-white rounded-lg transition-colors"
            title="Clear Canvas"
          >
            <ApperIcon name="Trash2" className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Team Indicator (Multiplayer) */}
        {false && ( // Will be enabled when in multiplayer mode
          <div className="flex items-center space-x-2 px-3 py-2 bg-primary/20 border border-primary/30 rounded-lg">
            <ApperIcon name="Users" className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Team 1</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GameControls;