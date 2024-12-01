import React from 'react';
import logo from './logo.svg';
import './App.css';
import { signal } from '@preact/signals';
import { Route } from 'react-router';


function App() {
  const route = Route;
  const props = signal(true);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
