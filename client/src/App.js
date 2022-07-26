import "./App.css";
import Login from "./Components/Login";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Register from "./Components/Register";

function App() {
	return (
		<>
			<div className="App">
				<Login></Login>
      </div>
      
      {/* <BrowserRouter>
        <Routes>
          
          <Route path="/register" element={<Register></Register>}></Route>
        </Routes>
      </BrowserRouter> */}
		</>
	);
}

export default App;
