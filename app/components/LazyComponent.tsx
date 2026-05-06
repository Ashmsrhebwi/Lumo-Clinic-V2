import React, { Suspense, lazy, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface LazyComponentProps {
  factory: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}

export function LazyComponent({ 
  factory, 
  fallback, 
  rootMargin = '50px',
  threshold = 0.1 
}: LazyComponentProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
        }
      },
      { rootMargin, threshold }
    );

    const element = document.getElementById(`lazy-trigger-${Math.random()}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [rootMargin, threshold]);

  React.useEffect(() => {
    if (shouldLoad && !Component) {
      factory().then((module) => {
        setComponent(() => module.default);
      });
    }
  }, [shouldLoad, factory, Component]);

  if (Component) {
    return (
      <Suspense fallback={fallback || <DefaultFallback />}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Component />
        </motion.div>
      </Suspense>
    );
  }

  return (
    <div 
      id={`lazy-trigger-${Math.random()}`}
      style={{ minHeight: '200px' }}
    >
      {fallback || <DefaultFallback />}
    </div>
  );
}

function DefaultFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-8 h-8 text-primary" />
      </motion.div>
    </div>
  );
}

// Higher-order component for lazy loading
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return lazy(importFunc);
}
