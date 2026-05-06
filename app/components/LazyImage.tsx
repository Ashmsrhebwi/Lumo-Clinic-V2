import React, { useState, useRef, useEffect } from 'react';
import { m } from 'motion/react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  loading?: 'lazy' | 'eager';
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/placeholder.jpg',
  loading = 'lazy'
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.01, rootMargin: '100px' } 
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted/20 animate-pulse mix-blend-multiply" />
      )}
      {isInView && (
        <m.img
          src={hasError ? placeholder : src}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className={`w-full h-full object-cover transition-opacity ${hasError ? 'opacity-50' : ''}`}
        />
      )}
    </div>
  );
}
