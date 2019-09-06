/* eslint @typescript-eslint/no-explicit-any:0 */
import get from 'lodash.get';
import set from 'lodash.set';
import { useEffect, useCallback, useState, useRef } from 'react';
import { Store, Listener, Action } from 'final-state';

/**
 * A react hook to subscribe the changes of state
 *
 * You can do it by yourself. This is just a shortcut hook.
 * @param store specify which store instance you want to subscribe
 * @param listener the listener that will be triggered when state is changed
 */
export function useSubscription(store: Store, listener: Listener) {
  useEffect(() => store.subscribe(listener), [store, listener]);
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
 * A function to get value from state
 * @param {K} state
 * @template T the type of the state that you are tracking
 * @template K the type of the state
 */
export type Criteria<T, K> = (state: K) => T;

/**
 * A react hook to help you tracking a state by criteria.
 * @param {Store} store specify which store instance you want to track state
 * @param {string} path the path(or a getter function) of the property to track.
 * @see https://lodash.com/docs/4.17.11#get for more information about `path`
 * @template T the type of the state that you are tracking
 * @template K the type of the whole state
 * @returns the latest value of the state that you are tracking
 */
function _useCriteria<T = any, K = any>(
  store: Store<K>,
  path: string,
): T | undefined;

/**
 * A react hook to help you tracking a state by criteria.
 * @param {Store} store specify which store instance you want to track state
 * @param {Criteria} path a getter function to get the property to track.
 * @template T the type of the state that you are tracking
 * @template K the type of the whole state
 * @returns the latest value of the state that you are tracking
 */
function _useCriteria<T = any, K = any>(
  store: Store<K>,
  path: Criteria<T, K>,
): T;

// Going to be deprecated in later versions
function _useCriteria<T = any, K = any>(
  store: Store<K>,
  path: string,
  setter: false,
): T | undefined;

// Going to be deprecated in later versions
function _useCriteria<T = any, K = any>(
  store: Store<K>,
  path: string,
  setter: true,
): [T | undefined, (value: T) => void];

/**
 * A react hook to help you tracking a state by criteria.
 * @param store specify which store instance you want to track state
 * @param {string | Criteria} path the path(or a getter function) of the property to track.
 * @see https://lodash.com/docs/4.17.11#get when path is string
 * @param {boolean | undefined} setter if set to true, will return a shortcut setter function to set the state directly
 * @template T the type of the state that you are tracking
 * @template K the type of the whole state
 */
// eslint-disable-next-line no-underscore-dangle
function _useCriteria<T, K>(
  store: Store<K>,
  path: string | Criteria<T, K>,
  setter?: boolean,
) {
  const pathRef = useRef(path);
  if (setter !== undefined) {
    // eslint-disable-next-line no-console
    console.warn(
      `useCriteria(store, path, setter) will be deprecated in later versions, please remove "setter" arguments.`,
    );
  }
  const getCriteria = useCallback((): T | undefined => {
    const state = store.getState();
    if (typeof pathRef.current === 'string') {
      return get(state, pathRef.current);
    }
    return pathRef.current(state);
  }, [store]);
  const [criteria, setCriteria] = useState(getCriteria());
  useEffect(() => {
    setCriteria(getCriteria());
  }, [getCriteria]);
  const listener = useCallback(() => setCriteria(getCriteria()), [getCriteria]);
  useSubscription(store, listener);
  // only for setter = true
  const setterFunction = useCallback(
    (value: T) => {
      if (typeof pathRef.current === 'string') {
        store.dispatch(setterAction, {
          path: pathRef.current,
          value,
        });
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `useCriteria(store, path, setter = true) will be deprecated in later versions, please remove "setter" arguments.`,
        );
      }
    },
    [store],
  );
  if (setter === undefined || setter === false) {
    return criteria;
  }
  return [criteria, setterFunction];
}

export const useCriteria = _useCriteria;
