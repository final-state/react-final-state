/* eslint-disable no-console,no-param-reassign,react/jsx-one-expression-per-line */
import { renderHook, act } from '@testing-library/react-hooks';
import { createStore, ActionMap } from '@liyuanqiu/final-state';
import { useCriteria, useSubscription } from '../src';

interface State {
  a: number;
  b: string;
  c: boolean;
}

const initialState: State = {
  a: 1,
  b: 'good',
  c: true,
};

const actions: ActionMap = {
  setA(draftState, n) {
    draftState.a = n;
  },
  increaseA(draftState) {
    draftState.a += 1;
  },
  setB(draftState, s) {
    draftState.b = s;
  },
  setC(draftState, b) {
    draftState.c = b;
  },
};

describe('Test `useCriteria`', () => {
  test('`useCriteria(store, path)` works', () => {
    const store = createStore(initialState, actions, 'react-final-state-test');
    const { result: a } = renderHook(() => useCriteria(store, 'a'));
    const newA = initialState.a + 1;
    expect(a.current).toBe(initialState.a);
    act(() => {
      store.dispatch('setA', newA);
    });
    expect(a.current).toBe(newA);
    act(() => {
      store.dispatch('increaseA');
    });
    expect(a.current).toBe(newA + 1);

    const { result: b } = renderHook(() => useCriteria(store, 'b'));
    const newB = 'bad';
    expect(b.current).toBe(initialState.b);
    act(() => {
      store.dispatch('setB', newB);
    });
    expect(b.current).toBe(newB);

    const { result: c } = renderHook(() => useCriteria(store, 'c'));
    const newC = !initialState.c;
    expect(c.current).toBe(initialState.c);
    act(() => {
      store.dispatch('setC', newC);
    });
    expect(c.current).toBe(newC);
  });
  test('`useCriteria(store, path, false)` works', () => {
    const store = createStore(initialState, actions, 'react-final-state-test');
    const { result: a } = renderHook(() => useCriteria(store, 'a', false));
    const newA = initialState.a + 1;
    expect(a.current).toBe(initialState.a);
    act(() => {
      store.dispatch('setA', newA);
    });
    expect(a.current).toBe(newA);
    act(() => {
      store.dispatch('increaseA');
    });
    expect(a.current).toBe(newA + 1);

    const { result: b } = renderHook(() => useCriteria(store, 'b', false));
    const newB = 'bad';
    expect(b.current).toBe(initialState.b);
    act(() => {
      store.dispatch('setB', newB);
    });
    expect(b.current).toBe(newB);

    const { result: c } = renderHook(() => useCriteria(store, 'c', false));
    const newC = !initialState.c;
    expect(c.current).toBe(initialState.c);
    act(() => {
      store.dispatch('setC', newC);
    });
    expect(c.current).toBe(newC);
  });
  test('`useCriteria(store, path, true)` works', () => {
    const store = createStore(initialState, actions, 'react-final-state-test');
    const { result: a } = renderHook(() => useCriteria(store, 'a', true));
    const newA = initialState.a + 1;
    expect(a.current[0]).toBe(initialState.a);
    act(() => {
      store.dispatch('setA', newA);
    });
    expect(a.current[0]).toBe(newA);
    act(() => {
      store.dispatch('increaseA');
    });
    expect(a.current[0]).toBe(newA + 1);
    act(() => {
      a.current[1](newA + 2);
    });
    expect(a.current[0]).toBe(newA + 2);

    const { result: b } = renderHook(() => useCriteria(store, 'b', true));
    const newB = 'bad';
    expect(b.current[0]).toBe(initialState.b);
    act(() => {
      store.dispatch('setB', newB);
    });
    expect(b.current[0]).toBe(newB);
    act(() => {
      b.current[1]('good/bad');
    });
    expect(b.current[0]).toBe('good/bad');

    const { result: c } = renderHook(() => useCriteria(store, 'c', true));
    const newC = !initialState.c;
    expect(c.current[0]).toBe(initialState.c);
    act(() => {
      store.dispatch('setC', newC);
    });
    expect(c.current[0]).toBe(newC);
    act(() => {
      c.current[1](!newC);
    });
    expect(c.current[0]).toBe(!newC);
  });
});

describe('Test `useSubscription`', () => {
  test('it works', () => {
    let count = 0;
    const store = createStore(initialState, actions, 'react-final-state-test');
    renderHook(() =>
      useSubscription(store, () => {
        count += 1;
      }),
    );
    act(() => {
      store.dispatch('setA');
    });
    expect(count).toBe(1);
    act(() => {
      store.dispatch('setB');
    });
    expect(count).toBe(2);
    act(() => {
      store.dispatch('setC');
    });
    expect(count).toBe(3);
  });
});
