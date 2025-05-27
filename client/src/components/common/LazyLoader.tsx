// src/components/common/LazyLoader.tsx
import React, { Suspense } from 'react';

interface LazyLoaderProps {
  children: React.ReactNode;
}

const LazyLoader: React.FC<LazyLoaderProps> = ({ children }) => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center p-8">Loading...</div>}>
      {children}
    </Suspense>
  );
};

export default LazyLoader;