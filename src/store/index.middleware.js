import { createStore, applyMiddleware } from '../redux';
import combineReducers from './reducers';
import logger from './middleware/logger';
import persist from './middleware/persist';

const preloadedState = JSON.parse(localStorage.getItem('counter') || '{}');

const store = applyMiddleware(promise, thunk, persist, logger)(createStore)(
  combineReducers,
  preloadedState
);

function thunk({ getState, dispatch }) {
  // 如果仓库只有一个中间件的情况，next指的sotre原始的dispatch方法
  return function (next) {
    // 为了后面级联，可以同时使用多个中间件
    return function (action) {
      if (typeof action == 'function') {
        return action(dispatch, getState);
      }
      return next(action);
    };
  };
}
function promise({ getState, dispatch }) {
  // 如果仓库只有一个中间件的情况，next指的sotre原始的dispatch方法
  return function (next) {
    // 为了后面级联，可以同时使用多个中间件
    return function (action) {
      if (typeof action?.then == 'function') {
        action.then(dispatch);
        return action;
      }
      next(action);
      return Promise.resolve(action);
    };
  };
}

// const store = createStore(combineReducers);

export default store;
