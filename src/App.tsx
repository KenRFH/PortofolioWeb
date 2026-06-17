
import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<Dashboard />} />
    </Routes>
  );
};

export default App;