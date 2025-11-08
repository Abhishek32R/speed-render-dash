import { useState, useEffect, useRef } from 'react';
import { PerformanceMetrics } from '@/lib/types';
import { PerformanceMonitor } from '@/lib/performanceUtils';

export function usePerformanceMonitor(dataPoints: number) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    dataProcessingTime: 0,
    dataPoints: 0,
  });
  
  const monitorRef = useRef<PerformanceMonitor>(new PerformanceMonitor());
  
  useEffect(() => {
    const monitor = monitorRef.current;
    let frameId: number;
    
    const updateMetrics = () => {
      monitor.measureFrame();
      setMetrics(monitor.getMetrics(dataPoints));
      frameId = requestAnimationFrame(updateMetrics);
    };
    
    frameId = requestAnimationFrame(updateMetrics);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [dataPoints]);
  
  return metrics;
}
