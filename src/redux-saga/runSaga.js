import { ALL, CALL, CANCEL, CPS, FORK, PUT, TAKE } from './effectTypes';

const CANCLE_TASK = 'CANCLE_TASK';

function runSaga(env, saga, callback) {
  const task = { cancel: () => next(CANCLE_TASK) };
  const { channel, dispatch, getState } = env;
  //   如果是生成器执行得到迭代器，如果已经是迭代器了，直接用就可以
  let it = typeof saga == 'function' ? saga() : saga;
  function next(value, hasError) {
    let result;
    if (hasError) {
      result = it.throw(value);
    } else if (value === CANCLE_TASK) {
      result = it.return(value);
    } else {
      result = it.next(value);
    }
    let { done, value: effect } = result;

    if (!done) {
      // 如果value 或者是说effect是一个迭代器
      if (typeof effect[Symbol.iterator] === 'function') {
        runSaga(env, effect);
        next();
      } else if (effect instanceof Promise) {
        effect.then(next);
      } else {
        switch (effect.type) {
          case TAKE:
            //   订阅actionType事件，回调就是next
            channel.once(effect.actionType, next);
            break;
          case PUT:
            dispatch(effect.action);
            next(); // PUT指令不阻塞 继续几下执行
            break;
          case FORK:
            let forkTask = runSaga(env, effect.saga);
            next(forkTask);
            break;
          case CALL:
            effect.fn(...effect.args).then(next);
            break;
          case CPS:
            effect.fn(...effect.args, (err, data) => {
              if (err) {
                next(err, true);
              } else {
                next(data);
              }
            });
            break;
          case ALL:
            const { iterators } = effect;
            let result = [];
            let count = 0;

            iterators.forEach((iterator, index) => {
              runSaga(env, iterator, (data) => {
                result[index] = data;
                if (++count === iterators.length) {
                  next(result);
                }
              });
            });
            break;
          case CANCEL:
            effect.task.cancel();
            next();
            break;
          default:
            break;
        }
      }
    } else {
      callback && callback(effect);
    }
  }
  next();
  return task;
}

export default runSaga;
