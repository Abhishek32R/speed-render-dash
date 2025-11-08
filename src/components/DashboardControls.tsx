import { memo } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { TimeRange } from '@/lib/types';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

interface DashboardControlsProps {
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onReset: () => void;
  onIncreaseLoad: () => void;
  onDecreaseLoad: () => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '1min', label: '1 Min' },
  { value: '5min', label: '5 Min' },
  { value: '15min', label: '15 Min' },
  { value: '1hour', label: '1 Hour' },
  { value: 'all', label: 'All' },
];

export const DashboardControls = memo(({
  isStreaming,
  onToggleStreaming,
  onReset,
  onIncreaseLoad,
  onDecreaseLoad,
  timeRange,
  onTimeRangeChange,
}: DashboardControlsProps) => {
  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onToggleStreaming}
            variant={isStreaming ? 'destructive' : 'default'}
            size="sm"
            className="gap-2"
          >
            {isStreaming ? (
              <>
                <Pause className="h-4 w-4" />
                Pause Stream
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Stream
              </>
            )}
          </Button>
          <Button onClick={onReset} variant="outline" size="sm" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={onIncreaseLoad} variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add 5k Points
          </Button>
          <Button onClick={onDecreaseLoad} variant="outline" size="sm" className="gap-2">
            <Minus className="h-4 w-4" />
            Remove 5k Points
          </Button>
        </div>
        
        <div className="flex gap-1">
          {TIME_RANGES.map((range) => (
            <Button
              key={range.value}
              onClick={() => onTimeRangeChange(range.value)}
              variant={timeRange === range.value ? 'default' : 'outline'}
              size="sm"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
});

DashboardControls.displayName = 'DashboardControls';
