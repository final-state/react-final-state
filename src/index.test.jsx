/* eslint-disable no-console,no-param-reassign,react/jsx-one-expression-per-line */

import React from 'react';
import renderer from 'react-test-renderer';
import Store from 'final-state';
import { useCriteria } from '../index';

const initialState = {
  a: 1,
  b: 'good',
  c: true,
};

const store = new Store(initialState);

function TestComponent() {
  const a = useCriteria(store, 'a');
  const b = useCriteria(store, 'b');
  const c = useCriteria(store, 'c').toString();
  return (
    <div>
      <h1>a{a}</h1>
      <h1>b{b}</h1>
      <h1>c{c}</h1>
    </div>
  );
}

test('`useCriteria` can correctly track the changes of state', () => {
  const component = renderer.create(<TestComponent />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  store.dispatch(draftState => {
    draftState.a = 2;
  });
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  store.dispatch(draftState => {
    draftState.b = 'bad';
    draftState.c = false;
  });
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
