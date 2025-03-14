import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { store,persistor } from './redux/store.js';
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PersistGate persistor={persistor}>
  <Provider store={store}>
    <App />
  </Provider>
  </PersistGate>
);
