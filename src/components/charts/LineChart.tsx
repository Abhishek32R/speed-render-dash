import { useRef, useEffect, memo } from 'react';
import { DataPoint } from '@/lib/types';
import { setupCanvas, clearCanvas, getCanvasContext, drawGrid } from '@/lib/canvasUtils';
import { Card } from '../ui/card';

interface LineChartProps {
  data: DataPoint[];
  title: string;
  color?: string;
}

export const LineChart = memo(({ data, title, color = 'hsl(217, 91%, 60%)' }: LineChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || data.length === 0) return;
    
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = 300;
    
    setupCanvas(canvas, width, height);
    const ctx = getCanvasContext(canvas);
    
    let animationId: number;
    
    const render = () => {
      clearCanvas(ctx, width, height);
      drawGrid(ctx, width, height);
      
      // Calculate scales
      const minValue = Math.min(...data.map(d => d.value));
      const maxValue = Math.max(...data.map(d => d.value));
      const valueRange = maxValue - minValue || 1;
      
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      
      // Draw axes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.stroke();
      
      // Draw line
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      data.forEach((point, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = height - padding - ((point.value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw points for performance testing (only if less than 1000 points)
      if (data.length < 1000) {
        ctx.fillStyle = color;
        data.forEach((point, index) => {
          const x = padding + (index / (data.length - 1)) * chartWidth;
          const y = height - padding - ((point.value - minValue) / valueRange) * chartHeight;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      
      // Draw labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '12px sans-serif';
      ctx.fillText(`Min: ${minValue.toFixed(1)}`, 5, height - 5);
      ctx.fillText(`Max: ${maxValue.toFixed(1)}`, 5, 15);
      ctx.fillText(`Points: ${data.length}`, width - 100, height - 5);
    };
    
    render();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [data, color]);
  
  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
      <h3 className="text-sm font-semibold mb-3 text-foreground">{title}</h3>
      <div ref={containerRef} className="w-full">
        <canvas ref={canvasRef} className="w-full" />
      </div>
    </Card>
  );
});

LineChart.displayName = 'LineChart';
