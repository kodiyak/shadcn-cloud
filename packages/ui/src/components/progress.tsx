'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@workspace/ui/lib/utils';

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

interface CircularProgressProps {
  size: number;
  fillColor: string;
  total: number;
  current: number;
  className?: string;
  strokeWidth?: number;
}

const CircularProgress = (props: CircularProgressProps) => {
  const { size, fillColor, total, current, className, strokeWidth = 6 } = props;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (current / total) * circumference;
  const halfSize = size / 2;

  const commonParams = {
    cx: halfSize,
    cy: halfSize,
    r: radius,
    fill: 'none',
    strokeWidth,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      <circle {...commonParams} className="stroke-accent" />
      <circle
        {...commonParams}
        stroke={fillColor}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        transform={`rotate(-90 ${halfSize} ${halfSize})`}
        strokeLinecap="round"
      />
    </svg>
  );
};

export { Progress, CircularProgress };
