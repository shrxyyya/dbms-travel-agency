
// import AuthPage from './components/AuthPage';

// function App() {
//   return (
//     <div className="App">
//       <AuthPage />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter, Route,Routes } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/home'
import Booking from './pages/Booking'
import Payment from './pages/Payment'
// const App = () => {
//     return (
//         <div className='App'>
            
//                 <Login/>
//                 <Dashboard />
            
//         </div>
//     );
// };

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/payment" element={<Payment />} />
          </Routes>
      </BrowserRouter>
  );
}
export default App;



