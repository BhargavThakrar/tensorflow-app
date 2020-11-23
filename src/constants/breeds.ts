export const BREEDS_API_HOST = 'https://dog.ceo/api/breed';

/**
 * This map is to figure out the API input to find similar images.
 * Some breed names from the tensorflow model cannot be directly mapped to DOG API requests
 * so, this is an exception list where we maintain this mapping between breed name inconsistencies.
 *
 * This is not the exhaustive list for now, and
 * there could be quite a few missing from this list so it could happen that for some breeds dog API fails
 * to return the images.
 */
export const BREED_NAME_TO_INPUT_NAME = [
  {
    pattern: /siberian.*husky/,
    input: 'husky',
  },
  {
    pattern: /.*eskimo.*/,
    input: 'eskimo',
  },
  {
    pattern: /english.*hound/,
    input: 'hound/english',
  },
  {
    pattern: /blood.*hound/,
    input: 'hound/blood',
  },
  {
    pattern: /flat.*coated.*retriever/,
    input: 'retriever/flatcoated',
  },
  {
    pattern: /american.*staffordshire.*terrier/,
    input: 'terrier/american',
  },
  {
    pattern: /bernese.*mountain.*/,
    input: 'mountain/bernese',
  },
];
