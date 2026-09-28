import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { BROKER_INFO } from '../data/mockData';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    intent: 'General Inquiry',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const { error } = await supabase.from('enquiries').insert([{
        name: formData.name,
        phone: formData.phone,
        requirement: formData.intent,
        message: formData.message,
        status: 'New'
      }]);

      if (error) throw error;
      setStatus('success');
      setFormData({ name: '', phone: '', intent: 'General Inquiry', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg('Failed to send message. Please try again or contact via WhatsApp.');
    }
  };

  const generateWhatsAppLink = () => {
    return `https://wa.me/${BROKER_INFO.whatsapp}?text=Hello%20Jayeshbhai,%20I%20would%20like%20to%20get%20in%20touch.`;
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-50 selection:bg-brand-500 selection:text-white">
      
      {/* Header */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <span className="text-[10px] tracking-widest text-brand-500 font-bold uppercase mb-4 block">Get In Touch</span>
          <h1 className="text-4xl md:text-6xl  font-bold text-brand-900 mb-8 leading-tight">
            Let's discuss your real estate requirements.
          </h1>
          <p className="text-lg md:text-xl text-brand-900/70 leading-relaxed font-light">
            Whether you are looking to buy, sell, or rent, we are here to provide expert, confidential guidance.
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-brand-900/10 mb-24">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Contact Details */}
          <div className="w-full lg:w-1/3">
            <h3 className="text-2xl  font-bold text-brand-900 mb-8">Contact Information</h3>
            
            <div className="space-y-10">
              <div className="flex gap-4">
                <Phone className="text-brand-500 shrink-0 w-6 h-6" />
                <div>
                  <h4 className="font-bold text-brand-900 tracking-wider text-xs uppercase mb-1">Direct Line</h4>
                  <p className="text-brand-900/70">{BROKER_INFO.phone}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="text-brand-500 shrink-0 w-6 h-6" />
                <div>
                  <h4 className="font-bold text-brand-900 tracking-wider text-xs uppercase mb-1">Email Address</h4>
                  <p className="text-brand-900/70">{BROKER_INFO.email}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="text-brand-500 shrink-0 w-6 h-6" />
                <div>
                  <h4 className="font-bold text-brand-900 tracking-wider text-xs uppercase mb-1">Office Location</h4>
                  <p className="text-brand-900/70 leading-relaxed">{BROKER_INFO.address}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="text-brand-500 shrink-0 w-6 h-6" />
                <div>
                  <h4 className="font-bold text-brand-900 tracking-wider text-xs uppercase mb-1">Consultation Hours</h4>
                  <p className="text-brand-900/70 leading-relaxed">Monday - Saturday<br/>10:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <a 
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 text-sm font-bold tracking-wider uppercase transition-colors inline-flex items-center gap-2"
              >
                Chat on WhatsApp <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white p-8 sm:p-12 border border-brand-900/10 shadow-sm">
              <h3 className="text-2xl  font-bold text-brand-900 mb-8">Send an Enquiry</h3>
              
              {status === 'success' ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl  font-bold text-brand-900 mb-4">Message Sent Successfully</h3>
                  <p className="text-brand-900/70 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. Jayeshbhai will personally get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-sm font-bold text-brand-900 tracking-wider uppercase hover:text-brand-500 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 text-sm font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-brand-900 uppercase mb-2">Your Name *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white border border-brand-900/20 p-4 focus:outline-none focus:border-brand-500 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-brand-900 uppercase mb-2">Phone Number *</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-white border border-brand-900/20 p-4 focus:outline-none focus:border-brand-500 transition-colors"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-wider text-brand-900 uppercase mb-2">Primary Intent</label>
                    <select 
                      value={formData.intent}
                      onChange={(e) => setFormData({...formData, intent: e.target.value})}
                      className="w-full bg-white border border-brand-900/20 p-4 focus:outline-none focus:border-brand-500 transition-colors rounded-none"
                    >
                      <option>General Inquiry</option>
                      <option>Buy</option>
                      <option>Sell</option>
                      <option>Rent</option>
                      <option>Rent Out</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-wider text-brand-900 uppercase mb-2">Message *</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-white border border-brand-900/20 p-4 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                      placeholder="Please provide details about your requirement..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-brand-900 text-white px-8 py-4 text-sm font-bold tracking-wider uppercase hover:bg-brand-600 transition-colors disabled:opacity-50 w-full md:w-auto"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
