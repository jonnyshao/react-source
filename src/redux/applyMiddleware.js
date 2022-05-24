import compose from './compose';

function applyMiddleware(...middlewares) {
  return function (createStore) {
    return function (reducers, preloadedState) {
      const store = createStore(reducers, preloadedState);

      let dispatch;
      //   最终目标希望在中间件里拿到的dispatch是改造过的，而非最原始的dispatch
      const middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action),
      };
      //   let chain = middlewares(store)(store.dispatch);
      let chain = middlewares.map((middleware) => middleware(middlewareAPI));

      dispatch = compose(...chain)(store.dispatch);
      return {
        ...store,
        dispatch,
      };
    };
  };
}

export default applyMiddleware;
