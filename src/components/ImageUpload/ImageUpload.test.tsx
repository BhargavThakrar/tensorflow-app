import React from 'react';
import { act, render, cleanup, fireEvent, waitFor, RenderResult } from '@testing-library/react';
import * as mobilenet from '@tensorflow-models/mobilenet';

import ImageSearchProvider from '../../providers/ImageSearchProvider';
import ImageUpload from './ImageUpload';
import { predictions } from '../../testUtils/mockData';
import { formatPredictions, formatBreedNameForApiSearch } from '../../utils/breeds';
import { request } from '../../lib/request';
import { BREEDS_API_HOST } from '../../constants/breeds';

jest.mock('../../lib/request');
jest.mock('@tensorflow-models/mobilenet', () => ({
  load: jest.fn(),
}));

let testRender = {} as RenderResult;
const file = {name: 'husky.png', type: 'image/png'};
const formattedPredictions = formatPredictions(predictions) || [];

beforeEach(async () => {
  global.URL.createObjectURL = jest.fn();
  (URL.createObjectURL as jest.Mock).mockImplementationOnce(({ name }) => `https://localhost/${name}`);

  const classify = jest.fn();
  (mobilenet.load as jest.Mock).mockImplementation(() => {
    return Promise.resolve({
      classify
    })
  });

  (classify as jest.Mock).mockImplementation(() => Promise.resolve(predictions));

  await act(async () => {
    testRender = render(
      <ImageSearchProvider>
        <ImageUpload />
      </ImageSearchProvider>
    );
  });

  const { getByRole } = testRender;
  await act(async () => {
    fireEvent.change(getByRole('button').querySelector('input') as HTMLInputElement, { target: { files: [file] } });
  });
});

afterEach(() => {
  cleanup();
  (request as jest.Mock).mockReset();
  (mobilenet.load as jest.Mock).mockReset();
  testRender = {} as RenderResult;
});

test('Should upload image', async () => {
  const { getByAltText } = testRender;

  await waitFor(() => getByAltText('dog breed preview'));
  const imageURL = (getByAltText('dog breed preview') as HTMLImageElement).src;

  expect(imageURL).toEqual(`https://localhost/${file.name}`);
});

test('Should render predictions', async () => {
  const { getByAltText, getByRole } = testRender;

  await waitFor(() => getByAltText('dog breed preview'));
  
  await act(async () => {
    fireEvent.load(getByAltText('dog breed preview'));
  });

  const list = getByRole('list'); 

  expect(list.children.length).toEqual(predictions.length);

  [].slice.call(list.children).forEach((item: HTMLLIElement, index: number) => {
    const { className, probability } = formattedPredictions[index];
    expect(item.textContent).toMatch(`${className} (${probability}%)Find similar images`);
  })
});

test('Should call image search api with correct bred name', async () => {
  const { getByAltText, getAllByRole } = testRender;

  await waitFor(() => getByAltText('dog breed preview'));
  
  await act(async () => {
    fireEvent.load(getByAltText('dog breed preview'));
  });

  await act(async () => {
    fireEvent.click(getAllByRole('link')[0]);
  });

  expect(request).toHaveBeenCalledWith(
    `${BREEDS_API_HOST}/${formatBreedNameForApiSearch(formattedPredictions[0].className)}/images`
  );

  await act(async () => {
    fireEvent.click(getAllByRole('link')[1]);
  });

  expect(request).toHaveBeenCalledWith(
    `${BREEDS_API_HOST}/${formatBreedNameForApiSearch(formattedPredictions[1].className)}/images`
  );

  await act(async () => {
    fireEvent.click(getAllByRole('link')[2]);
  });

  expect(request).toHaveBeenCalledWith(
    `${BREEDS_API_HOST}/${formatBreedNameForApiSearch(formattedPredictions[2].className)}/images`
  );
});
