import { useCallback, useRef } from 'react';

// Debounce hook for performance optimization
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<number>();

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

// Throttle hook for performance optimization
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastCallRef = useRef<number>(0);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    }
  }, [callback, delay]);
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Map<Element, (entry: IntersectionObserverEntry) => void>>(new Map());

  const observe = useCallback((element: Element, callback: (entry: IntersectionObserverEntry) => void) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach(callback);
      }, options);
    }
    
    elementsRef.current.set(element, callback);
    observerRef.current?.observe(element);
  }, [options]);

  const unobserve = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
      elementsRef.current.delete(element);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
      elementsRef.current.clear();
    }
  }, []);

  return { observe, unobserve, disconnect };
}

// Memoization hook for expensive calculations
export function useMemoized<T>(factory: () => T, deps: React.DependencyList): T {
  const ref = useRef<{ deps: React.DependencyList; value: T }>({
    deps: [],
    value: factory() as T
  });

  if (!ref.current.deps || deps.some((dep, i) => !Object.is(dep, ref.current.deps[i]))) {
    ref.current.deps = deps;
    ref.current.value = factory();
  }

  return ref.current.value;
}
