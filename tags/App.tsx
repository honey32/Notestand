import * as React from "react";
import * as ReactDOM from "react-dom";
import Home from "./home/Home";
import { LocaleContextProvider } from "../scripts/i18n";
import { BrowserRouter, Link } from "react-router-dom";
import { Route, Switch } from "react-router";
import { MainView } from "./MainView";
import { RecoilRoot } from "recoil";
import { useThemeInitialization } from "../scripts/theme";

const ContextWrap: React.FC = ({ children }) => {
  return (
    <RecoilRoot>
      <LocaleContextProvider>{children}</LocaleContextProvider>
    </RecoilRoot>
  );
};

const AppContents: React.FC<{}> = () => {
  useThemeInitialization();
  return (
    <BrowserRouter basename="/app">
      <Switch>
        <Route path="/view/">
          <MainView />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

const App: React.FC<{}> = () => {
  return (
    <div>
      <ContextWrap>
        <AppContents />
      </ContextWrap>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app_root"));
