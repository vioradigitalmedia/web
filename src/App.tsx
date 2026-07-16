import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import ContactScreen from './screens/ContactScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-black text-white selection:bg-secondary selection:text-black">
        
        {/* Header Layout */}
        <Header />

        {/* Main page content area wrapped in router switch */}
        <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/aboutus" element={<AboutScreen />} />
              <Route path="/contact" element={<ContactScreen />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyScreen />} />
              <Route path="*" element={<HomeScreen />} />
            </Routes>
        </main>

        {/* Footer Layout */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;
