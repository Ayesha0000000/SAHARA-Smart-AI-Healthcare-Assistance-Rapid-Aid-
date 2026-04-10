import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import AICheck from './pages/AICheck';
import Doctors from './pages/Doctors';
import Hospitals from './pages/Hospitals';
import Emergency from './pages/Emergency';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-check" element={<AICheck />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}
