export const isIntersectionObserverSupported = () =>
  'IntersectionObserver' in window;

export const delay = (delayInms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(() => resolve(), delayInms));
};

export const captitalizeFirstChar = (str: string): string => {
  return `${str.charAt(0).toUpperCase()}${str.substr(1, str.length)}`;
};
