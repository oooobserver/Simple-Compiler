
import './App.css';
import TopBar from './components/Topbar/TopBar';
import Input from './components/Input/Input'
import  Output from './components/Output/Output'
import React, {useState} from "react";



function App() {
    const [Tokens,setTokens] =  useState([]);
    const [Debug, setDebug] = useState([]);

  return (
    <div className="App">
        <TopBar/>
        <div className="Container">
            <Input setTokens={setTokens} setDebug={setDebug}/>
            <Output Tokens={Tokens} Debug={Debug} />
        </div>
    </div>
  );
}

export default App;
