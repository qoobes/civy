import { Redirect, Route, Switch } from "react-router-dom";
import DashHome from "./Home";

const Dashboard = () => {
  return (
    <Switch>
      <Route path="/dashboard/home" component={DashHome} />

      <Redirect from="/dashboard" to="/dashboard/home" />
      <Redirect from="/dashboard/*" to="/dashboard/home" />
    </Switch>
  );
};
export default Dashboard;
