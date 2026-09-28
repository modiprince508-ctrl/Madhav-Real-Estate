import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/ui/FloatingWhatsApp';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import ScrollToTop from './components/layout/ScrollToTop';
import LeadFormModal from './components/ui/LeadFormModal';

import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import PropertiesManager from './pages/admin/PropertiesManager';
import PropertyForm from './pages/admin/PropertyForm';
import EnquiriesManager from './pages/admin/EnquiriesManager';
import SiteVisitsManager from './pages/admin/SiteVisitsManager';
import TestimonialsManager from './pages/admin/TestimonialsManager';
import AreasManager from './pages/admin/AreasManager';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Admin Routes - without global Navbar/Footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="properties" element={<PropertiesManager />} />
            <Route path="properties/new" element={<PropertyForm />} />
            <Route path="properties/:id/edit" element={<PropertyForm />} />
            <Route path="enquiries" element={<EnquiriesManager />} />
            <Route path="site-visits" element={<SiteVisitsManager />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="areas" element={<AreasManager />} />
          </Route>

          {/* Public Routes - with global Navbar/Footer */}
          <Route path="/*" element={
            <div className="min-h-screen flex flex-col bg-brand-50">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
              <FloatingWhatsApp />
              <LeadFormModal />
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
