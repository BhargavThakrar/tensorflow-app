import { captitalizeFirstChar } from './common';
import { BREED_NAME_TO_INPUT_NAME } from '../constants/breeds';
import Prediction from '../components/ImageUpload/PredictionModel';

const getBreedNameFromPrediction = (breedName: string): string | null => {
  if (typeof breedName !== 'string') {
    return null;
  }

  if (breedName.indexOf(',') !== -1) {
    return captitalizeFirstChar(breedName.split(',')[0]);
  }

  return captitalizeFirstChar(breedName);
};

export const formatPredictions = (
  predictions: Prediction[],
): Prediction[] | null => {
  if (Array.isArray(predictions) && predictions.length) {
    return predictions.map(
      ({ className, probability }: Prediction): Prediction => {
        return {
          className: getBreedNameFromPrediction(className)!,
          probability: parseFloat((probability * 100).toFixed(2)),
        };
      },
    );
  }

  return null;
};

export const formatBreedNameForApiSearch = (breedName: string): string => {
  const inputBreed = breedName.toLowerCase();

  for (let i = 0; i < BREED_NAME_TO_INPUT_NAME.length; i++) {
    const { pattern, input } = BREED_NAME_TO_INPUT_NAME[i];

    if (pattern.test(inputBreed)) {
      return input;
    }
  }

  const splitWords = inputBreed.split(' ') || [];

  if (splitWords.length) {
    return splitWords
      .reduce((acc: string[], word: string) => {
        acc.unshift(word);
        return acc;
      }, [])
      .join('/');
  }

  return inputBreed;
};
