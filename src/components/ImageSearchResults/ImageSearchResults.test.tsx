import React, { useEffect } from 'react';
import { act, render, cleanup, RenderResult } from '@testing-library/react';

import ImageSearchProvider from '../../providers/ImageSearchProvider';
import ImaageSearchResults from './ImaageSearchResults';
import { request } from '../../lib/request';
import useImageSearch from '../../hooks/useImageSearch';
import { setupIntersectionObserverMock, intersectionCallback } from '../../testUtils/intersectionObserver';
import { imageSearchData } from '../../testUtils/mockData';
import { BREEDS_API_HOST } from '../../constants/breeds';

jest.mock('../../lib/request');

function TestComponent() {
  const { searchImages } = useImageSearch();

  useEffect(() => {
    searchImages('Siberian husky', `${BREEDS_API_HOST}/husky/images`);
  }, [searchImages]);

  return (<ImaageSearchResults />);
}

const observe = jest.fn();
const entries: Element[] = [];

beforeEach(async () => {
  observe.mockImplementation((element: Element) => entries.push(element));
  setupIntersectionObserverMock({ observe });
});

afterEach(() => {
  cleanup();
  (request as jest.Mock).mockReset();
  observe.mockReset();
  entries.length = 0;
});

test('Should render search results', async () => {
  (request as jest.Mock).mockImplementationOnce(() => Promise.resolve({
    statusCode: 200,
    data: {
      message: imageSearchData,
      status: "success"
    },
    error: null,
  }));

  let testRender = {} as RenderResult;

  await act(async () => {
    testRender = render(
      <ImageSearchProvider>
        <TestComponent />
      </ImageSearchProvider>
    );
  });

  const { getAllByRole } = testRender;
  
  intersectionCallback(entries.map((entry: Element) => (
    {
      isIntersecting: true,
      target: entry
    } as IntersectionObserverEntry
  )));
  
  const images = getAllByRole('img') as HTMLImageElement[];
  
  expect(images.length).toEqual(imageSearchData.length);
  
  imageSearchData.forEach((imageUrl: string, index: number) => {
    expect(images[index].src).toEqual(imageUrl);  
  });
});

test('Should lazy load images', async () => {
  (request as jest.Mock).mockImplementation(() => Promise.resolve({
    statusCode: 200,
    data: {
      message: imageSearchData,
      status: "success"
    },
    error: null,
  }));

  let testRender = {} as RenderResult;

  await act(async () => {
    testRender = render(
      <ImageSearchProvider>
        <TestComponent />
      </ImageSearchProvider>
    );
  });

  const { getAllByRole } = testRender;
  const images = getAllByRole('img') as HTMLImageElement[];
  
  expect(images.length).toEqual(imageSearchData.length);

  // First three image are visible
  const imagesFirstVisible = 3;
  intersectionCallback(entries.map((entry: Element, index: number) => (
    {
      isIntersecting: (index < imagesFirstVisible) ? true : false,
      target: entry
    } as IntersectionObserverEntry
  )));
  
  imageSearchData.slice(0, 3).forEach((imageUrl: string, index: number) => {
    expect(images[index].src).toEqual(imageUrl);
  });

  imageSearchData.slice(3, imageSearchData.length).forEach((imageUrl: string, index: number) => {
    // Rest all images should have default image
    expect(images[imagesFirstVisible + index].src).toMatch(/loading-img.jpg/);
  });

  // All the images should be visible now
  intersectionCallback(entries.map((entry: Element) => (
    {
      isIntersecting: true,
      target: entry
    } as IntersectionObserverEntry
  )));

  imageSearchData.forEach((imageUrl: string, index: number) => {
    expect(images[index].src).toEqual(imageUrl);  
  });
});

test('Should render error', async () => {
  const errorMessage = 'Invalid breed name provided';

  (request as jest.Mock).mockImplementation(() => Promise.resolve({
    statusCode: 400,
    data: null,
    error: errorMessage,
  }));

  let testRender = {} as RenderResult;

  await act(async () => {
    testRender = render(
      <ImageSearchProvider>
        <TestComponent />
      </ImageSearchProvider>
    );
  });

  const { getByRole } = testRender;
  
  expect(getByRole('alert').textContent).toMatch(errorMessage);
});
