import React, { Component } from "react";
import { Provider } from "react-redux";
import configureStore from "./src/configureStore";
import TimerContainer from "./src/components/TimerContainer";

export const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <TimerContainer />
      </Provider>
    );
  }
}

export default App;
