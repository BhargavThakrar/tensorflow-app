import { createContext } from 'react';

export interface ImageResults {
  images: string[];
  searchResultsFor: string;
}

interface ImageSearchContext {
  imageResults: ImageResults | null;
  error: string | null;
  isLoading: boolean;
  searchImages(searchResultsFor: string, url: string): Promise<void>;
  lazyLoadImages(resImg: HTMLDivElement | null): void;
  resetSearch(): void;
}

export default createContext({} as ImageSearchContext);
