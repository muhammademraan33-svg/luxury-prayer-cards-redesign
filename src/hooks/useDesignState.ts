import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'designPageState';
const STORAGE_VERSION = 2;

export interface Position {
  x: number;
  y: number;
}

export interface InitialTextState {
  nameSize: number;
  namePosition: Position;
  frontDatesSize: number | 'auto';
  datesPosition: Position;
  backNameSize: number;
  backNamePosition: Position;
  backDatesSize: number | 'auto';
  backDatesPosition: Position;
  prayerTextSize: number | 'auto';
  prayerPosition: Position;
  inLovingMemorySize: number;
  inLovingMemoryPosition: Position;
  additionalTextSize: number;
  additionalTextPosition: Position;
}

// Default values for text elements - used for reset and initial state
export const DEFAULT_TEXT_STATE: InitialTextState = {
  nameSize: 24,
  namePosition: { x: 50, y: 82 },
  frontDatesSize: 'auto',
  datesPosition: { x: 50, y: 86 },
  backNameSize: 32,
  backNamePosition: { x: 0, y: 12 },
  backDatesSize: 'auto',
  backDatesPosition: { x: 50, y: 48 },
  prayerTextSize: 'auto',
  prayerPosition: { x: 0, y: 0 },
  inLovingMemorySize: 24,
  inLovingMemoryPosition: { x: 0, y: 8 },
  additionalTextSize: 14,
  additionalTextPosition: { x: 50, y: 70 },
};

/**
 * Hook to persist and restore design state across navigation
 */
export function useDesignPersistence<T extends Record<string, unknown>>(
  key: string,
  currentState: T,
  shouldPersist: boolean = true
) {
  const isRestored = useRef(false);

  // Restore state on mount
  const restoreState = useCallback((): Partial<T> | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = sessionStorage.getItem(key);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      if (parsed._version !== STORAGE_VERSION) {
        sessionStorage.removeItem(key);
        return null;
      }
      
      // Clear after reading to prevent stale state
      sessionStorage.removeItem(key);
      isRestored.current = true;
      
      const { _version, _timestamp, ...state } = parsed;
      return state as Partial<T>;
    } catch (e) {
      console.error('Failed to restore design state:', e);
      return null;
    }
  }, [key]);

  // Persist current state
  const persistState = useCallback(() => {
    if (!shouldPersist || typeof window === 'undefined') return;
    
    try {
      const toStore = {
        ...currentState,
        _version: STORAGE_VERSION,
        _timestamp: Date.now(),
      };
      sessionStorage.setItem(key, JSON.stringify(toStore));
    } catch (e) {
      console.error('Failed to persist design state:', e);
    }
  }, [key, currentState, shouldPersist]);

  // Clear stored state
  const clearState = useCallback(() => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  }, [key]);

  return { restoreState, persistState, clearState, isRestored: isRestored.current };
}

/**
 * Hook to track initial text positions for deterministic resize behavior
 * When resizing, we track the position at resize start and maintain it
 */
export function useTextElementTracking() {
  // Store the position that was set when user started resizing
  const resizeStartState = useRef<{
    textType: string;
    initialSize: number;
    initialPosition: Position;
  } | null>(null);

  const startResize = useCallback((
    textType: string,
    currentSize: number,
    currentPosition: Position
  ) => {
    resizeStartState.current = {
      textType,
      initialSize: currentSize,
      initialPosition: { ...currentPosition },
    };
  }, []);

  const endResize = useCallback(() => {
    resizeStartState.current = null;
  }, []);

  const getResizeStartState = useCallback(() => {
    return resizeStartState.current;
  }, []);

  return { startResize, endResize, getResizeStartState };
}

/**
 * Clamp a position within safe bounds considering borders
 */
export function clampPosition(
  position: Position,
  hasBorder: boolean,
  isBackElement: boolean = false
): Position {
  const borderPadding = hasBorder ? 8 : 0;
  const minX = 10 + borderPadding;
  const maxX = 90 - borderPadding;
  const minY = 5 + borderPadding;
  const maxY = 95 - borderPadding;

  return {
    x: Math.max(minX, Math.min(maxX, position.x)),
    y: Math.max(minY, Math.min(maxY, position.y)),
  };
}

/**
 * Calculate safe Y bounds for text positioning with borders
 */
export function getSafeYBounds(hasBorder: boolean): { minY: number; maxY: number } {
  return {
    minY: hasBorder ? 12 : 5,
    maxY: hasBorder ? 84 : 96,
  };
}
