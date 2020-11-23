import { formatPredictions, formatBreedNameForApiSearch } from './breeds';
import Prediction from '../components/ImageUpload/PredictionModel';
import { predictions } from '../testUtils/mockData';

test('#formatPredictions', () => {
  expect(formatPredictions({} as Prediction[])).toEqual(null);
  expect(formatPredictions([] as Prediction[])).toEqual(null);

  expect(formatPredictions(predictions)).toEqual([
    {
      className: 'Siberian husky',
      probability: 33.37,
    },
    {
      className: 'Eskimo dog',
      probability: 29.06,
    },
    {
      className: 'Malamute',
      probability: 25.49,
    },
  ]);
});

test('#formatBreedNameForApiSearch', () => {
  expect(formatBreedNameForApiSearch('Siberian husky')).toEqual('husky');
  expect(formatBreedNameForApiSearch('Eskimo dog')).toEqual('eskimo');
  expect(formatBreedNameForApiSearch('English foxhound')).toEqual(
    'hound/english',
  );
  expect(formatBreedNameForApiSearch('Bull Mastiff')).toEqual('mastiff/bull');
  expect(formatBreedNameForApiSearch('Blood hound')).toEqual('hound/blood');
  expect(formatBreedNameForApiSearch('Flat-coated retriever')).toEqual(
    'retriever/flatcoated',
  );
});
