/**
 * Created by techjini on 25/11/16.
 */
import React from 'react';
import axios from 'axios'
import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import logger from 'redux-logger'
import promises from 'redux-promise-middleware'



const reducers = function(state={movieslist: null, counter: 0}, action){

    switch(action.type){

        case 'FETCH_USERS_START_THUNK':{

            break;
        }
        case 'RECEIVE_USERS':{
console.log('action.payload', action.payload)
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
            console.log('HERE', action.payload)
            return Object.assign({}, state, {movieslist:`Message from PROMISE : ${action.payload.toString()} `})
            break;
        }
        case 'FETCH_USERS_PROMISE_FULFILLED':{
            console.log('action.payload', action.payload.data)
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
            return Object.assign({}, state, { counter: state.counter + 1 });
        case 'DECREMENT':
            return Object.assign({}, state, { counter: state.counter - 1 });

        default :
            return state

    }

}




const store = createStore(reducers, applyMiddleware(promises(), thunk, logger()));
//let store =  applyMiddleware(logger)(createStore)(reducers);


class MovieList extends React.Component{



    incrementCounter() {
        store.dispatch({ type: 'INCREMENT' });
    }

    decrementCounter() {
        store.dispatch({ type: 'DECREMENT' });
    }

    fetchMoviesUsingThunk(){
        //store.dispatch({ type: 'FETCH_MOVIES_LIST' });
        store.dispatch((dispatch) =>{
            dispatch({"type": "FETCH_USERS_START_THUNK"})
            axios.get('http://localhost:8081/getMovies')
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
            payload: axios.get('http://localhost:8081/getMovies')
        })
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
    render() {
        let storeValues = store.getState() || {counter : 0};


        let myMovieList = storeValues.movieslist;
        if(storeValues.movieslist instanceof Array){
            let liDOM = this.getMovies(storeValues.movieslist);
            myMovieList = (<div>
                <h1>Movies List</h1>
                <hr />
                <table >
                    <tr>
                        <th>Title</th>
                        <th>Director</th>
                        <th>Cast</th>
                        <th>Genre</th>
                        <th>Notes</th>
                        <th>Cinematographer</th>
                    </tr>
                    {liDOM}
                </table>
            </div>)
        }

        return <div>
            <p>{ storeValues.counter }</p>
            <div>
                <button onClick={this.incrementCounter}>+</button>
                <button onClick={this.decrementCounter}>-</button>
                <button onClick={this.fetchMoviesUsingThunk}>Fetch Movies List Using <code>THUNK</code></button>
                <button onClick={this.fetchMoviesUsingPromises}>Fetch Movies List Using <code>PROMISE</code></button>
            </div>
            <h1>My Movies List</h1>
            {myMovieList}
        </div>
    }
}


export {MovieList, store};