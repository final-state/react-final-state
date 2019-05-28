[![Build Status](https://travis-ci.com/final-state/react-final-state.svg?branch=master)](https://travis-ci.com/final-state/react-final-state)
[![codecov.io](https://codecov.io/gh/final-state/react-final-state/branch/master/graph/badge.svg)](https://codecov.io/gh/final-state/react-final-state)
[![Known Vulnerabilities](https://snyk.io/test/github/final-state/react-final-state/badge.svg)](https://snyk.io/test/github/react-final-state/final-state)
[![minified + gzip](https://badgen.net/bundlephobia/minzip/react-final-state@0.2.3)](https://bundlephobia.com/result?p=react-final-state@0.2.3)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# react-final-state

> [final-state](https://github.com/final-state/final-state) for React

## Installation

```bash
yarn add final-state
yarn add react-final-state
# or
npm install final-state
npm install react-final-state
```

`final-state` and `react-final-state` are written in `Typescript`, so you don't need to find a type definition for it.

## Quick Start

### Prepare store instance

You can instantiate the store instance anywhere and export it out for use.

```javascript
// file: YOUR_PATH/store.js
import Store from 'final-state';

// 1. define the whole state tree
const initialState = {};
// 2. create store instance and export it out
export default new Store(initialState);
```

You may want to use multiple store in your app, that's fine, just create multiple store instances and export them out:

```javascript
// file: YOUR_PATH/store.js
import Store from 'final-state';

const fooInitialState = {};
export const fooStore = new Store(fooInitialState);

const barInitialState = {};
export const barStore = new Store(barInitialState);
```

### How to track state

Just one line!!!

```javascript
import { useCriteria } from 'react-final-state';
import store from '<YOUR_PATH>/store';

/* Assume your state object is like this:
{
  cpu: {
    load: {
      m1: 2.5,
      m5: 1.2,
      m15: 1.03,
    },
  },
}
*/

export default function MyComponent() {
  // `store` is the store instance
  // `'cpu.load.m5'` is the path of state you want to track in the whole state object
  const load5 = useCriteria(store, 'cpu.load.m5');
  return <h1>{load5}</h1>;
}
```

### How to alter state

```javascript
import { store } from '<YOUR_PATH>/store';

/* Assume your state object is
{
  cpu: {
    load: {
      m1: 2.5,
      m5: 1.2,
      m15: 1.03,
    },
  },
}
*/

// Define an action to alter state
// the first parameter `draftState` is a draft of your state
// the second parameter is for dynamic values
const setLoad5Action = (draftState, value) => {
  draftState.cpu.load.m5 = value;
};

// React component
function MyComponent() {
  useEffect(() => {
    // Dispatch action to alter state
    // This is a side effect!
    // DO NOT write it directly in a function component
    store.dispatch(setLoad5Action, 1.15);
  }, []);
  return *JSX*;
}
```

More details about `dispatch` and `action`, please see [Store#dispatch](https://github.com/final-state/final-state#storedispatchaction-actionparams).

### Use with `react-router`

Add `RouterState` component as a child of `BrowserRouter`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import RouterState from 'react-final-state';
import App from './App';

ReactDOM.render(
  <BrowserRouter>
    <RouterState />
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
```

Track router's state:

```javascript
import { useHistory, useLocation, useMatch } from 'react-final-state';
// use these hooks to track router's state
const history = useHistory();
const location = useLocation();
const match = useMatch();
```

## API Reference

### useCriteria

**Important Note:**

> If you use `useCriteria`, your state must be a plain object. Continue reading for more details.

```javascript
import { useCriteria } from 'react-final-state';
```

`useCriteria` is a react hook that helps you to get a deep branch's value from the state object.

```javascript
// Example
const load5 = useCriteria(store, 'cpu.load.m5');
```

The signature of `useCriteria`:

```javascript
// store is the instance of Store
useCriteria(store, path);
```

It's inner implementation is:

```javascript
lodash.get(store.getState(), path);
```

So the `path` can be:

```javascript
path = 'a[0].b.c';
path = 'a.b.c';
path = 'a[0][1][2].b.c';
```

See https://lodash.com/docs/4.17.11#get for more details about `path`.

If your `path` is invalid or not existing, you'll get a `undefined` from `useCriteria`.

### useSubscription

```javascript
import { useSubscription } from 'react-final-state';
```

`useSubscription` is a react hook that helps you to subscribe the changes of state and automatically manages the lifecycle of a subscription.

Usually you can use `useCriteria` instead, only for those special cases you can give `useSubscription` a try.

```javascript
// Example
const listener = React.useCallback(...);
// store is the instance of Store
useSubscription(store, listener);
```

### react-router

#### RouterState

```javascript
import RouterState from 'react-final-state';
```

It is a "shadow" component that renders nothing but helps us track the latest state of `react-router`.

So you should add it before your business code like the [example](https://github.com/final-state/react-final-state/blob/master/README.md#use-with-react-router)

#### useHistory, useLocation, useMatch

```javascript
import { useHistory, useLocation, useMatch } from 'react-final-state';
```

Hooks for you to track the `history`, `location` and `match` of [react-router withRouter](https://reacttraining.com/react-router/web/api/withRouter)

## Test

This project uses [jest](https://jestjs.io/) to perform testing.

```bash
yarn test
```
