import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './app1.css';

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
const Page2 = lazy(() => import('./Page2'));

// const Page1 = lazy(() => delayImport(import('./Page1'),1000));



const App = () => {
  return (
      <Router>
          <Suspense fallback={<div className='loading'>loading...</div>}>
              <div>
                  <Route path="/" component={Home} />
                  <Route path="/Page1" component={Page1} />
                  <Route path="/Page2" component={Page2} />
              </div>
          </Suspense>
      </Router>
  )


};



export default App;
