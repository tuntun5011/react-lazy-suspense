import React, { Suspense, lazy } from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

const Home = lazy(() => import('./Home'));
const Page1 = lazy(() => import('./Page1'));




const App = () => {
  return (
      <Router>
          <Suspense fallback={<div>loading</div>}>
              <div>
                  <ul>
                      <li><Link to='/'>Home</Link></li>
                      <li><Link to='/Page1'>Page1</Link></li>
                  </ul>
              </div>

              <Switch>
                  <Route exact path='/' component={Home} />
                  <Route exact path='/Page1' component={Page1} />
              </Switch>

          </Suspense>
      </Router>
  )


};



export default App;
