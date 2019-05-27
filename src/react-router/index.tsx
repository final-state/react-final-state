/* eslint no-param-reassign: 0 */

import React, { ReactElement, useEffect } from 'react';
import { withRouter, RouteComponentProps, match as Match } from 'react-router';
import { Location, History } from 'history';
import Store from 'final-state';
import { useCriteria } from '..';

interface State {
  match: Match | null;
  location: Location | null;
  history: History | null;
}

const initialState: State = {
  match: null,
  location: null,
  history: null,
};

const store = new Store(initialState);

export function useMatch() {
  return useCriteria<Match | null, State>(store, 'match');
}

export function useLocation() {
  return useCriteria<Location | null, State>(store, 'location');
}

export function useHistory() {
  return useCriteria<History | null, State>(store, 'history');
}

function RouterState({
  match,
  location,
  history,
}: RouteComponentProps): ReactElement {
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
  return <></>;
}

export default withRouter(RouterState);
