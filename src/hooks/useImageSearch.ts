import { useContext } from 'react';

import imageSearchContext from '../contexts/imageSearchContext';

const useImageSearch = () => useContext(imageSearchContext);

export default useImageSearch;
