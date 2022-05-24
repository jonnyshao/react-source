/**
 * 绑定action 创建者和仓库的dispatch派发动作的方法
 * @param {*} actionCreators
 * @param {*} dispatch
 */
export default function bindActionCreators(actionCreators, dispatch) {
  const boundActionCreatros = {};
  Object.keys(actionCreators).forEach((key) => {
    const actionCreator = actionCreators[key];
    boundActionCreatros[key] = bindActionCreator(actionCreator, dispatch);
  });
  return boundActionCreatros;
}

/**
 *
 * @param {*} actionCreator 老的actionCreator
 * @param {*} dispatch // store的dispatch
 * @returns
 */
function bindActionCreator(actionCreator, dispatch) {
  return function (...args) {
    return dispatch(actionCreator.apply(this, args));
  };
}
