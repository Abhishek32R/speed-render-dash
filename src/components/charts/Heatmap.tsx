import { useRef, useEffect, memo, useMemo } from 'react';
import { DataPoint } from '@/lib/types';
import { setupCanvas, clearCanvas, getCanvasContext } from '@/lib/canvasUtils';
import { Card } from '../ui/card';

interface HeatmapProps {
  data: DataPoint[];
  title: string;
}

export const Heatmap = memo(({ data, title }: HeatmapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const heatmapData = useMemo(() => {
    const gridSize = 20;
    const grid: number[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
    const counts: number[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
    
    const minValue = Math.min(...data.map(d => d.value));
    const maxValue = Math.max(...data.map(d => d.value));
    const valueRange = maxValue - minValue || 1;
    
    data.forEach((point, index) => {
      const x = Math.floor((index % data.length) / data.length * gridSize);
      const y = Math.floor(((point.value - minValue) / valueRange) * gridSize);
      
      const clampedX = Math.min(gridSize - 1, Math.max(0, x));
      const clampedY = Math.min(gridSize - 1, Math.max(0, y));
      
      grid[clampedY][clampedX] += point.value;
      counts[clampedY][clampedX]++;
    });
    
    // Calculate averages
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (counts[y][x] > 0) {
          grid[y][x] /= counts[y][x];
        }
      }
    }
    
    return grid;
  }, [data]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = 300;
    
    setupCanvas(canvas, width, height);
    const ctx = getCanvasContext(canvas);
    
    const render = () => {
      clearCanvas(ctx, width, height);
      
      const gridSize = heatmapData.length;
      const cellWidth = width / gridSize;
      const cellHeight = height / gridSize;
      
      // Find max value for color scaling
      const maxVal = Math.max(...heatmapData.flat());
      
      // Draw heatmap
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const value = heatmapData[y][x];
          const intensity = maxVal > 0 ? value / maxVal : 0;
          
          // Color gradient from blue to red
          const hue = (1 - intensity) * 240;
          ctx.fillStyle = `hsl(${hue}, 80%, ${40 + intensity * 20}%)`;
          ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1);
        }
      }
      
      // Color scale legend
      const legendWidth = 20;
      const legendHeight = height - 40;
      const legendX = width - 35;
      const legendY = 20;
      
      for (let i = 0; i < legendHeight; i++) {
        const intensity = 1 - (i / legendHeight);
        const hue = intensity * 240;
        ctx.fillStyle = `hsl(${hue}, 80%, ${40 + intensity * 20}%)`;
        ctx.fillRect(legendX, legendY + i, legendWidth, 1);
      }
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.strokeRect(legendX, legendY, legendWidth, legendHeight);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '10px sans-serif';
      ctx.fillText('High', legendX - 5, legendY - 5);
      ctx.fillText('Low', legendX - 5, legendY + legendHeight + 12);
    };
    
    render();
  }, [heatmapData]);
  
  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
      <h3 className="text-sm font-semibold mb-3 text-foreground">{title}</h3>
      <div ref={containerRef} className="w-full">
        <canvas ref={canvasRef} className="w-full" />
      </div>
    </Card>
  );
});

Heatmap.displayName = 'Heatmap';
