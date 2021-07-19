import React from 'react';
import ReactDOM from 'react-dom';
import './dev.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    {/*
     * the string including "css" couldn't be set on any HTML and CSS by Linaria's bug
     * https://github.com/denn1s/vite-plugin-linaria/issues/6
     */}
    <link
      href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@700&family=Teko:wght@700&display=swap"
      rel="stylesheet"
    />
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
