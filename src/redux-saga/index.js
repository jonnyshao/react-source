import runSaga from './runSaga';
import EventEmitter from 'events';

function createSagaMiddleware() {
  const channel = new EventEmitter();
  let boundRundSaga;
  function sagaMiddleware({ getState, dispatch }) {
    boundRundSaga = runSaga.bind(null, { channel, dispatch, getState });
    return function (next) {
      return function (action) {
        const result = next(action);
        channel.emit(action.type, action);
        return result;
      };
    };
  }

  sagaMiddleware.run = (saga) => boundRundSaga(saga);
  return sagaMiddleware;
}

export default createSagaMiddleware;
