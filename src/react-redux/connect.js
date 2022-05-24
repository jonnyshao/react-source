import React from "react";
import ReactReduxContext from "./ReactReduxContext";
import { bindActionCreators } from "../redux";

function connect(mapStateToProps, mapDispatchToProps) {
  return function (OldComponent) {
    return function (props) {
      const { store } = React.useContext(ReactReduxContext);

      const { getState, dispatch, subscribe } = store;
      const prevState = getState();
      const stateProps = React.useMemo(
        () => mapStateToProps(prevState),
        [prevState]
      );
      let dispatchProps = React.useMemo(() => {
        if (typeof mapDispatchToProps == "function") {
          return mapDispatchToProps(dispatch);
        }

        return bindActionCreators(mapDispatchToProps, dispatch);
      }, [dispatch]);
      const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
      React.useLayoutEffect(() => {
        console.log("useLayoutEffect");
        return subscribe(forceUpdate);
      }, []);
      //   React 18 组件更新方法
      //   React.useSyncExternalStore(subscribe, getState);

      return <OldComponent {...stateProps} {...dispatchProps} {...props} />;
    };
  };
}

export default connect;
