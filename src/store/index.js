// import { createStore, applyMiddleware } from 'redux';
// import combinedReducer from './reducers';
// import { routerMiddleware, createReduxHistory } from '../history';
// //routerMiddleware 可以拦截到 push('/counter') 这个action,调用history进行路径的跳转
// export const store =
//   applyMiddleware(routerMiddleware)(createStore)(combinedReducer);
// window.store = store;
// export const history = createReduxHistory(store);

import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers/counter';
import createSagaMiddleware from '../redux-saga';
import rootSaga from './rootSaga';
let sagaMiddleware = createSagaMiddleware();
let store = applyMiddleware(sagaMiddleware)(createStore)(reducer);

sagaMiddleware.run(rootSaga);
window.store = store;
export default store;
