import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { drawingService } from '@/services';

const DrawingCanvas = ({ drawing, brushSettings, onDrawingUpdate, disabled = false }) => {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const currentStrokeRef = useRef([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Update canvas size
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    
    const size = {
      width: rect.width,
      height: rect.height
    };
    
    setCanvasSize(size);
    
    // Set actual canvas dimensions
    canvas.width = size.width * 2; // Retina/high-DPI support
    canvas.height = size.height * 2;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    
    // Scale context for high-DPI displays
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    
    // Redraw existing strokes
    redrawCanvas();
  }, []);

  // Initialize canvas
  useEffect(() => {
    updateCanvasSize();
    
    const handleResize = () => updateCanvasSize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCanvasSize]);

  // Redraw canvas with all strokes
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !drawing) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    
    // Draw each stroke
    drawing.strokes.forEach(stroke => {
      if (!stroke.points || stroke.points.length < 2) return;
      
      ctx.beginPath();
      ctx.strokeStyle = stroke.color || brushSettings.color;
      ctx.lineWidth = stroke.size || brushSettings.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Draw smooth curves using quadratic bezier
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      
      for (let i = 1; i < stroke.points.length - 1; i++) {
        const point = stroke.points[i];
        const nextPoint = stroke.points[i + 1];
        const midX = (point.x + nextPoint.x) / 2;
        const midY = (point.y + nextPoint.y) / 2;
        
        ctx.quadraticCurveTo(point.x, point.y, midX, midY);
      }
      
      // Draw to the last point
      if (stroke.points.length > 1) {
        const lastPoint = stroke.points[stroke.points.length - 1];
        ctx.lineTo(lastPoint.x, lastPoint.y);
      }
      
      ctx.stroke();
    });
  }, [drawing, canvasSize, brushSettings]);

  // Redraw when drawing changes
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Get coordinates from event
  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const clientX = event.clientX || (event.touches && event.touches[0]?.clientX);
    const clientY = event.clientY || (event.touches && event.touches[0]?.clientY);
    
    if (clientX === undefined || clientY === undefined) return null;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Start drawing
  const startDrawing = async (event) => {
    if (disabled) return;
    
    event.preventDefault();
    const coords = getCoordinates(event);
    if (!coords) return;

    isDrawingRef.current = true;
    lastPointRef.current = coords;
    currentStrokeRef.current = [coords];
  };

  // Continue drawing
  const continueDrawing = async (event) => {
    if (!isDrawingRef.current || disabled) return;
    
    event.preventDefault();
    const coords = getCoordinates(event);
    if (!coords) return;

    // Add smooth interpolation for better lines
    if (lastPointRef.current) {
      const distance = Math.sqrt(
        Math.pow(coords.x - lastPointRef.current.x, 2) + 
        Math.pow(coords.y - lastPointRef.current.y, 2)
      );
      
      // Only add point if moved enough distance (reduces jitter)
      if (distance > 2) {
        currentStrokeRef.current.push(coords);
        lastPointRef.current = coords;
        
        // Draw current stroke immediately for responsiveness
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        ctx.strokeStyle = brushSettings.color;
        ctx.lineWidth = brushSettings.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (currentStrokeRef.current.length >= 2) {
          const prevPoint = currentStrokeRef.current[currentStrokeRef.current.length - 2];
          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          ctx.lineTo(coords.x, coords.y);
          ctx.stroke();
        }
      }
    }
  };

  // End drawing
  const endDrawing = async (event) => {
    if (!isDrawingRef.current || disabled) return;
    
    event.preventDefault();
    isDrawingRef.current = false;
    
    if (currentStrokeRef.current.length > 0) {
      try {
        // Add stroke to drawing service
        const stroke = {
          points: [...currentStrokeRef.current],
          color: brushSettings.color,
          size: brushSettings.size
        };
        
        const updatedDrawing = await drawingService.addStroke(stroke);
        onDrawingUpdate(updatedDrawing);
        
        // Add shimmer effect to the new stroke
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.shadowColor = brushSettings.color;
        ctx.shadowBlur = 10;
        
        setTimeout(() => {
          ctx.shadowBlur = 0;
          redrawCanvas();
        }, 500);
        
      } catch (err) {
        console.error('Failed to add stroke:', err);
      }
    }
    
    currentStrokeRef.current = [];
    lastPointRef.current = null;
  };

  return (
    <div className="absolute inset-0 bg-surface rounded-lg overflow-hidden">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 touch-none ${disabled ? 'cursor-not-allowed opacity-75' : 'cursor-crosshair'}`}
        onMouseDown={startDrawing}
        onMouseMove={continueDrawing}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={continueDrawing}
        onTouchEnd={endDrawing}
        onTouchCancel={endDrawing}
      />
      
      {/* Canvas overlay effects */}
      {disabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-background/30 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <div className="w-8 h-8 bg-secondary rounded-full animate-pulse" />
              </div>
            </motion.div>
            <p className="text-secondary font-medium">AI is thinking...</p>
          </div>
        </motion.div>
      )}
      
      {/* Drawing hints for empty canvas */}
      {(!drawing || drawing.strokes.length === 0) && !disabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center text-gray-500">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-12 h-12 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center mb-3 mx-auto">
                <div className="w-6 h-6 bg-primary rounded-full opacity-50" />
              </div>
            </motion.div>
            <p className="text-sm">Start drawing here!</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DrawingCanvas;