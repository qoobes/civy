import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { PrivateRoute } from "./Components/PrivateRoute";
import Create from "./Pages/Create";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Home} exact />

        {/* auth */}
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />

        {/* dahsboard */}
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/dashboard/*" component={Dashboard} />

        {/* company creation */}
        <PrivateRoute path="/create" component={Create} />

        <Redirect from="/about/*" to="/about/us" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
