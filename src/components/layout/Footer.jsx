import { Link } from 'react-router-dom';
import { BROKER_INFO } from '../../data/mockData';
import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from 'lucide-react';
import { cn } from './Navbar';

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white/80 pt-24 pb-8 border-t border-brand-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="lg:pr-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/10 rounded-sm flex items-center justify-center border border-white/20">
                <span className="text-brand-500 font-bold text-2xl ">M</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-bold text-xl leading-none tracking-wide text-white">MADHAV</span>
                <span className="text-[10px] tracking-[0.3em] font-medium text-brand-500 mt-1">REAL ESTATE</span>
              </div>
            </div>
            <p className="text-sm mb-8 leading-relaxed font-light">
              Personal property guidance for buying, selling and renting in your local market. 
              Discreet, honest, and completely tailored to you.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white  font-bold text-lg mb-6">Explore</h3>
            <ul className="space-y-4 text-sm font-light">
              <li><Link to="/services" className="hover:text-brand-500 transition-colors">Our Services</Link></li>
              <li><Link to="/about" className="hover:text-brand-500 transition-colors">About {BROKER_INFO.name}</Link></li>
              <li><Link to="/contact" className="hover:text-brand-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white  font-bold text-lg mb-6">Consultation</h3>
            <ul className="space-y-4 text-sm font-light">
              <li><Link to="/?intent=Buy" className="hover:text-brand-500 transition-colors">Buy a Property</Link></li>
              <li><Link to="/?intent=Sell" className="hover:text-brand-500 transition-colors">Sell Your Property</Link></li>
              <li><Link to="/?intent=Rent" className="hover:text-brand-500 transition-colors">Rent a Property</Link></li>
              <li><Link to="/?intent=RentOut" className="hover:text-brand-500 transition-colors">Rent Out Property</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white  font-bold text-lg mb-6">Direct Line</h3>
            <ul className="space-y-6 text-sm font-light">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="text-brand-500 shrink-0 mt-1" />
                <span className="leading-relaxed">{BROKER_INFO.address}</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={18} className="text-brand-500 shrink-0" />
                <span>{BROKER_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={18} className="text-brand-500 shrink-0" />
                <span>{BROKER_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-white/50">
          <p>&copy; {new Date().getFullYear()} Madhav Real Estate. All rights reserved.</p>
          <p className="tracking-widest uppercase">Digital Experience by Madhav</p>
        </div>
      </div>
    </footer>
  );
}
