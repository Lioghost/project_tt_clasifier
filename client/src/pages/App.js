import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Favicon from '../components/common/favicon'; 
import Header from '../components/header/header';
import MainView from '../components/mainview/mainview';
import Login from '../components/login/login';

function App() {
  return (
    <Router>
      <div className="App">
        <Favicon />
        <Header />
        <Routes>
          <Route path="/" element={<MainView />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register"/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
