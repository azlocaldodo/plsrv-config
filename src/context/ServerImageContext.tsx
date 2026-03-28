import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';

export interface ModelImages {
  front: string;
  rear: string;
}

type ServerImageState = Record<string, ModelImages>;

type ServerImageAction =
  | { type: 'SET_MODEL_IMAGES'; payload: { modelId: string; images: ModelImages } }
  | { type: 'RESET_MODEL_IMAGES'; payload: { modelId: string } };

const SERVER_IMAGES_STORAGE_KEY = 'primeline-configurator-server-images';

export const defaultModelImages: ServerImageState = {
  'A1E15-12': {
    front: '/server-front.svg',
    rear: '/server-rear.svg',
  },
};

function serverImageReducer(state: ServerImageState, action: ServerImageAction): ServerImageState {
  switch (action.type) {
    case 'SET_MODEL_IMAGES':
      return {
        ...state,
        [action.payload.modelId]: action.payload.images,
      };
    case 'RESET_MODEL_IMAGES':
      return {
        ...state,
        [action.payload.modelId]: defaultModelImages[action.payload.modelId] || { front: '', rear: '' },
      };
    default:
      return state;
  }
}

function loadImagesFromStorage(): ServerImageState {
  try {
    const raw = localStorage.getItem(SERVER_IMAGES_STORAGE_KEY);
    if (!raw) return defaultModelImages;

    const parsed = JSON.parse(raw) as ServerImageState;
    return {
      ...defaultModelImages,
      ...parsed,
    };
  } catch {
    return defaultModelImages;
  }
}

function saveImagesToStorage(state: ServerImageState): void {
  try {
    localStorage.setItem(SERVER_IMAGES_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore persistence failures to keep UI functional.
  }
}

interface ServerImageContextType {
  imageState: ServerImageState;
  setModelImages: (modelId: string, images: ModelImages) => void;
  resetModelImages: (modelId: string) => void;
  getModelImages: (modelId: string) => ModelImages;
}

const ServerImageContext = createContext<ServerImageContextType | undefined>(undefined);

export function ServerImageProvider({ children }: { children: ReactNode }) {
  const [imageState, dispatch] = useReducer(serverImageReducer, defaultModelImages, loadImagesFromStorage);

  useEffect(() => {
    saveImagesToStorage(imageState);
  }, [imageState]);

  const value = useMemo<ServerImageContextType>(() => {
    return {
      imageState,
      setModelImages: (modelId, images) => dispatch({ type: 'SET_MODEL_IMAGES', payload: { modelId, images } }),
      resetModelImages: (modelId) => dispatch({ type: 'RESET_MODEL_IMAGES', payload: { modelId } }),
      getModelImages: (modelId) => imageState[modelId] || defaultModelImages[modelId] || { front: '', rear: '' },
    };
  }, [imageState]);

  return <ServerImageContext.Provider value={value}>{children}</ServerImageContext.Provider>;
}

export function useServerImages() {
  const context = useContext(ServerImageContext);
  if (!context) {
    throw new Error('useServerImages must be used within a ServerImageProvider');
  }
  return context;
}
