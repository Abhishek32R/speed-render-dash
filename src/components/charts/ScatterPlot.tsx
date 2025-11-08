import { useRef, useEffect, memo, useMemo } from 'react';
import { DataPoint } from '@/lib/types';
import { setupCanvas, clearCanvas, getCanvasContext, drawGrid } from '@/lib/canvasUtils';
import { Card } from '../ui/card';

interface ScatterPlotProps {
  data: DataPoint[];
  title: string;
}

export const ScatterPlot = memo(({ data, title }: ScatterPlotProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Sample data for better performance with large datasets
  const sampledData = useMemo(() => {
    if (data.length <= 2000) return data;
    const step = Math.ceil(data.length / 2000);
    return data.filter((_, i) => i % step === 0);
  }, [data]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || sampledData.length === 0) return;
    
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = 300;
    
    setupCanvas(canvas, width, height);
    const ctx = getCanvasContext(canvas);
    
    const render = () => {
      clearCanvas(ctx, width, height);
      drawGrid(ctx, width, height);
      
      const minValue = Math.min(...sampledData.map(d => d.value));
      const maxValue = Math.max(...sampledData.map(d => d.value));
      const valueRange = maxValue - minValue || 1;
      
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      
      // Category colors
      const categoryColors = new Map<string, string>();
      const colors = [
        'hsl(217, 91%, 60%)',
        'hsl(142, 76%, 36%)',
        'hsl(38, 92%, 50%)',
        'hsl(280, 80%, 60%)',
        'hsl(340, 75%, 55%)',
      ];
      
      sampledData.forEach(point => {
        if (!categoryColors.has(point.category)) {
          categoryColors.set(point.category, colors[categoryColors.size % colors.length]);
        }
      });
      
      // Draw points
      sampledData.forEach((point, index) => {
        const x = padding + (index / (sampledData.length - 1)) * chartWidth;
        const y = height - padding - ((point.value - minValue) / valueRange) * chartHeight;
        
        ctx.fillStyle = categoryColors.get(point.category)!;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;
      
      // Draw axes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.stroke();
      
      // Legend
      let legendY = 20;
      ctx.font = '11px sans-serif';
      Array.from(categoryColors.entries()).forEach(([category, color]) => {
        ctx.fillStyle = color;
        ctx.fillRect(width - 100, legendY, 12, 12);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(category, width - 85, legendY + 10);
        legendY += 18;
      });
    };
    
    render();
  }, [sampledData]);
  
  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
      <h3 className="text-sm font-semibold mb-3 text-foreground">{title}</h3>
      <div ref={containerRef} className="w-full">
        <canvas ref={canvasRef} className="w-full" />
      </div>
    </Card>
  );
});

ScatterPlot.displayName = 'ScatterPlot';
