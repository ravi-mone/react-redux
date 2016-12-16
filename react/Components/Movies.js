/**
 * Created by techjini on 25/11/16.
 */
import React from 'react';
    import axios from 'axios'
import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import logger from 'redux-logger'
import promises from 'redux-promise-middleware'
import { composeWithDevTools } from 'redux-devtools-extension';
import MovieReducers from './MovieReducers'
let selectedYear=1920;


//const store = createStore(reducers, applyMiddleware(promises(), thunk, logger()));

const store = createStore(MovieReducers, composeWithDevTools(
    applyMiddleware(promises(), thunk, logger())
    // other store enhancers if any
));

class MovieList extends React.Component{

    constructor(props){
        super(props);
    }


    incrementCounter() {

        store.dispatch({ type: 'INCREMENT', year: store.getState().year });
    }

    decrementCounter() {
        store.dispatch({ type: 'DECREMENT', year: store.getState().year });
    }

    fetchMoviesUsingThunk(){
        store.dispatch((dispatch) =>{
            dispatch({"type": "FETCH_USERS_START_THUNK"})
            axios.get(`http://localhost:8081/getMovies/${store.getState().year}`)
                .then(function (response) {
                    dispatch({type:'RECEIVE_USERS', payload: response.data})
                }).catch(function(error) {
                console.log('movies :', error)

                dispatch({type:'FETCH_USERS_ERROR_THUNK', payload: `Message from THUNK ${error.toString()}`})
            });
        })
    }
    fetchMoviesUsingPromises(){
        store.dispatch({
            type: 'FETCH_USERS_PROMISE',
            payload: axios.get(`http://localhost:8081/getMovies/${store.getState().year}`)
        })
    }

    updateSelectedYear(){
        selectedYear=document.querySelector('#selectedYearId option:checked').value || store.getState().year;
        store.dispatch({ type: 'SET_SELECTED_VALUE', year: selectedYear });
    }

    getMovies(movies){

        return movies.map((movie, i)=>{
            return (
                <tr key={i}>
                    <td>{movie.title}</td>
                    <td>{movie.director}</td>
                    <td>{movie.cast}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.notes}</td>
                    <td>{movie.cinematographer}</td>
                </tr>)
        });
    }
    range(start, stop, step = 1){
        let a=[start], b=start;
        while(b<stop){b+=step;a.push(<option value={b} key={b}>{b}</option>)}
        return a;
    };

    render() {
        let storeValues = store.getState();
        let yearsDropDown = (
            <select id="selectedYearId" value={storeValues.year} onChange={this.updateSelectedYear}>
                {this.range(1919, 2017)}
            </select>
        ) ;
        let myMovieList = storeValues.movieslist;
        if(storeValues.movieslist instanceof Array){
            let liDOM = this.getMovies(storeValues.movieslist);
            myMovieList = (<div>
                <h1>Movies List</h1>
                <hr />
                <table >
                    <tbody>
                    {liDOM}
                    </tbody>
                </table>
            </div>)
        }

        return (
            <div>
                <div>
                    Select Years : {yearsDropDown}
                    <button onClick={this.incrementCounter}>+</button>
                    <button onClick={this.decrementCounter}>-</button>
                    <br /> <br />
                    <button onClick={this.fetchMoviesUsingThunk}>Fetch Movies List Using <code>THUNK</code></button>
                    <button onClick={this.fetchMoviesUsingPromises}>Fetch Movies List Using <code>PROMISE</code></button>
                </div>
                {myMovieList}
            </div>
        )
    }
}


export {MovieList, store};