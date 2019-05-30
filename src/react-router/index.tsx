/* eslint no-param-reassign: 0 */

import { useEffect } from 'react';
import { withRouter, RouteComponentProps, match as Match } from 'react-router';
import { Location, History } from 'history';
import Store, { ActionMap } from 'final-state';
import { useCriteria } from '..';

interface State {
  match?: Match;
  location?: Location;
  history?: History;
}

const initialState: State = {};

const actions: ActionMap<State> = {
  setMatch(draftState, match) {
    draftState.match = match;
  },
  setHistory(draftState, history) {
    draftState.history = history;
  },
  setLocation(draftState, location) {
    draftState.location = location;
  },
};

const store = new Store(initialState, actions, 'react-router');

export function useMatch() {
  return useCriteria<Match>(store, 'match', false);
}

export function useLocation() {
  return useCriteria<Location>(store, 'location', false);
}

export function useHistory() {
  return useCriteria<History>(store, 'history', false);
}

export function applyLogger(logger: (store: Store) => void) {
  logger(store);
}

function RouterState({ match, location, history }: RouteComponentProps) {
  useEffect(() => {
    store.dispatch('setMatch', match);
  }, [match]);
  useEffect(() => {
    store.dispatch('setLocation', location);
  }, [location]);
  useEffect(() => {
    store.dispatch('setHistory', history);
  }, [history]);
  return null;
}

export default withRouter(RouterState);
