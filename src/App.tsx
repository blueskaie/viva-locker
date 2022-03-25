import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Layout from "layouts";
import CreateLock from "pages/Lock/CreateLock";
import TokenList from "pages/Lock/TokenList";
import LiquidityList from "pages/Lock/LiquidityList";
import Token from "pages/Lock/Token";
import TokenRecord from "pages/Lock/TokenRecord";
import EditLock from "pages/Lock/EditLock";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

const App = () => {
  const [account, setAccount] = useState<string>("");

  return (
    <div className="App">
      <Router>
        <Switch>
          <Layout account={account} setAccount={setAccount}>
            <Route exact path="/">
              <CreateLock account={account} setAccount={setAccount} />
            </Route>
            <Route exact path="/tokenlist">
              <TokenList />
            </Route>
            <Route exact path="/liquiditylist">
              <LiquidityList />
            </Route>
            <Route path="/lock/token/:id">
              <Token />
            </Route>
            <Route path="/lock/tokenrecord/:id">
              <TokenRecord account={account} setAccount={setAccount} />
            </Route>
            <Route path="/lock/editlock/:id">
              <EditLock account={account} setAccount={setAccount} />
            </Route>
          </Layout>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
