import { ScaleFade } from "@chakra-ui/react";
import { Redirect, Route, Switch } from "react-router-dom";
import VerticalLayout from "../../Components/VerticalLayout";
import { CompanyProvider } from "../../Contexts/CompanyContext";
import Budget from "./Budget";
import Expenses from "./Expenses";
import DashHome from "./Home";
import Insights from "./Insights";
import Notes from "./Notes";
import Tasks from "./Tasks";

const Dashboard = () => {
  return (
    <ScaleFade in={true}>
      <CompanyProvider>
        <VerticalLayout>
          <Switch>
            <Route path="/dashboard/home" component={DashHome} exact />

            <Route path="/dashboard/budget" component={Budget} exact />
            <Route path="/dashboard/expenses" component={Expenses} exact />
            <Route path="/dashboard/insights" component={Insights} exact />
            <Route path="/dashboard/tasks" component={Tasks} exact />
            <Route path="/dashboard/notes" component={Notes} exact />
            <Route path="/dashboard/settings" component={Budget} exact />

            {/* redirects */}
            <Redirect from="/dashboard" to="/dashboard/home" />
            <Redirect from="/dashboard/*" to="/dashboard/home" />
          </Switch>
        </VerticalLayout>
      </CompanyProvider>
    </ScaleFade>
  );
};
export default Dashboard;
