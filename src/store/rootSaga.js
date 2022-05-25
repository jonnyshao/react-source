import {
  put,
  take,
  fork,
  takeEvery,
  call,
  cps,
  all,
  delay,
  cancel,
} from '../redux-saga/effects';

import * as actionTypes from './action-types';
// function delay(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

// function delay(ms, callback) {
//   setTimeout(() => {
//     callback('error', 'ol');
//   }, ms);
// }

// function* minusWorkerSaga() {
//   yield delay(1000);
//   yield put({ type: actionTypes.MINUS });
// }

// function* addWorkerSaga() {
//   //   yield delay(1000);
//   yield cps(delay, 1000);
//   yield put({ type: actionTypes.ADD });
// }

// function* watcherSaga() {
//   yield takeEvery(actionTypes.ASYNC_ADD, addWorkerSaga);
//   yield take(actionTypes.ASYNC_ADD);
//   yield fork(addWorkerSaga);
//   yield take(actionTypes.ASYNC_MINUS);
//   yield minusWorkerSaga();
// }
export function* add1() {
  for (let i = 0; i < 1; i++) {
    yield take(actionTypes.ASYNC_ADD);
    yield put({ type: actionTypes.ADD });
  }
  console.log('add1 done ');
  return 'add1Result';
}
export function* add2() {
  for (let i = 0; i < 2; i++) {
    yield take(actionTypes.ASYNC_ADD);
    yield put({ type: actionTypes.ADD });
  }
  console.log('add2 done ');
  return 'add2Result';
}
// export default function* rootSaga() {
//   let result = yield all([add1(), add2()]);
//   console.log('done', result);
// }

function* add() {
  while (true) {
    yield delay(1000);
    yield put({ type: actionTypes.ADD });
  }
}
function* addWorkerSaga() {
  //   yield delay(1000);
  const task = yield fork(add);
  yield take(actionTypes.STOP);
  yield cancel(task);

  //   yield put({ type: actionTypes.ADD });
}

export default function* rootSaga() {
  yield addWorkerSaga();
}
