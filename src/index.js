import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './demo1/App1';
// import App from './demo2/app-without-lazy';
// import App from './demo2/app-with-lazy';



import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
