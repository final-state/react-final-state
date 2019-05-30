/* eslint-disable no-console */

import React from 'react';
import renderer from 'react-test-renderer';
import { renderHook, act } from 'react-hooks-testing-library';
import { BrowserRouter } from 'react-router-dom';
import logger from 'final-state-logger';
import RouterState, {
  useHistory,
  useLocation,
  useMatch,
  applyLogger,
} from '../../react-router';

test('`applyLogger` works', () => {
  const spyConsoleLog = jest.spyOn(console, 'log');
  applyLogger(logger);
  expect(spyConsoleLog).not.toHaveBeenCalled();
  renderer.create(
    <BrowserRouter>
      <RouterState />
    </BrowserRouter>,
  );
  renderHook(() => useHistory());
  expect(spyConsoleLog).toHaveBeenCalled();
});

test('react-router state can be accessed.', () => {
  renderer.create(
    <BrowserRouter>
      <RouterState />
    </BrowserRouter>,
  );
  const { result: history } = renderHook(() => useHistory());
  expect(history.current).toBeTruthy();
  const { result: location } = renderHook(() => useLocation());
  expect(location.current).toBeTruthy();
  const { result: match } = renderHook(() => useMatch());
  expect(match.current).toBeTruthy();
});

test('location changed after history.push', () => {
  renderer.create(
    <BrowserRouter>
      <RouterState />
    </BrowserRouter>,
  );
  const { result: history } = renderHook(() => useHistory());
  const { result: location } = renderHook(() => useLocation());

  expect(location.current).toMatchObject({
    pathname: '/',
    search: '',
    hash: '',
  });

  const pathname = '/test';
  act(() => history.current.push(pathname));

  expect(location.current).toMatchObject({
    pathname,
    search: '',
    hash: '',
    key: expect.stringMatching(/.+/),
  });
});
