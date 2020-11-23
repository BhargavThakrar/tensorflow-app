interface LoadingState {
  isLoading: boolean;
  loadingText: null | string;
}

// Action types
export const UPLOADING = 'UPLOADING';
export const IDENTIFYING = 'IDENTIFYING';
export const CLEAR = 'CLEAR';

type LoadingActionTypes =
  | {
      type: typeof UPLOADING;
    }
  | {
      type: typeof IDENTIFYING;
    }
  | {
      type: typeof CLEAR;
    };

export const initialLoaderState: LoadingState = {
  isLoading: true,
  loadingText: 'Loading model...',
};

export const loaderReducer = (
  state: LoadingState,
  action: LoadingActionTypes,
): LoadingState => {
  switch (action.type) {
    case UPLOADING:
      return {
        isLoading: true,
        loadingText: 'Uploading image...',
      };
    case IDENTIFYING:
      return {
        isLoading: true,
        loadingText: 'Identifying breed...',
      };
    case CLEAR:
      return {
        isLoading: false,
        loadingText: null,
      };
    default:
      return state;
  }
};
