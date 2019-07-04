[![Build Status](https://travis-ci.com/final-state/react-final-state.svg?branch=master)](https://travis-ci.com/final-state/react-final-state)
[![codecov.io](https://codecov.io/gh/final-state/react-final-state/branch/master/graph/badge.svg)](https://codecov.io/gh/final-state/react-final-state)
[![Known Vulnerabilities](https://snyk.io/test/github/final-state/react-final-state/badge.svg)](https://snyk.io/test/github/react-final-state/final-state)
[![minified + gzip](https://badgen.net/bundlephobia/minzip/react-final-state@1.0.0)](https://bundlephobia.com/result?p=react-final-state@1.0.0)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# react-final-state

> [final-state](https://github.com/final-state/final-state) for React

## Installation

```bash
yarn add final-state
yarn add react-final-state
```

You should care about the `peer dependencies` of these two packages. If something not installed, just install them manually.

`final-state` and `react-final-state` are written in `Typescript`, so you don't need to find a type definition for it.

## Quick Start

### Prepare store instance

You can instantiate the store instance anywhere and export it out for use.

```javascript
// file: YOUR_PATH/store.js
import { createStore } from 'final-state';

// 1. define the whole state tree
const initialState = {};
// 2. define actions
const actions = {
  fooAction(draftState) {
    // ...
  },
  barAction(draftState, params) {
    // ...
  },
};
// 3. create store instance and export it out
export default createStore(initialState, actions, 'store-name-1');
```

You may want to use multiple store in your app, that's fine, just create multiple store instances and export them out:

```javascript
// file: YOUR_PATH/store.js
import { createStore } from 'final-state';

const fooInitialState = {};
const fooActions = {
  fooAction(draftState) {
    // ...
  },
},
export const fooStore = createStore(fooInitialState, fooActions, 'foo');

const barInitialState = {};
const barActions = {
  barAction(draftState) {
    // ...
  },
},
export const barStore = createStore(barInitialState, barActions, 'bar');
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

// React component
function MyComponent() {
  useEffect(() => {
    // Dispatch action to alter state
    // This is a side effect!
    // DO NOT write it directly in a function component
    store.dispatch('YourActionType');
  }, []);
  return *JSX*;
}
```

More details about `dispatch` and `action`, please see [Store#dispatch](https://github.com/final-state/final-state#storedispatchtype-params).

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

The signatures of `useCriteria`:

```typescript
// `useCriteria` has 3 overloads
// store is the instance of Store
// path is the object path of your state
// setter is optional, set to true to get a setter of your state
function useCriteria<T>(store: Store, path: string): T | undefined;

function useCriteria<T>(
  store: Store,
  path: string,
  setter: false,
): T | undefined;

function useCriteria<T>(
  store: Store,
  path: string,
  setter: true,
): [T | undefined, (value: T) => void];
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

If you set `setter` parameter to `true`, the return type of `useCriteria` will be an array of 2 elements:

- #0 the state you are tracking
- #1 the setter function of the state you are tracking

(Just think about `const [count, setCount] = useState()`)

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

## Test

This project uses [jest](https://jestjs.io/) to perform testing.

```bash
yarn test
```

## Road Map

- [x] Fix tests

- [x] Codecov 100%
