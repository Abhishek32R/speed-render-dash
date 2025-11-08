export interface DataPoint {
  timestamp: number;
  value: number;
  category: string;
  id: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'scatter' | 'heatmap';
  dataKey: string;
  color: string;
  visible: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  dataProcessingTime: number;
  dataPoints: number;
}

export type TimeRange = '1min' | '5min' | '15min' | '1hour' | 'all';

export interface FilterOptions {
  timeRange: TimeRange;
  categories: string[];
  minValue: number;
  maxValue: number;
}
