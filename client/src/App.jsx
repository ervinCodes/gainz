import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import './css/App.css';

const App = () => {
  return (
    <>
    <div className="h-full flex flex-col justify-between">
        <Navbar />
          <div className="overflow-y-auto h-full py-20">
            <Outlet />
          </div>
        <Footer />
    </div>

    </>
  );
};

export default App
