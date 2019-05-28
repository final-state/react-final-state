import get from 'lodash.get';
import { useEffect, useCallback, useState } from 'react';
import Store, { Listener } from 'final-state';

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

/**
 * A react hook to help you tracking a state by criteria.
 * @param store specify which store instance you want to track state
 * @param {string} path the path of the property to track.
 * @see https://lodash.com/docs/4.17.11#get
 * @template T the type of the state that you are tracking
 *
 * You can do it by yourself. This is just a shortcut hook.
 */
export function useCriteria<T>(store: Store, path: string) {
  const getCriteria = useCallback((): T | undefined => {
    const state = store.getState();
    return get(state, path);
  }, [store, path]);
  const [criteria, setCriteria] = useState(getCriteria());
  const listener = useCallback(() => setCriteria(getCriteria()), [getCriteria]);
  useSubscription(store, listener);
  return criteria;
}
