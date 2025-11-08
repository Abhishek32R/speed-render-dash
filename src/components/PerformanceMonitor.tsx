import { memo } from 'react';
import { PerformanceMetrics } from '@/lib/types';
import { Card } from './ui/card';

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics;
}

export const PerformanceMonitor = memo(({ metrics }: PerformanceMonitorProps) => {
  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'text-accent';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-destructive';
  };
  
  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
      <h3 className="text-sm font-semibold mb-3 text-foreground">Performance Metrics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">FPS</p>
          <p className={`text-2xl font-bold ${getFpsColor(metrics.fps)}`}>
            {metrics.fps}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Memory</p>
          <p className="text-2xl font-bold text-chart-1">
            {metrics.memoryUsage}
            <span className="text-sm ml-1">MB</span>
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Render Time</p>
          <p className="text-2xl font-bold text-chart-2">
            {metrics.renderTime.toFixed(1)}
            <span className="text-sm ml-1">ms</span>
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Data Points</p>
          <p className="text-2xl font-bold text-chart-3">
            {metrics.dataPoints.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';
