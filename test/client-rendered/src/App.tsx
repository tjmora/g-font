import React from 'react';
import './App.css';
import SectionSwitcher from './components/SectionSwitcher';


function App() {
  console.log("process.node.NODE_ENV is " + process.env.NODE_ENV);
  return (
    <div className="App">
      <SectionSwitcher />
    </div>
  );
}

export default App;
