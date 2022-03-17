import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Header from './Header'
import Footer from './Footer'
import Playlist from './playlist';

import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
         <Header name='Welcome to Music Playlist Manager' />
        <Playlist />
         <Footer />

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
