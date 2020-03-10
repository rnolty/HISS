// It appears store.js runs, and store is initialized, before control reaches here,
//    I guess just by virtue of being in the bundle
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import {Provider} from 'react-redux';
import store from './redux-code/store';
//import './index.css';

export var AppRef = React.createRef();

ReactDOM.render(
    <Provider store={store}>
        <App ref={AppRef}/>
    </Provider>
, document.getElementById('HISS-app') );
