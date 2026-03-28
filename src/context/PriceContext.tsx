import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { PriceState, PriceAction } from './types';
import { defaultPrices, PRICES_STORAGE_KEY } from '../data/defaultPrices';

// Initial price state
const initialPriceState: PriceState = {
  prices: { ...defaultPrices },
  lastUpdated: new Date().toISOString(),
  currency: 'EUR',
};

// Load prices from localStorage
function loadPricesFromStorage(): PriceState {
  try {
    const stored = localStorage.getItem(PRICES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...initialPriceState,
        prices: { ...defaultPrices, ...parsed.prices },
        lastUpdated: parsed.lastUpdated || new Date().toISOString(),
      };
    }
  } catch (e) {
    console.error('Failed to load prices from localStorage:', e);
  }
  return initialPriceState;
}

// Save prices to localStorage
function savePricesToStorage(state: PriceState): void {
  try {
    localStorage.setItem(PRICES_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save prices to localStorage:', e);
  }
}

// Reducer function
function priceReducer(state: PriceState, action: PriceAction): PriceState {
  switch (action.type) {
    case 'SET_PRICE':
      return {
        ...state,
        prices: {
          ...state.prices,
          [action.payload.articleNumber]: action.payload.price,
        },
        lastUpdated: new Date().toISOString(),
      };
    case 'SET_PRICES':
      return {
        ...state,
        prices: action.payload,
        lastUpdated: new Date().toISOString(),
      };
    case 'IMPORT_PRICES':
      return {
        ...state,
        prices: { ...state.prices, ...action.payload },
        lastUpdated: new Date().toISOString(),
      };
    case 'RESET_PRICES':
      return {
        ...initialPriceState,
        lastUpdated: new Date().toISOString(),
      };
    default:
      return state;
  }
}

// Context type
interface PriceContextType {
  priceState: PriceState;
  priceDispatch: React.Dispatch<PriceAction>;
  getPrice: (articleNumber: string) => number;
  hasPrice: (articleNumber: string) => boolean;
}

// Create context
const PriceContext = createContext<PriceContextType | undefined>(undefined);

// Provider component
interface PriceProviderProps {
  children: ReactNode;
}

export function PriceProvider({ children }: PriceProviderProps) {
  const [priceState, priceDispatch] = useReducer(priceReducer, null, loadPricesFromStorage);

  // Save to localStorage whenever prices change
  useEffect(() => {
    savePricesToStorage(priceState);
  }, [priceState]);

  // Get price for an article number
  const getPrice = (articleNumber: string): number => {
    return priceState.prices[articleNumber] ?? 0;
  };

  // Check if price is set (non-zero)
  const hasPrice = (articleNumber: string): boolean => {
    const price = priceState.prices[articleNumber];
    return price !== undefined && price > 0;
  };

  return (
    <PriceContext.Provider value={{ priceState, priceDispatch, getPrice, hasPrice }}>
      {children}
    </PriceContext.Provider>
  );
}

// Custom hook to use the context
export function usePrices() {
  const context = useContext(PriceContext);
  if (context === undefined) {
    throw new Error('usePrices must be used within a PriceProvider');
  }
  return context;
}