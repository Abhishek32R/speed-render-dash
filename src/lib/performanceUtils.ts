import { PerformanceMetrics } from './types';

export class PerformanceMonitor {
  private frames: number[] = [];
  private lastTime: number = performance.now();
  private renderTimes: number[] = [];
  
  public measureFrame(): void {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.frames.push(delta);
    
    if (this.frames.length > 60) {
      this.frames.shift();
    }
    
    this.lastTime = now;
  }
  
  public measureRenderTime(callback: () => void): void {
    const start = performance.now();
    callback();
    const end = performance.now();
    
    this.renderTimes.push(end - start);
    if (this.renderTimes.length > 60) {
      this.renderTimes.shift();
    }
  }
  
  public getMetrics(dataPoints: number): PerformanceMetrics {
    const avgFrameTime = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    const fps = Math.round(1000 / avgFrameTime);
    const avgRenderTime = this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length;
    
    const memoryUsage = (performance as any).memory 
      ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
      : 0;
    
    return {
      fps: isFinite(fps) ? fps : 60,
      memoryUsage,
      renderTime: avgRenderTime || 0,
      dataProcessingTime: 0,
      dataPoints,
    };
  }
  
  public reset(): void {
    this.frames = [];
    this.renderTimes = [];
    this.lastTime = performance.now();
  }
}
