import React, { useState, useCallback } from 'react';

import imageSearchContext, { ImageResults } from '../../contexts/imageSearchContext';
import { request } from '../../lib/request';
import { isIntersectionObserverSupported } from '../../utils/common';

type ImageProviderProps = {
  children: React.ReactNode,
}

function ImageProvider({ children }: ImageProviderProps) {
  const [imageResults, setImageResults] = useState<ImageResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const searchImages = useCallback(async (searchResultsFor: string, url: string): Promise<void> => {
    setError(null);
    setImageResults(null);
    setLoading(true);
    
    try {
      const { data, error } = await request(url);
      
      if (error) {
        setError(error);
        return;
      }
      
      setImageResults({
        images: data.message,
        searchResultsFor
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const lazyLoadImages = useCallback((resImg: HTMLDivElement): void => {
    if (resImg) {
      const lazyImages = [].slice.call(resImg.querySelectorAll("img.lazy"));

      /**
       * Since we are targetting modern browsers for now, I have not implemented the fallback of intersection observer.
       * We could use the polyfill or implement the traditional scroll events to lazy load images here.
       */
      if (isIntersectionObserverSupported()) {
        let lazyImageObserver = new IntersectionObserver(function(entries: IntersectionObserverEntry[]) {
          entries.forEach(function(entry: IntersectionObserverEntry) {
            if (entry.isIntersecting) {
              let lazyImage = entry.target as HTMLImageElement;
              lazyImage.src = lazyImage.dataset.src!;
              lazyImage.classList.remove("lazy");
              lazyImageObserver.unobserve(lazyImage);
            }
          });
        });
    
        lazyImages.forEach(function(lazyImage) {
          lazyImageObserver.observe(lazyImage);
        });

        return;
      }
    }
  }, []);

  const resetSearch = useCallback((): void => {
    setImageResults(null);
    setError(null);
    setLoading(false);
  }, []);

  const contextValue = {
    imageResults,
    error,
    isLoading,
    searchImages,
    lazyLoadImages,
    resetSearch,
  };

  return <imageSearchContext.Provider value={contextValue}>{children}</imageSearchContext.Provider>;
}

export default ImageProvider;
