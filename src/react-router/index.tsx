/* eslint no-param-reassign: 0 */

import { useEffect } from 'react';
import { withRouter, RouteComponentProps, match as Match } from 'react-router';
import { Location, History } from 'history';
import Store from 'final-state';
import { useCriteria } from '..';

interface State {
  match?: Match;
  location?: Location;
  history?: History;
}

const initialState: State = {};

const store = new Store(initialState);

export function useMatch() {
  return useCriteria<Match>(store, 'match');
}

export function useLocation() {
  return useCriteria<Location>(store, 'location');
}

export function useHistory() {
  return useCriteria<History>(store, 'history');
}

function RouterState({ match, location, history }: RouteComponentProps) {
  useEffect(() => {
    store.dispatch(draftState => {
      draftState.match = match;
    });
  }, [match]);
  useEffect(() => {
    store.dispatch(draftState => {
      draftState.location = location;
    });
  }, [location]);
  useEffect(() => {
    store.dispatch(draftState => {
      draftState.history = history;
    });
  }, [history]);
  return null;
}

export default withRouter(RouterState);
