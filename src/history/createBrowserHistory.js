function createBrowserHistory() {
  const globalHistory = window.history;
  let state;
  let listeners = [];
  function go(n) {
    globalHistory.go(n);
  }
  function goBack() {
    go(-1);
  }
  function goForward() {
    go(1);
  }
  //前进 后退事件
  window.addEventListener("popstate", () => {
    let location = {
      state: globalHistory.state,
      pathname: window.location.pathname,
    };
    notify({ action: "POP", location });
  });

  /**
   *
   * @param {*} pathname  可以是个对象|字符串
   * @param {*} nextState
   */
  function push(pathname, nextState) {
    const action = "PUSH";
    if (typeof pathname == "object") {
      state = pathname.state;
      pathname = pathname.pathname;
    } else {
      state = nextState;
    }
    globalHistory.pushState(state, null, pathname);
    notify({ action, locaion: { state, pathname } });
  }

  function listen(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((item) => item !== listener);
    };
  }
  /**
   * 当状态发生改变后调用此函数
   * @param {*} newState
   */
  function notify(newState) {
    Object.assign(history, newState);
    listeners.forEach((listener) =>
      listener({
        action: globalHistory.action,
        location: globalHistory.location,
      })
    );
  }
  const history = {
    action: "POP",
    go,
    goBack,
    goForward,
    push,
    listen,
    location: {
      pathname: window.location.pathname,
      state: window.location.state,
    },
  };

  return history;
}

export default createBrowserHistory;
