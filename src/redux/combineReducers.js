function combineReducers(reducers) {
  // 返回一个根reducer redux应用的唯一reducer
  //{counter,user}

  return function (state = {}, action) {
    let nextState = {};

    Object.keys(reducers).forEach((key) => {
      nextState[key] = reducers[key](state[key], action);
    });
    return nextState;
  };
}

export default combineReducers;
