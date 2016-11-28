import React from 'react';
import ReactDOM from 'react-dom';
import {MovieList, store} from './Components/Movies';
import { Provider } from 'react-redux';
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
const renderDOM = ()=>{


    ReactDOM.render(

        <Provider store={store}>

            <MovieList />
        </Provider>, document.getElementById('root'));
}

store.subscribe(renderDOM);
renderDOM();

