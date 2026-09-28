import { motion } from 'framer-motion';
import { Shield, Target, Users, MapPin, CheckCircle2, User } from 'lucide-react';
import { BROKER_INFO } from '../data/mockData';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="pt-24 min-h-screen bg-brand-50 selection:bg-brand-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full md:w-1/2"
          >
            <span className="text-[10px] tracking-widest text-brand-500 font-bold uppercase mb-4 block">About Madhav Real Estate</span>
            <h1 className="text-4xl md:text-6xl  font-bold text-brand-900 mb-8 leading-tight">
              Honesty. Privacy. Expertise.
            </h1>
            <p className="text-lg text-brand-900/70 leading-relaxed font-light mb-8">
              Founded on the principles of trust and transparency, Madhav Real Estate is not a property marketplace, but a dedicated consultancy for those looking to make serious real estate decisions. 
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-brand-900/80">
                <CheckCircle2 size={18} className="text-brand-500" />
                <span className="font-medium">10+ Years of Local Experience</span>
              </div>
              <div className="flex items-center gap-3 text-brand-900/80">
                <CheckCircle2 size={18} className="text-brand-500" />
                <span className="font-medium">Strict Client Privacy</span>
              </div>
              <div className="flex items-center gap-3 text-brand-900/80">
                <CheckCircle2 size={18} className="text-brand-500" />
                <span className="font-medium">Direct Broker Guidance</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto group">
              <div className="absolute inset-0 bg-brand-900 translate-x-6 translate-y-6 transition-transform duration-500 group-hover:translate-x-8 group-hover:translate-y-8"></div>
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
                alt="Madhav Real Estate Office" 
                className="relative z-10 w-full h-full object-cover shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Founder Section */}
      <section className="py-24 bg-white border-y border-brand-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row-reverse gap-16 lg:gap-24 items-center">
            
            <div className="w-full md:w-1/2">
              <span className="text-[10px] tracking-widest text-brand-500 font-bold uppercase mb-4 block">The Founder</span>
              <h2 className="text-3xl md:text-5xl  font-bold text-brand-900 mb-6">
                Meet Jayeshbhai Modi.
              </h2>
              <div className="space-y-6 text-brand-900/70 leading-relaxed">
                <p>
                  "Real estate is not just about brick and mortar. It's about people, their life savings, and their dreams."
                </p>
                <p>
                  With extensive experience in the local property market, Jayeshbhai brings a deeply personal touch to property consultancy. He believes that the best property deals are struck when there is absolute clarity, honest representation, and mutual respect.
                </p>
                <p>
                  Whether you are a first-time homebuyer, a seasoned investor looking for commercial yields, or an owner looking to lease, Jayeshbhai personally oversees your requirements to ensure you get exactly what you need, without the noise of public listings.
                </p>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="relative aspect-[3/4] w-full max-w-sm mx-auto">
                <div className="absolute inset-0 border border-brand-500 -translate-x-6 -translate-y-6"></div>
                <img 
                  src="/jayeshbhai_portrait.jpg"
                  alt="Jayeshbhai Modi" 
                  className="relative z-10 w-full h-full object-cover shadow-xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-widest text-brand-500 font-bold uppercase mb-4 block">Core Principles</span>
            <h2 className="text-3xl md:text-5xl  font-bold">Why Work With Us</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                icon: Shield,
                title: 'Strict Privacy',
                desc: 'Your requirements and budgets are never exposed to public portals or competitors.'
              },
              {
                icon: Target,
                title: 'Precision Focus',
                desc: 'We only show you properties that actually match your mandate. No time wasting.'
              },
              {
                icon: Users,
                title: 'Private Network',
                desc: 'Access to off-market deals and a vetted network of serious buyers and sellers.'
              },
              {
                icon: MapPin,
                title: 'Local Authority',
                desc: 'Deep, unparalleled knowledge of our operating corridors and their actual valuations.'
              }
            ].map((value, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-500 transition-colors">
                  <value.icon className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-50 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl  font-bold text-brand-900 mb-8">Ready to discuss your property?</h2>
          <Link 
            to="/?intent=Buy"
            className="inline-flex bg-brand-900 hover:bg-brand-600 text-white px-8 py-4 text-sm font-bold tracking-wider uppercase transition-all items-center justify-center gap-2"
          >
            Submit Requirement
          </Link>
        </div>
      </section>

    </div>
  );
}
