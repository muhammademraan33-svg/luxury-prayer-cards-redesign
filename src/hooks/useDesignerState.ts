import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'luxuryPrayerCards_designerState';
const DEBOUNCE_MS = 500;

export interface DesignerStateConfig {
  // Keys to persist - must match the state variable names
  persistKeys: string[];
  // Whether to auto-save on changes
  autoSave?: boolean;
}

/**
 * Hook to persist designer state across navigation and page refreshes.
 * Uses localStorage for persistence and debounces saves for performance.
 */
export function useDesignerState<T extends Record<string, unknown>>(
  initialState: T,
  config: DesignerStateConfig
): [T, (updates: Partial<T>) => void, () => void, () => void] {
  const { persistKeys, autoSave = true } = config;
  
  // Load initial state from storage
  const loadedState = useRef<Partial<T> | null>(null);
  
  if (loadedState.current === null) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only restore keys that are in our persist list
        const filtered: Partial<T> = {};
        for (const key of persistKeys) {
          if (key in parsed) {
            // Handle Date objects
            if (key.toLowerCase().includes('date') && parsed[key]) {
              filtered[key as keyof T] = new Date(parsed[key]) as T[keyof T];
            } else {
              filtered[key as keyof T] = parsed[key];
            }
          }
        }
        loadedState.current = filtered;
      } else {
        loadedState.current = {};
      }
    } catch (e) {
      console.warn('Failed to load designer state:', e);
      loadedState.current = {};
    }
  }
  
  // Merge loaded state with initial state
  const mergedInitial = { ...initialState, ...loadedState.current };
  const [state, setState] = useState<T>(mergedInitial);
  
  // Debounced save
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const saveToStorage = useCallback(() => {
    try {
      const toSave: Record<string, unknown> = {};
      for (const key of persistKeys) {
        if (key in state) {
          const value = state[key];
          // Convert Date objects to ISO strings
          if (value instanceof Date) {
            toSave[key] = value.toISOString();
          } else {
            toSave[key] = value;
          }
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save designer state:', e);
    }
  }, [state, persistKeys]);
  
  // Auto-save on state changes (debounced)
  useEffect(() => {
    if (!autoSave) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveToStorage();
    }, DEBOUNCE_MS);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state, autoSave, saveToStorage]);
  
  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveToStorage();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveToStorage]);
  
  // Update function that merges partial updates
  const updateState = useCallback((updates: Partial<T>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);
  
  // Force save immediately
  const forceSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveToStorage();
  }, [saveToStorage]);
  
  // Clear saved state
  const clearSavedState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear designer state:', e);
    }
  }, []);
  
  return [state, updateState, forceSave, clearSavedState];
}

/**
 * Tracks initial values for slider controls to enable reversible resizing.
 * Returns the initial value and a function to check if current value matches initial.
 */
export function useSliderInitialValue(currentValue: number | 'auto'): {
  initialValue: number | 'auto';
  isAtInitial: boolean;
  resetToInitial: () => number | 'auto';
} {
  const initialRef = useRef<number | 'auto'>(currentValue);
  
  // Only set initial on first render
  useEffect(() => {
    // Don't update after initial mount
  }, []);
  
  return {
    initialValue: initialRef.current,
    isAtInitial: currentValue === initialRef.current,
    resetToInitial: () => initialRef.current,
  };
}

/**
 * Creates a stable position tracker that ensures positions remain
 * within bounds and can be reset to their original values.
 */
export interface PositionState {
  x: number;
  y: number;
}

export interface PositionTracker {
  current: PositionState;
  initial: PositionState;
  update: (newPos: Partial<PositionState>) => void;
  reset: () => void;
  isAtInitial: boolean;
}

export function usePositionTracker(
  initialPosition: PositionState,
  bounds?: { minX: number; maxX: number; minY: number; maxY: number }
): PositionTracker {
  const initialRef = useRef<PositionState>({ ...initialPosition });
  const [position, setPosition] = useState<PositionState>({ ...initialPosition });
  
  const clamp = useCallback((pos: PositionState): PositionState => {
    if (!bounds) return pos;
    return {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, pos.x)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, pos.y)),
    };
  }, [bounds]);
  
  const update = useCallback((newPos: Partial<PositionState>) => {
    setPosition(prev => clamp({ ...prev, ...newPos }));
  }, [clamp]);
  
  const reset = useCallback(() => {
    setPosition(clamp({ ...initialRef.current }));
  }, [clamp]);
  
  const isAtInitial = 
    Math.abs(position.x - initialRef.current.x) < 0.1 &&
    Math.abs(position.y - initialRef.current.y) < 0.1;
  
  return {
    current: position,
    initial: initialRef.current,
    update,
    reset,
    isAtInitial,
  };
}
