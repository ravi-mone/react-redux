import React from 'react';
import ReactDOM from 'react-dom';
import MovieList from './components/Movies';
import Store from './components/stores/MoviesStores'
import { Provider, connect} from 'react-redux';

//1. Using connect() method to use it each time
function mapStateToProps(state) {
   return state;
}

const Connector = connect(mapStateToProps)(MovieList);

ReactDOM.render(
    <Provider store={Store}>
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

