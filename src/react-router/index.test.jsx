/* eslint-disable no-console */

import React from 'react';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import RouterState, {
  useHistory,
  useLocation,
  useMatch,
} from '../../react-router';

function TestComponent() {
  const history = useHistory();
  const location = useLocation();
  const match = useMatch();
  console.log(history, location, match);
  return null;
}

test('`useCriteria` can correctly track the changes of state', () => {
  renderer.create(
    <BrowserRouter>
      <RouterState />
      <TestComponent />
    </BrowserRouter>,
  );
});
