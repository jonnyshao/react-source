export default function createStore(reducer, preloadedState) {
  let state = preloadedState;
  let listerners = [];
  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    listerners.forEach((l) => l());
    return action;
  }
  function subscribe(listener) {
    listerners.push(listener);
    return () => {
      listerners = listerners.filter((l) => l !== listener);
    };
  }
  dispatch({ type: "@@REDUX/INIT" });
  return {
    getState,
    dispatch,
    subscribe,
  };
}
