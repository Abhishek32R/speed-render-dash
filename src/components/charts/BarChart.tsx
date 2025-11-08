import { useRef, useEffect, memo } from 'react';
import { DataPoint } from '@/lib/types';
import { setupCanvas, clearCanvas, getCanvasContext } from '@/lib/canvasUtils';
import { Card } from '../ui/card';

interface BarChartProps {
  data: DataPoint[];
  title: string;
}

export const BarChart = memo(({ data, title }: BarChartProps) => {
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
    
    const render = () => {
      clearCanvas(ctx, width, height);
      
      // Aggregate by category
      const categoryData = new Map<string, number[]>();
      data.forEach(point => {
        if (!categoryData.has(point.category)) {
          categoryData.set(point.category, []);
        }
        categoryData.get(point.category)!.push(point.value);
      });
      
      const aggregated = Array.from(categoryData.entries()).map(([category, values]) => ({
        category,
        average: values.reduce((a, b) => a + b, 0) / values.length,
      }));
      
      const maxValue = Math.max(...aggregated.map(d => d.average));
      const padding = 40;
      const chartHeight = height - padding * 2;
      const barWidth = (width - padding * 2) / aggregated.length;
      
      // Draw bars
      const colors = [
        'hsl(217, 91%, 60%)',
        'hsl(142, 76%, 36%)',
        'hsl(38, 92%, 50%)',
        'hsl(280, 80%, 60%)',
        'hsl(340, 75%, 55%)',
      ];
      
      aggregated.forEach((item, index) => {
        const barHeight = (item.average / maxValue) * chartHeight;
        const x = padding + index * barWidth + barWidth * 0.1;
        const y = height - padding - barHeight;
        
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);
        
        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.category, x + barWidth * 0.4, height - padding + 15);
        ctx.fillText(item.average.toFixed(1), x + barWidth * 0.4, y - 5);
      });
      
      // Draw axis
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.stroke();
    };
    
    render();
  }, [data]);
  
  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
      <h3 className="text-sm font-semibold mb-3 text-foreground">{title}</h3>
      <div ref={containerRef} className="w-full">
        <canvas ref={canvasRef} className="w-full" />
      </div>
    </Card>
  );
});

BarChart.displayName = 'BarChart';
