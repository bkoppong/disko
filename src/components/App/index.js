import React from 'react'
import { Provider } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore' // make sure you add this for firestore
import 'firebase/functions'
import 'firebase/analytics'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { createFirestoreInstance } from 'redux-firestore'

import configureStore from '../../redux/store'
import { firebase as fbConfig, rrfConfig } from '../../config'

import {
  Row,
} from 'antd';

import 'antd/dist/antd.css';
import './App.css';

import Router from '../Router';

const initialState = window && window.__INITIAL_STATE__ // set initial state here
const store = configureStore(initialState)
// Initialize Firebase instance
firebase.initializeApp(fbConfig)
// firebase.analytics()

export default function App() {

  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider
        firebase={firebase}
        config={rrfConfig}
        dispatch={store.dispatch}
        createFirestoreInstance={createFirestoreInstance}>
        <Row
          type="flex"
          justify="center"
        >
          <Router />
        </Row>
      </ReactReduxFirebaseProvider>
    </Provider>
  )
}
