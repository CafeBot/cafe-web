import React from 'react';
import ReactDOM from 'react-dom';
import My_order from'./Scripts/my_order';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <center>
          <img src="https://www.incedoinc.com/templates/common/images/logo.svg" alt="" width="50%"></img><br/>
          <button onClick = {()=>ReactDOM.render(<My_order/>, document.getElementById('root'))}>Place My order</button>
        </center>      
      </header>
    </div>
  );
}

export default App;
