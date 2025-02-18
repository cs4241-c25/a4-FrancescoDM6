import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';       // Adjust path if you move them to /pages/
import Dashboard from './pages/Dashboard.jsx'; // Adjust accordingly

function App() {
  return (
    <Router>
      {/* You could also add a Seo component here if needed */}
      <main role="main" className="wrapper">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Dashboard />} />
        </Routes>
      </main>
      {/* Optionally add a footer */}
    </Router>
  );
}

export default App;
