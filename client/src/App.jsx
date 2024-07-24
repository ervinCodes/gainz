import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import './css/App.css';

const App = () => {
  return (
    <div className="h-full">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default App
