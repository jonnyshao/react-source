function createHashHistory() {
  // 类似于历史栈，用来手工维护路径条目
  let historyStack = [];
  // 栈指针
  let index = -1;
  let action = "POP";
  // 当前路径对应的状态
  let state;
  // 监听函数的数组
  let listeners = [];

  function go(n) {
    action = "POP";

    if (index + n < 0 || index + n >= historyStack.length) return;
    index += n;
    let nextLocation = historyStack[index];
    state = nextLocation.state;
    window.location.hash = nextLocation.pathname;
  }
  function listen(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((item) => item !== listener);
    };
  }
  function hashChangeHandler() {
    let pathname = window.location.hash.slice(1);
    Object.assign(history, { action, location: { pathname, state } });
    listeners.forEach((listener) => listener({ location: history.location }));
    if (action === "PUSH") {
    }
  }
  function goBack() {
    go(-1);
  }
  function goForward() {
    go(1);
  }

  window.addEventListener("hashchange", hashChangeHandler);

  function push(pathname, nextState) {
    const action = "PUSH";
    if (typeof pathname == "object") {
      state = pathname.state;
      pathname = pathname.pathname;
    } else {
      state = nextState;
    }
    window.location.hash = pathname;
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
  if (window.location.hash) {
    action = "PUSH";
    hashChangeHandler();
  } else {
    window.location.hash = "/";
  }
  return history;
}

export default createHashHistory;
