import {BrowserRouter, Switch, Route} from "react-router-dom";
import PageNotFound from './components/PageNotFound';
import Login from './components/Login';
import UserScreen from "./components/UserScreen";

function App() {
  return (
   <BrowserRouter>
   <Switch>
     <Route path="/"  exact component={Login}>
     </Route>
     <Route path="/me"  exact component={UserScreen}>
     </Route>
     <Route  component={PageNotFound}>
     </Route>
   </Switch>
   </BrowserRouter>
  );
}

export default App;
