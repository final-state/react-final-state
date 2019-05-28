/* eslint-disable no-console,no-param-reassign,react/jsx-one-expression-per-line */

import React, { useState } from 'react';
import renderer from 'react-test-renderer';
import Store from 'final-state';
import { useCriteria, useSubscription } from '../index';

const initialState = {
  a: 1,
  b: 'good',
  c: true,
};

const actions = {
  action1(draftState) {
    draftState.a = 2;
  },
  action2(draftState) {
    draftState.b = 'bad';
    draftState.c = false;
  },
};

const store = new Store(initialState, actions, 'react-final-state-test');

test('`useCriteria` can correctly track the changes of state', () => {
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
  const component = renderer.create(<TestComponent />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  store.dispatch('action1');
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  store.dispatch('action2');
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('`useSubscription` works', () => {
  function TestComponent() {
    const [count, setCount] = useState(0);
    useSubscription(store, () => {
      setCount(prev => prev + 1);
    });
    return <h1>{count}</h1>;
  }
  const component = renderer.create(<TestComponent />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  store.dispatch('action1');
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  store.dispatch('action2');
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
