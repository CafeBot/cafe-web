import React from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import My_order from'./Scripts/my_order';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick = {()=>ReactDOM.render(<My_order/>, document.getElementById('root'))}>Home</button>
      </header>
    </div>
  );
}

export default App;
