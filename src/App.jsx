import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login/Login';
import User from './User';
import Admin from './Admin';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/admin" element={<Admin />}/>
        <Route path="/user" element={<User />}/>
      </Routes>
    </Router>
  );
}


export default App;