import * as React from 'react';

import { cn } from '../ui/utils';

type PageShellProps = React.ComponentProps<'div'> & {
  variant?: 'default' | 'contained';
};

export function PageShell({ className, variant = 'default', ...props }: PageShellProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-background',
        variant === 'contained' && 'pt-20',
        className,
      )}
      {...props}
    />
  );
}

