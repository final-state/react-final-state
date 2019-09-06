[![Build Status](https://travis-ci.com/final-state/react-final-state.svg?branch=master)](https://travis-ci.com/final-state/react-final-state)
[![codecov.io](https://codecov.io/gh/final-state/react-final-state/branch/master/graph/badge.svg)](https://codecov.io/gh/final-state/react-final-state)
[![Known Vulnerabilities](https://snyk.io/test/github/final-state/react-final-state/badge.svg)](https://snyk.io/test/github/react-final-state/final-state)
[![minified + gzip](https://badgen.net/bundlephobia/minzip/react-final-state@1.2.0)](https://bundlephobia.com/result?p=react-final-state@1.2.0)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# react-final-state

> [final-state](https://github.com/final-state/final-state) for React

## Installation

```bash
# React >= 16.8.0 must have been already installed
yarn add final-state
yarn add react-final-state
```

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
// `useCriteria` has these overloads
/**
 * A react hook to help you tracking a state by criteria.
 * @param {Store} store specify which store instance you want to track state
 * @param {string} path the path(or a getter function) of the property to track.
 * @see https://lodash.com/docs/4.17.11#get for more information about `path`
 * @template T the type of the state that you are tracking
 * @template K the type of the whole state
 * @returns the latest value of the state that you are tracking
 */
function _useCriteria<T = any, K = any>(
  store: Store<K>,
  path: string,
): T | undefined;

/**
 * A react hook to help you tracking a state by criteria.
 * @param {Store} store specify which store instance you want to track state
 * @param {Criteria} path a getter function to get the property to track.
 * @template T the type of the state that you are tracking
 * @template K the type of the whole state
 * @returns the latest value of the state that you are tracking
 */
function _useCriteria<T = any, K = any>(
  store: Store<K>,
  path: Criteria<T, K>,
): T;

// Going to be deprecated in later versions
function _useCriteria<T = any, K = any>(
  store: Store<K>,
  path: string,
  setter: false,
): T | undefined;

// Going to be deprecated in later versions
function _useCriteria<T = any, K = any>(
  store: Store<K>,
  path: string,
  setter: true,
): [T | undefined, (value: T) => void];
```

#### When `path` is string

If path is a string, the inner implementation is:

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

#### When `path` is `Criteria`

Let's see the definition of `Criteria` first:

```typescript
/**
 * A function to get value from state
 * @param {K} state
 * @template T the type of the state that you are tracking
 * @template K the type of the state
 */
export type Criteria<T, K> = (state: K) => T;
```

So when `path` is a `Criteria`, it tells `useCriteria` how to get the exact value that you want to track. For example:

```typescript
const path: Criteria<number, State> = state => state.cpu.load.m5;
const load5 = useCriteria<number, State>(store, path);
```

> Note: `useCriteria` only uses the first `path` that passed in. So `useCriteria(store, state => state.cpu.load.m5)` is safe.

This overload of `useCriteria` is added in Jul 28 2019, because [Optional Chaining](https://github.com/tc39/proposal-optional-chaining) is changed to `stage-3` few days ago, that means Typescript will support it soon.

Let's think about this expression in the example above: `state.cpu.load.m5`. If `load` is optional, like this:

```typescript
interface State {
  cpu: {
    load?: {
      m1: number;
      m5: number;
      m15: number;
    };
  };
}
```

Typescript will show you the error:

```
Object is possibly 'undefined'.
```

It's painful to manually handle this kind of problem. So I choose to use `lodash.get` with a string `path` at first.

But `Optional Chaining` changes it. We can write:

```javascript
const path: Criteria<number, State> = state => state.cpu.load?.m5;
```

in the near future when Typescript supports `Optional Chaining`,

or right now in javascript with [@babel/preset-stage-3](https://babeljs.io/docs/en/babel-preset-stage-3).

#### About `setter`

**The `setter` argument is going to be deprecated!!! DO NOT use it any more!!!**

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
