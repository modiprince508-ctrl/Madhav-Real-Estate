import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { BROKER_INFO } from '../../data/mockData';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Buy', path: '/?intent=Buy' },
    { name: 'Sell', path: '/?intent=Sell' },
    { name: 'Rent', path: '/?intent=Rent' },
    { name: 'Rent Out', path: '/?intent=RentOut' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    if (path.includes('?intent=')) return location.search.includes(path.split('?')[1]);
    return location.pathname.startsWith(path);
  };

  const isHeroPage = location.pathname === '/';
  const useSolidStyle = isScrolled || !isHeroPage;

  return (
    <>
      <header 
        className={cn(
          "fixed z-[60] transition-all duration-300",
          useSolidStyle 
            ? "top-0 lg:top-6 left-0 right-0 lg:left-6 lg:right-6 xl:max-w-7xl xl:mx-auto bg-brand-50/95 backdrop-blur-md shadow-sm border-b lg:border border-brand-900/10 lg:rounded-lg py-3 lg:py-2" 
            : "top-0 left-0 right-0 bg-transparent py-6 lg:py-8"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-brand-900 rounded-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <span className="text-brand-500 font-bold text-xl lg:text-2xl">M</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className={cn("font-bold text-lg lg:text-xl leading-none tracking-wide transition-colors duration-300", useSolidStyle ? "text-brand-900" : "text-white")}>MADHAV</span>
                  <span className={cn("text-[9px] lg:text-[10px] tracking-[0.3em] font-medium transition-colors duration-300 mt-1", useSolidStyle ? "text-brand-500" : "text-brand-100")}>REAL ESTATE</span>
                </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-[13px] font-semibold tracking-wider uppercase transition-colors duration-300 hover:text-brand-500",
                    useSolidStyle 
                      ? (isActive(link.path) ? "text-brand-500" : "text-brand-900") 
                      : (isActive(link.path) ? "text-brand-500" : "text-white")
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center">
              <a
                href={`https://wa.me/${BROKER_INFO.whatsapp}?text=Hello%20Jayeshbhai,%20I%20would%20like%20your%20guidance.`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "px-6 py-3 rounded-none text-sm font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 border",
                  useSolidStyle 
                    ? "bg-brand-900 text-white border-brand-900 hover:bg-brand-600 hover:border-brand-600 shadow-md" 
                    : "bg-white/10 text-white border-white/20 backdrop-blur-md hover:bg-white/20 shadow-md"
                )}
              >
                <Phone size={16} />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn("p-2 transition-colors duration-300", useSolidStyle || isOpen ? "text-brand-900" : "text-white")}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[50] lg:hidden bg-brand-50 flex flex-col pt-24 pb-8 px-6"
          >
            <div className="flex flex-col gap-6 flex-grow overflow-y-auto">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-3xl font-bold tracking-tight transition-colors duration-300",
                    isActive(link.path) 
                      ? "text-brand-500" 
                      : "text-brand-900 hover:text-brand-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-auto pt-8">
                <a
                  href={`https://wa.me/${BROKER_INFO.whatsapp}?text=Hello%20Jayeshbhai,%20I%20would%20like%20your%20guidance.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-3 bg-brand-900 text-white px-6 py-4 font-semibold tracking-wider uppercase text-sm shadow-xl"
                >
                  <Phone size={20} />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
