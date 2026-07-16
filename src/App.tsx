import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import ContactScreen from './screens/ContactScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import FestivalsScreen from './screens/FestivalsScreen';
import AdminDashboard from './admin/AdminDashboard';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const hostname = window.location.hostname;
  const urlParams = new URLSearchParams(window.location.search);
  
  // Detect if user is on admin subdomain (admin.vioramedia.in / admin.localhost) or has the preview query parameter
  const isAdmin = hostname.startsWith('admin.') || urlParams.get('admin') === 'true';

  if (isAdmin) {
    return (
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="*" element={<AdminDashboard />} />
        </Routes>
      </Router>
    );
  }

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
            <Route path="/festivals" element={<FestivalsScreen />} />
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
