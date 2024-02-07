import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import CustomersPageWithPagination from "./pages/CustomersPageWithPagination";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import authAPI from "./services/authAPI";
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './contexts/AuthContext';
import CustomerPage from './pages/CustomerPage';

authAPI.setup()

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated())

  // on donne les infos à la forme de notre contexte
  const contextValue = {
    isAuthenticated: isAuthenticated,
    setIsAuthenticated: setIsAuthenticated
  }

  return (
    <AuthContext.Provider value={contextValue}> 
      <Router>
        <Navbar />
        <main className="container pt-5">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/invoices" element={
              <PrivateRoute>
                <InvoicesPage />
              </PrivateRoute>
            } />
            <Route path="/customerpage" element={<CustomersPageWithPagination />} />
            <Route path="/customer/:id" element={
               <PrivateRoute>
                  <CustomerPage />
               </PrivateRoute>
              } />
            <Route path="/customers" element={
              <PrivateRoute>
                <CustomersPage />
              </PrivateRoute>
            } />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </Router>
    </AuthContext.Provider>
   );
}
 
export default App;