const MovieReducers = function(state={movieslist: null, year: 1920}, action){

    switch(action.type){

        case 'FETCH_USERS_START_THUNK':{
            return Object.assign({}, state, {year : state.year})
            break;
        }
        case 'RECEIVE_USERS':{
            return Object.assign({}, state, {movieslist:action.payload})
            break;
        }
        case 'FETCH_USERS_ERROR_THUNK':{
            return Object.assign({}, state, {movieslist:action.payload, year : state.year})
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

        case 'SET_SELECTED_VALUE':
            return Object.assign({}, state, { year: Number.parseInt(action.year) });
        default :
            return state

    }

}

export default MovieReducers;