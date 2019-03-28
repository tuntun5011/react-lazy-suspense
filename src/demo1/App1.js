import React, { Suspense, lazy } from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

//延时加载
const delayImport = (value, time=1000) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(value), time)
    });
};


/**
 * 基于路由的代码分割，可以替换react-loadable
 * */
const Home = lazy(() => import('./Home'));
const Page1 = lazy(() => import('./Page1'));
// const Page1 = lazy(() => delayImport(import('./Page1'),1000));





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
