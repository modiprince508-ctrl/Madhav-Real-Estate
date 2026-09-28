import { motion } from 'framer-motion';
import { Home as HomeIcon, Key, Building2, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BROKER_INFO } from '../data/mockData';

export default function Home() {
  const navigate = useNavigate();

  const intentCards = [
    {
      id: 'Buy',
      num: '01',
      title: 'BUY',
      desc: 'Looking for the right property?',
    },
    {
      id: 'Sell',
      num: '02',
      title: 'SELL',
      desc: 'Thinking about selling your property?',
    },
    {
      id: 'Rent',
      num: '03',
      title: 'RENT',
      desc: 'Looking for a rental property?',
    },
    {
      id: 'RentOut',
      num: '04',
      title: 'RENT OUT',
      desc: 'Have a property to rent?',
    }
  ];

  return (
    <div className="bg-brand-50 min-h-screen selection:bg-brand-500 selection:text-white">
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-brand-900">
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000"
            alt="Premium Architecture" 
            className="w-full h-full object-cover"
          />
          {/* Subtle localized text-readability gradient (transparent -> subtle tint -> transparent) */}
          <div className="absolute inset-y-0 left-0 w-full lg:w-3/4 bg-gradient-to-r from-transparent via-brand-900/40 to-transparent"></div>
          {/* Subtle bottom gradient to blend into the next section */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-900/30 to-transparent"></div>
        </motion.div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 mt-16">
            
            {/* Left: Hero Copy */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="w-full lg:w-3/5"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-[84px] text-white leading-[1.05] tracking-tight mb-6 drop-shadow-2xl">
                <span className="font-bold">YOUR PROPERTY.</span><br />
                <span className="text-brand-500 font-medium opacity-90 drop-shadow-lg">OUR GUIDANCE.</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-xl font-medium leading-relaxed mb-10 drop-shadow-lg">
                Personal property guidance for buying, selling and renting — with direct broker communication.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/?intent=Buy"
                  className="bg-brand-500 text-brand-900 hover:bg-brand-600 px-8 py-4 text-sm font-bold tracking-widest uppercase transition-colors duration-300 text-center shadow-lg"
                >
                  Tell Us What You Need &rarr;
                </Link>
                <a 
                  href={`https://wa.me/${BROKER_INFO.whatsapp}?text=Hello%20Jayeshbhai`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-900/40 backdrop-blur-md border border-white/20 text-white hover:bg-brand-900/60 px-8 py-4 text-sm font-bold tracking-widest uppercase transition-colors duration-300 text-center shadow-lg"
                >
                  WhatsApp Jayeshbhai
                </a>
              </div>
            </motion.div>

            {/* Right: Floating Consultation Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="w-full lg:w-2/5 max-w-md hidden md:block group cursor-default"
            >
              <div className="bg-white/95 backdrop-blur-xl p-10 rounded-xl shadow-2xl border border-white/20 relative overflow-hidden transition-transform duration-500 ease-out group-hover:-translate-y-2">
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-500"></div>
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-brand-900 mb-8 text-center">Personal Property Guidance</h3>
                
                <div className="flex items-center justify-center gap-4 text-brand-900/70 text-xs font-bold tracking-widest uppercase mb-12">
                  <span className="hover:text-brand-500 transition-colors">Buy</span> • <span className="hover:text-brand-500 transition-colors">Sell</span> • <span className="hover:text-brand-500 transition-colors">Rent</span> • <span className="hover:text-brand-500 transition-colors whitespace-nowrap">Rent Out</span>
                </div>

                <Link 
                  to="/?intent=Buy"
                  className="block w-full text-center border border-brand-900/20 hover:border-brand-500 hover:bg-brand-500 hover:text-white text-brand-900 py-4 text-xs font-bold tracking-widest uppercase transition-colors duration-300"
                >
                  Get Started &rarr;
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. Primary Lead Section (Buy/Sell/Rent/Rent Out) */}
      <section className="pt-32 pb-24 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20">
            <span className="text-[10px] tracking-widest text-brand-500 font-bold uppercase mb-4 block">Property Services</span>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-900 tracking-tight">HOW CAN WE HELP?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {intentCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              >
                <Link
                  to={`/?intent=${card.id}`}
                  className="group block relative bg-transparent"
                >
                  <div className="absolute -left-4 sm:-left-6 top-0 text-7xl font-light text-brand-900/5 group-hover:text-brand-500/10 transition-colors duration-500">
                    {card.num}
                  </div>
                  <div className="relative z-10 pl-4 sm:pl-8 pt-4 border-l border-brand-900/10 group-hover:border-brand-500 transition-colors duration-500">
                    <h3 className="text-3xl font-bold text-brand-900 mb-2">{card.title}</h3>
                    <p className="text-lg text-brand-900/70 font-light leading-relaxed mb-6">{card.desc}</p>
                    <div className="flex items-center text-xs font-bold uppercase tracking-widest text-brand-900 group-hover:text-brand-500 transition-colors duration-300">
                      Start 
                      <ArrowRight size={16} className="ml-3 transition-transform duration-500 ease-out group-hover:translate-x-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5 Private Broker Differentiator */}
      <section className="py-24 bg-brand-900 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-8">
            NOT A PROPERTY PORTAL.<br/>
            <span className="text-brand-500">A DIRECT CONVERSATION.</span>
          </h2>
          <p className="text-xl text-white/80 font-light leading-relaxed">
            Tell us what you need.<br/>
            Jayeshbhai takes it from there.
          </p>
        </div>
      </section>

      {/* 3. Services Editorial Section */}
      <section className="py-32 bg-white border-b border-brand-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center">
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-900 mb-8 leading-tight tracking-tight">
                PROPERTY GUIDANCE,<br />WITHOUT THE NOISE.
              </h2>
              <div className="space-y-6 text-brand-900/70 text-lg font-light leading-relaxed">
                <p>We strip away the clutter of endless public listings to focus entirely on your specific needs, providing direct, honest consultancy.</p>
                <p>Whether you are entering the market as a first-time homebuyer, looking to liquidate an asset, or searching for the perfect commercial rental, we handle the entire process discreetly.</p>
              </div>
              <div className="mt-12">
                <Link 
                  to="/services"
                  className="inline-flex items-center gap-3 border-b border-brand-900 pb-1 text-brand-900 font-bold uppercase tracking-widest text-xs hover:text-brand-500 hover:border-brand-500 transition-colors duration-300 group"
                >
                  Explore Services <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500 ease-out" />
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col gap-8">
              {['BUY', 'SELL', 'RENT', 'RENT OUT'].map((service, i) => (
                <div key={i} className="group border-b border-brand-900/10 pb-8 hover:border-brand-500 transition-colors duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-brand-900 group-hover:text-brand-500 transition-colors duration-300">{service}</h3>
                    <ArrowRight size={24} className="text-brand-900/20 group-hover:text-brand-500 transition-all duration-500 group-hover:translate-x-2" />
                  </div>
                  <p className="text-brand-900/60 font-light text-sm mt-4 max-w-sm">
                    Dedicated consultation and discrete property matching tailored precisely to your {service.toLowerCase()} requirements.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Personal Broker Section */}
      <section className="py-32 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-32">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/5] max-w-md mx-auto group">
                <div className="absolute inset-0 bg-brand-900 translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"></div>
                <img 
                  src="/jayeshbhai_portrait.jpg"
                  alt="Jayeshbhai Dasrathbhai Modi" 
                  className="relative z-10 w-full h-full object-cover shadow-2xl transition-all duration-700"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <span className="text-[10px] tracking-widest text-brand-500 font-bold uppercase mb-6 block">Property Consultant</span>
              <h2 className="text-4xl md:text-5xl font-bold text-brand-900 mb-8 tracking-tight">
                MEET JAYESHBHAI
              </h2>
              <p className="text-xl text-brand-900/80 mb-10 leading-relaxed font-light">
                Property decisions are personal. Speak directly with Jayeshbhai about what you're looking for.
              </p>
              <div className="flex items-center gap-6 mb-12">
                <div className="w-12 h-px bg-brand-500"></div>
                <span className="text-sm font-bold tracking-wider text-brand-900 uppercase">{BROKER_INFO.name}</span>
              </div>
              <div>
                <a 
                  href={`https://wa.me/${BROKER_INFO.whatsapp}?text=Hello%20Jayeshbhai`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-brand-900 text-white px-8 py-5 font-bold uppercase tracking-widest text-xs hover:bg-brand-600 transition-colors duration-300 shadow-xl"
                >
                  <Phone size={16} />
                  Talk on WhatsApp &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Areas We Serve */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="text-[10px] tracking-widest text-brand-500 font-bold uppercase mb-4 block">Areas We Serve</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 max-w-4xl mx-auto">
            {['Vesu', 'Adajan', 'Pal', 'City Light', 'Althan', 'Piplod'].map((area, idx) => (
              <Link 
                key={idx}
                to={`/?intent=Buy&area=${encodeURIComponent(area)}`}
                className="group flex flex-col items-center text-center"
              >
                <span className="text-3xl sm:text-4xl font-bold text-brand-900/30 group-hover:text-brand-500 transition-colors duration-300 uppercase tracking-tight">
                  {area}
                </span>
                <ArrowRight size={20} className="text-brand-500 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Trust Signals */}
      <section className="py-20 bg-brand-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 text-center">
            <div className="text-white">
              <h4 className="font-bold text-sm tracking-widest uppercase mb-2">DIRECT BROKER COMMUNICATION</h4>
              <p className="text-brand-500 text-xs font-light">No middlemen.</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/10"></div>
            <div className="text-white">
              <h4 className="font-bold text-sm tracking-widest uppercase mb-2">PERSONAL PROPERTY GUIDANCE</h4>
              <p className="text-brand-500 text-xs font-light">Buy • Sell • Rent • Rent Out</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/10"></div>
            <div className="text-white">
              <h4 className="font-bold text-sm tracking-widest uppercase mb-2">WHATSAPP-FIRST CONTACT</h4>
              <p className="text-brand-500 text-xs font-light">Fast & direct.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-32 bg-brand-50 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-brand-900 mb-8 tracking-tight">READY TO TALK PROPERTY?</h2>
          <p className="text-xl text-brand-900/70 mb-12 font-light leading-relaxed">Tell us what you're looking for.<br/>We'll take it from there.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/?intent=Buy"
              className="bg-brand-900 hover:bg-brand-600 text-white px-8 py-5 text-xs font-bold tracking-widest uppercase transition-colors duration-300 shadow-xl"
            >
              Send Your Requirement &rarr;
            </Link>
            <a 
              href={`https://wa.me/${BROKER_INFO.whatsapp}?text=Hello%20Jayeshbhai`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border border-brand-900/30 text-brand-900 hover:border-brand-900 px-8 py-5 text-xs font-bold tracking-widest uppercase transition-colors duration-300"
            >
              WhatsApp Jayeshbhai
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
