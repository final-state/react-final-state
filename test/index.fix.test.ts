import { createStore } from 'final-state';
import { renderHook, act } from '@testing-library/react-hooks';
import { useState } from 'react';
import { useCriteria } from '../src';

interface State {
  a: number;
  b: number;
}

const initialState: State = {
  a: 1,
  b: 2,
};

describe('Tests for fixes', () => {
  test('useCriteria criteria should be updated when `store` or `path` changed', () => {
    const store = createStore(initialState, {}, 'test');
    const { result: pathResult } = renderHook(() => useState('a'));
    const { result: valueResult, rerender: valueRerender } = renderHook(() =>
      useCriteria(store, pathResult.current[0]),
    );
    expect(valueResult.current).toBe(initialState.a);
    act(() => {
      pathResult.current[1]('b');
      valueRerender();
    });
    expect(valueResult.current).toBe(initialState.b);
  });
  test('useCriteria setter should work when `store` or `path` changed', () => {
    const store = createStore(initialState, {}, 'test');
    const { result: pathResult } = renderHook(() => useState('a'));
    const { result: valueResult, rerender: valueRerender } = renderHook(() =>
      useCriteria(store, pathResult.current[0], true),
    );
    expect(valueResult.current[0]).toBe(initialState.a);
    act(() => {
      valueResult.current[1](5);
    });
    expect(valueResult.current[0]).toBe(5);
    act(() => {
      pathResult.current[1]('b');
      valueRerender();
    });
    expect(valueResult.current[0]).toBe(initialState.b);
    act(() => {
      valueResult.current[1](10);
    });
    expect(valueResult.current[0]).toBe(10);
    expect(store.getState().a).toBe(5);
    expect(store.getState().b).toBe(10);
  });
});
