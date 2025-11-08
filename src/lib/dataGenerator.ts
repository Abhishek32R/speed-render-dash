import { DataPoint } from './types';

const CATEGORIES = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];

export function generateDataPoint(timestamp: number, index: number): DataPoint {
  const category = CATEGORIES[index % CATEGORIES.length];
  const baseValue = 50 + (index % 100);
  const noise = Math.random() * 20 - 10;
  const trend = Math.sin(timestamp / 10000) * 30;
  
  return {
    id: `${timestamp}-${index}`,
    timestamp,
    value: Math.max(0, Math.min(100, baseValue + noise + trend)),
    category,
  };
}

export function generateInitialDataset(count: number): DataPoint[] {
  const now = Date.now();
  const points: DataPoint[] = [];
  
  for (let i = 0; i < count; i++) {
    const timestamp = now - (count - i) * 100;
    points.push(generateDataPoint(timestamp, i));
  }
  
  return points;
}

export function generateRealtimeData(lastTimestamp: number, count: number = 10): DataPoint[] {
  const points: DataPoint[] = [];
  
  for (let i = 0; i < count; i++) {
    const timestamp = lastTimestamp + (i + 1) * 100;
    points.push(generateDataPoint(timestamp, Math.floor(Math.random() * 1000)));
  }
  
  return points;
}
