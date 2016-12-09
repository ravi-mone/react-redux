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

const reducers = function(state={movieslist: null, year: 1920}, action){

    switch(action.type){

        case 'FETCH_USERS_START_THUNK':{

            break;
        }
        case 'RECEIVE_USERS':{
            return Object.assign({}, state, {movieslist:action.payload})
            break;
        }
        case 'FETCH_USERS_ERROR_THUNK':{
            return Object.assign({}, state, {movieslist:action.payload})
            break;
        }
        case 'FETCH_USERS_PROMISE_PENDING':{
            return Object.assign({}, state, {movieslist:'LOADING...'})
            break;
        }

        case 'FETCH_USERS_PROMISE_REJECTED': {
            return Object.assign({}, state, {movieslist:`Message from PROMISE : ${action.payload.toString()} `})
            break;
        }
        case 'FETCH_USERS_PROMISE_FULFILLED':{
            return Object.assign({}, state, {movieslist:action.payload.data})
            break;
        }


        case 'FETCH_MOVIES_LIST':
            fetch('http://localhost:8081/getMovies')
                .then(function (response) {
                    if(response.status == 200){
                        return response.json();
                    }
                }).then(function(movies) {
                    console.log('movies :', movies)

                return Object.assign({}, state, {movieslist:movies})
            });
        case 'INCREMENT':
            
            return Object.assign({}, state, { year: state.year + 1 });
        case 'DECREMENT':
            return Object.assign({}, state, { year: state.year - 1 });

        default :
            return state

    }

}




//const store = createStore(reducers, applyMiddleware(promises(), thunk, logger()));

const store = createStore(reducers, composeWithDevTools(
    applyMiddleware(promises(), thunk, logger())
    // other store enhancers if any
));

//let store =  applyMiddleware(logger)(createStore)(reducers);


class MovieList extends React.Component{

    constructor(){
        super();
        this.fetchMoviesUsingThunk = this.fetchMoviesUsingThunk.bind(this);
        this.fetchMoviesUsingPromises = this.fetchMoviesUsingPromises.bind(this);
        this.updateSelectedYear = this.updateSelectedYear.bind(this);
        this.incrementCounter = this.incrementCounter.bind(this);
        this.decrementCounter = this.decrementCounter.bind(this);
        this.selectedYear=1920;
    }


    incrementCounter() {
        store.dispatch({ type: 'INCREMENT', year: this.selectedYear });
    }

    decrementCounter() {
        store.dispatch({ type: 'DECREMENT', year: this.selectedYear });
    }

    fetchMoviesUsingThunk(){
        this.updateSelectedYear();
        console.log(this.selectedYear)
        //store.dispatch({ type: 'FETCH_MOVIES_LIST' });
        store.dispatch((dispatch) =>{
            dispatch({"type": "FETCH_USERS_START_THUNK"})
            axios.get(`http://localhost:8081/getMovies/${this.selectedYear}`)
                .then(function (response) {
                    dispatch({type:'RECEIVE_USERS', payload: response.data})
                }).catch(function(error) {
                console.log('movies :', error)

                dispatch({type:'FETCH_USERS_ERROR_THUNK', payload: `Message from THUNK ${error.toString()}`})
            });
        })
    }
    fetchMoviesUsingPromises(){
        this.updateSelectedYear();
        store.dispatch({
            type: 'FETCH_USERS_PROMISE',
            payload: axios.get(`http://localhost:8081/getMovies/${this.selectedYear}`)
        })
    }

    updateSelectedYear(){
        this.selectedYear=document.querySelector('#selectedYear option:checked').value;
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
            <select id="selectedYear" value={storeValues.year} onChange={this.updateSelectedYear}>
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