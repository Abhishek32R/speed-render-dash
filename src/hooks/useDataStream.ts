import { useState, useEffect, useCallback, useRef } from 'react';
import { DataPoint, TimeRange } from '@/lib/types';
import { generateInitialDataset, generateRealtimeData } from '@/lib/dataGenerator';

const MAX_DATA_POINTS = 10000;
const UPDATE_INTERVAL = 100;

export function useDataStream(isStreaming: boolean) {
  const [data, setData] = useState<DataPoint[]>(() => generateInitialDataset(1000));
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const intervalRef = useRef<number>();
  
  const addRealtimeData = useCallback(() => {
    setData((prev) => {
      const lastTimestamp = prev.length > 0 ? prev[prev.length - 1].timestamp : Date.now();
      const newPoints = generateRealtimeData(lastTimestamp, 10);
      const combined = [...prev, ...newPoints];
      
      // Keep only the most recent MAX_DATA_POINTS
      if (combined.length > MAX_DATA_POINTS) {
        return combined.slice(combined.length - MAX_DATA_POINTS);
      }
      
      return combined;
    });
  }, []);
  
  const filterByTimeRange = useCallback((allData: DataPoint[]): DataPoint[] => {
    if (timeRange === 'all') return allData;
    
    const now = Date.now();
    const ranges: Record<TimeRange, number> = {
      '1min': 60 * 1000,
      '5min': 5 * 60 * 1000,
      '15min': 15 * 60 * 1000,
      '1hour': 60 * 60 * 1000,
      'all': Infinity,
    };
    
    const cutoff = now - ranges[timeRange];
    return allData.filter(d => d.timestamp >= cutoff);
  }, [timeRange]);
  
  const filteredData = filterByTimeRange(data);
  
  useEffect(() => {
    if (isStreaming) {
      intervalRef.current = window.setInterval(addRealtimeData, UPDATE_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStreaming, addRealtimeData]);
  
  const reset = useCallback(() => {
    setData(generateInitialDataset(1000));
  }, []);
  
  const increaseDataLoad = useCallback(() => {
    setData((prev) => {
      const newData = generateInitialDataset(Math.min(prev.length + 5000, 50000));
      return newData;
    });
  }, []);
  
  const decreaseDataLoad = useCallback(() => {
    setData((prev) => {
      if (prev.length <= 1000) return prev;
      return prev.slice(Math.max(0, prev.length - 5000));
    });
  }, []);
  
  return {
    data: filteredData,
    totalDataPoints: data.length,
    timeRange,
    setTimeRange,
    reset,
    increaseDataLoad,
    decreaseDataLoad,
  };
}
