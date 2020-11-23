import { captitalizeFirstChar } from './common';

test('#captitalizeFirstChar', () => {
  expect(captitalizeFirstChar('siberian husky')).toEqual('Siberian husky');
  expect(captitalizeFirstChar('eskimo Dog')).toEqual('Eskimo Dog');
  expect(captitalizeFirstChar('Bull Mastiff')).toEqual('Bull Mastiff');
  expect(captitalizeFirstChar('malamute')).toEqual('Malamute');
  expect(captitalizeFirstChar('flat-coated retriever')).toEqual(
    'Flat-coated retriever',
  );
});
