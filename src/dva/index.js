import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import createSagaMiddleware from 'redux-saga';
import * as sagaEffects from 'redux-saga/effects';
import prefixNamespace from './prefixNamespace';
import { HistoryRouter } from 'redux-first-history/rr6';
import { createBrowserHistory } from 'history';
import { createReduxHistoryContext, push } from 'redux-first-history';
const { routerReducer, routerMiddleware, createReduxHistory } = createReduxHistoryContext({
  history: createBrowserHistory(),
});
export { connect, push };
function dva() {
  const app = {
    model,
    router,
    start,
    _models: [],
    _router: null,
    getActionCreators,
  };
  const initialReducers = { router: routerReducer };
  function model(model) {
    const prefixModel = prefixNamespace(model);
    console.log(prefixModel);
    app._models.push(prefixModel);
  }
  function router(router) {
    app._router = router;
  }

  function getActionCreators() {
    let actionCreator = {};
    for (const model of app._models) {
      let { reducers, effects } = model;
      let reducerActionCreators = Object.keys(reducers).reduce((memo, key) => {
        memo[key.split('/')[1]] = (...args) => ({ type: key, payload: args });
        return memo;
      }, {});

      let effectsActionCreators = Object.keys(effects).reduce((memo, key) => {
        memo[key.split('/')[1]] = (...args) => ({ type: key, payload: args });
        return memo;
      }, {});
      actionCreator[model.namespace] = { ...reducerActionCreators, ...effectsActionCreators };
    }
    return actionCreator;
  }

  function start(selector) {
    for (const model of app._models) {
      initialReducers[model.namespace] = getReducer(model);
    }
    const sagaMiddleware = createSagaMiddleware();
    const sagas = getSagas(app);

    // const store = createStore(createReducer());
    const store = applyMiddleware(sagaMiddleware, routerMiddleware)(createStore)(createReducer());
    sagas.forEach((saga) => sagaMiddleware.run(saga));
    const history = createReduxHistory(store);
    ReactDOM.render(
      <Provider store={store}>
        <HistoryRouter history={history}>{app._router()}</HistoryRouter>
      </Provider>,
      document.querySelector(selector)
    );
  }
  function createReducer() {
    return combineReducers(initialReducers);
  }

  function getReducer(model) {
    let { reducers, state: initialState } = model;
    // action匹配reducer函数 如果能匹配上 就用些reducer函数计算新的状态
    let reducer = (state = initialState, action) => {
      let reducer = reducers[action.type];
      if (reducer) {
        return reducer(state, action);
      }
      //   如果没有匹配上，就直接返回状态
      return state;
    };
    return reducer;
  }
  function getSagas(app) {
    const sagas = [];
    for (const model of app._models) {
      sagas.push(getSaga(model));
    }
    return sagas;
  }

  function getSaga(model) {
    const { effects } = model;
    return function* () {
      for (const key in effects) {
        yield sagaEffects.takeEvery(key, function* (action) {
          yield effects[key](action, sagaEffects);
        });
      }
    };
  }
  return app;
}

export default dva;
