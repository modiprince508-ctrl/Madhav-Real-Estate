import { motion } from 'framer-motion';
import { Home, HandCoins, Building, Key, ShieldCheck, TrendingUp, Phone, ArrowRight } from 'lucide-react';
import { BROKER_INFO } from '../data/mockData';
import { Link } from 'react-router-dom';

export default function Services() {
  const services = [
    {
      title: 'Property Buying',
      desc: 'Discover exclusive properties before they hit the open market. We align your lifestyle needs with the right location and property type.',
      icon: Home
    },
    {
      title: 'Property Selling',
      desc: 'Discreet and effective marketing of your asset. We connect your property with our private network of verified buyers.',
      icon: HandCoins
    },
    {
      title: 'Premium Rentals',
      desc: 'End-to-end assistance for finding luxury rentals that suit your requirements, handled with complete privacy.',
      icon: Key
    },
    {
      title: 'Leasing Solutions',
      desc: 'Find the right, reliable tenants for your residential or commercial spaces through our rigorous screening process.',
      icon: Building
    },
    {
      title: 'Market Insights',
      desc: 'Honest, localized market intelligence to help you make informed investment decisions in emerging corridors.',
      icon: TrendingUp
    },
    {
      title: 'Secure Transactions',
      desc: 'Complete guidance on negotiation, paperwork, and legal compliance to ensure a smooth, worry-free handover.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-brand-50 selection:bg-brand-500 selection:text-white">
      
      {/* Header */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <span className="text-[10px] tracking-widest text-brand-500 font-bold uppercase mb-4 block">Expertise & Services</span>
          <h1 className="text-4xl md:text-6xl  font-bold text-brand-900 mb-8 leading-tight">
            Comprehensive Real Estate Guidance.
          </h1>
          <p className="text-lg md:text-xl text-brand-900/70 leading-relaxed font-light">
            We don't just facilitate transactions; we build long-term relationships through transparent, honest, and expert advice.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-brand-900/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="w-12 h-12 bg-white border border-brand-900/10 flex items-center justify-center mb-6 group-hover:border-brand-500 transition-colors">
                <service.icon className="text-brand-500 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-4 ">{service.title}</h3>
              <p className="text-sm text-brand-900/70 leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-24 py-24 bg-brand-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-[10px] tracking-widest text-brand-500 font-bold uppercase mb-4 block">Take the Next Step</span>
          <h2 className="text-3xl md:text-5xl  font-bold mb-8">Discuss your requirement directly.</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/?intent=Buy"
              className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 text-sm font-bold tracking-wider uppercase transition-all shadow-xl text-center flex items-center justify-center gap-2"
            >
              Start Consultation <ArrowRight size={16} />
            </Link>
            <a 
              href={`https://wa.me/${BROKER_INFO.whatsapp}?text=Hello%20Jayeshbhai,%20I%20would%20like%20to%20know%20more%20about%20your%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-wider uppercase transition-all text-center flex items-center justify-center gap-2"
            >
              <Phone size={16} /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
