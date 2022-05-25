// import React from 'react';
// import ReactDOM from 'react-dom';
// import Counter from './components/Counter';
// import { Provider } from 'react-redux';
// import store from './store';
// ReactDOM.render(
//   <Provider store={store}>
//     <Counter />
//   </Provider>,
//   document.querySelector('#root')
// );

import React from 'react';
import dva, { connect, push } from './dva';
import { Router, Routes, Route, Link } from './dva/router';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const app = dva();
app.model({
  namespace: 'counter',
  state: { number: 0 },
  reducers: {
    add(state) {
      return { number: state.number + 1 };
    },
  },
  effects: {
    *asyncAdd(action, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: 'counter/add' });
    },
    *goto({ payload: [to] }, { put }) {
      yield put(push(to));
    },
  },
});
const actionCreator = app.getActionCreators();
console.log(actionCreator);
function Counter({ number, add, asyncAdd, goto }) {
  return (
    <div>
      <p>{number}</p>
      <button onClick={add}>+</button>
      <button onClick={asyncAdd}>+</button>
      <button onClick={() => goto('/')}>跳转Home</button>
    </div>
  );
}

const Home = () => <div>Home</div>;
const ConnectedCounter = connect((state) => state.counter, actionCreator.counter)(Counter);
console.log(app);
app.router(() => (
  <>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/counter">Counter</Link>
      </li>
    </ul>
    <Routes>
      <Route path="/" exact={true} element={<Home />}></Route>
      <Route path="/counter" exact={true} element={<ConnectedCounter />}></Route>
    </Routes>
  </>
));
app.start('#root');
