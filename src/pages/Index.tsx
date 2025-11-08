import { useState } from 'react';
import { useDataStream } from '@/hooks/useDataStream';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { DashboardControls } from '@/components/DashboardControls';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { ScatterPlot } from '@/components/charts/ScatterPlot';
import { Heatmap } from '@/components/charts/Heatmap';
import { Activity } from 'lucide-react';

const Index = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  
  const {
    data,
    totalDataPoints,
    timeRange,
    setTimeRange,
    reset,
    increaseDataLoad,
    decreaseDataLoad,
  } = useDataStream(isStreaming);
  
  const metrics = usePerformanceMonitor(totalDataPoints);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-primary/10">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Performance Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time data visualization with 10,000+ points at 60fps
            </p>
          </div>
        </div>
        
        {/* Performance Monitor */}
        <PerformanceMonitor metrics={metrics} />
        
        {/* Controls */}
        <DashboardControls
          isStreaming={isStreaming}
          onToggleStreaming={() => setIsStreaming(!isStreaming)}
          onReset={reset}
          onIncreaseLoad={increaseDataLoad}
          onDecreaseLoad={decreaseDataLoad}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChart 
            data={data} 
            title="Real-time Line Chart" 
            color="hsl(217, 91%, 60%)"
          />
          <BarChart 
            data={data} 
            title="Category Aggregation Bar Chart"
          />
          <ScatterPlot 
            data={data} 
            title="Multi-category Scatter Plot"
          />
          <Heatmap 
            data={data} 
            title="Data Density Heatmap"
          />
        </div>
        
        {/* Info Footer */}
        <div className="mt-8 p-4 rounded-lg bg-card/30 border border-border/50 text-sm text-muted-foreground">
          <p className="font-semibold mb-2 text-foreground">Performance Optimization Techniques:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Canvas rendering with requestAnimationFrame for smooth 60fps updates</li>
            <li>React.memo and useMemo for preventing unnecessary re-renders</li>
            <li>Data sampling for scatter plots with large datasets</li>
            <li>Sliding window pattern to maintain memory efficiency</li>
            <li>Device pixel ratio handling for crisp rendering on all screens</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
