import React from 'react';
import ReactDOM from 'react-dom';
import {MovieList, store} from './Components/Movies';
import { Provider, connect} from 'react-redux';

//1. Using connect() method to use it each time
function mapStateToProps(state) {
   return state;
}

const Connector = connect(mapStateToProps)(MovieList);

ReactDOM.render(
    <Provider store={store}>
        <Connector />
    </Provider>, document.getElementById('root'));



//2. Using subscribe() method to get the latest changes every time
/*
const renderDOM = ()=>{

    ReactDOM.render(
        <Provider store={store}>
            <MovieList />
        </Provider>, document.getElementById('root'));
}

store.subscribe(renderDOM);
renderDOM();*/

