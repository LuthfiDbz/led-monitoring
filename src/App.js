import logo from "./logo.svg";
import "./App.css";
import {LEDPages} from "./Pages/LEDPages";

function App() {
  return (
    <div className="App bg-dark" style={{height: "100vh"}}>
      <LEDPages />
    </div>
  );
}

export default App;
