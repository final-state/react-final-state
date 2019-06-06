/* eslint @typescript-eslint/no-explicit-any:0 */
import get from 'lodash/get';
import set from 'lodash/set';
import { useEffect, useCallback, useState } from 'react';
import Store, { Listener, Action } from 'final-state';

/**
 * A react hook to subscribe the changes of state
 *
 * You can do it by yourself. This is just a shortcut hook.
 * @param store specify which store instance you want to subscribe
 * @param listener the listener that will be triggered when state is changed
 */
export function useSubscription(store: Store, listener: Listener) {
  useEffect(() => {
    store.subscribe(listener);
    return () => store.unSubscribe(listener);
  }, [store, listener]);
}

const setterAction: Action<
  any,
  {
    path: string;
    value: any;
  }
> = (draftState, params) => {
  const { path, value } = params as {
    path: string;
    value: any;
  };
  set(draftState, path, value);
};

/**
 * A react hook to help you tracking a state by criteria.
 * @param store specify which store instance you want to track state
 * @param {string} path the path of the property to track.
 * @see https://lodash.com/docs/4.17.11#get
 * @template T the type of the state that you are tracking
 *
 * You can do it by yourself. This is just a shortcut hook.
 */
function _useCriteria<T>(store: Store, path: string): T | undefined;
function _useCriteria<T>(
  store: Store,
  path: string,
  setter: false,
): T | undefined;
function _useCriteria<T>(
  store: Store,
  path: string,
  setter: true,
): [T | undefined, (value: T) => void];
// eslint-disable-next-line no-underscore-dangle
function _useCriteria<T>(store: Store, path: string, setter?: boolean) {
  const getCriteria = useCallback((): T | undefined => {
    const state = store.getState();
    return get(state, path);
  }, [store, path]);
  const [criteria, setCriteria] = useState(getCriteria());
  const listener = useCallback(() => setCriteria(getCriteria()), [getCriteria]);
  useSubscription(store, listener);
  const setterFunction = useCallback((value: T) => {
    store.dispatch(setterAction, {
      path,
      value,
    });
  }, []);
  if (setter === undefined || setter === false) {
    return criteria;
  }
  return [criteria, setterFunction];
}

export const useCriteria = _useCriteria;
