import * as React from "react";
import * as ReactDOM from "react-dom";
import Home from "./home/Home";
import { LocaleContextProvider } from "../scripts/i18n";
import { BrowserRouter, Link } from "react-router-dom";
import { Route, Switch } from "react-router";
import { MainView } from "./MainView";
import { RecoilRoot } from "recoil";

const ContextWrap: React.FC = ({ children }) => {
  return (
    <RecoilRoot>
      <LocaleContextProvider>{children}</LocaleContextProvider>
    </RecoilRoot>
  );
};

const App: React.FC<{}> = () => {
  return (
    <div>
      <ContextWrap>
        <BrowserRouter basename="/app">
          <Switch>
            <Route path="/view/">
              <MainView />
            </Route>
            <Route exact path="/">
              <Link to="/view/">Link</Link>
              <Home />
            </Route>
          </Switch>
        </BrowserRouter>
      </ContextWrap>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app_root"));
