import React from 'react';
import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import logger from 'redux-logger'
import promises from 'redux-promise-middleware'
import { composeWithDevTools } from 'redux-devtools-extension';
import MovieReducers from '../reducers/MovieReducers'

const stores = createStore(MovieReducers, composeWithDevTools(
    applyMiddleware(promises(), thunk, logger())
    // other store enhancers if any
));

export default stores;