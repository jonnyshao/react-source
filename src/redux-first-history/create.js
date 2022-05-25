import { locationChangeAction } from './actions';
import { createRouterMiddleware } from './middleware';
import { createRouterReducer } from './reducer';

export function createReduxHistoryContext({ history }) {
  const routerMiddleware = createRouterMiddleware(history);
  const routerReducer = createRouterReducer(history);
  function createReduxHistory(store) {
    //   初始化派发一次
    store.dispatch(locationChangeAction(history.location, history.action));
    // 订阅路径变化事件，当路径发生变化后重新添加动作给仓库 保存路径
    history.listen(({ location, action }) => {
      store.dispatch(locationChangeAction(location, action));
    });
    return history;
  }
  return {
    routerMiddleware,
    createReduxHistory,
    routerReducer,
  };
}
