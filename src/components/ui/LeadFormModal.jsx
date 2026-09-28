import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { X, ArrowRight, CheckCircle2, Home, Building, Key, HandCoins, Phone, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { BROKER_INFO } from '../../data/mockData';
import { cn } from '../layout/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const INTENTS = [
  { id: 'Buy', label: 'Buy a Property', icon: Home, desc: 'Find suitable options to purchase' },
  { id: 'Sell', label: 'Sell Your Property', icon: HandCoins, desc: 'Connect with genuine buyers' },
  { id: 'Rent', label: 'Rent a Property', icon: Key, desc: 'Find your next rental home' },
  { id: 'RentOut', label: 'Rent Out Property', icon: Building, desc: 'Find reliable tenants' },
];

export default function LeadFormModal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const intentParam = searchParams.get('intent');
  const areaParam = searchParams.get('area');
  const isOpen = !!intentParam;

  const [step, setStep] = useState(1);
  const scrollRef = useRef(null);

  const [formData, setFormData] = useState({
    intent: '',
    name: '',
    phone: '',
    botField: '', // Anti-spam honeypot
    
    // Dynamic fields
    location: areaParam || '',
    propertyType: '',
    bhk: '',
    budget: '',
    purpose: '',
    moveInTime: '',
    propertyArea: '',
    furnishingStatus: '',
    additionalDetails: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    if (intentParam) {
      setFormData(prev => ({ ...prev, intent: intentParam, location: areaParam || prev.location }));
      if (INTENTS.some(i => i.id === intentParam)) {
        setStep(2);
      } else {
        setStep(1);
      }
    }
  }, [intentParam, areaParam]);

  // Scroll to top of modal when step changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Clear errors when step changes
    setFormErrors({});
    setSubmitError(false);
  }, [step]);

  const closeModal = () => {
    navigate(window.location.pathname, { replace: true });
    setTimeout(() => {
      setStep(1);
      setSubmitError(false);
      setFormErrors({});
      setFormData({
        intent: '', name: '', phone: '', botField: '', location: '', propertyType: '', bhk: '', 
        budget: '', purpose: '', moveInTime: '', propertyArea: '', furnishingStatus: '', additionalDetails: ''
      });
    }, 300);
  };

  const validateStep2 = () => {
    const errors = {};
    if (!formData.location.trim()) errors.location = 'Please enter your preferred location.';
    if (!formData.propertyType) errors.propertyType = 'Please select a property type.';
    if (!formData.budget.trim()) errors.budget = 'Please enter an approximate budget or price.';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Please enter your name.';
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    const isRepeated = /^(\d)\1{9}$/.test(formData.phone); // e.g. 0000000000 or 1111111111

    if (!formData.phone.trim()) {
      errors.phone = 'Please enter your WhatsApp number.';
    } else if (!phoneRegex.test(formData.phone) || isRepeated) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (step === 2 && !validateStep2()) return;
    setStep(s => s + 1);
  };
  
  const handleBack = () => {
    setStep(s => s - 1);
  };

  const formatMessage = () => {
    const { intent, location, propertyType, bhk, budget, purpose, moveInTime, propertyArea, furnishingStatus, additionalDetails } = formData;
    let msg = ``;
    
    if (intent === 'Buy') {
      msg = `Preferred Area: ${location}\nProperty Type: ${propertyType}\nBHK: ${bhk}\nBudget: ${budget}\nPurpose: ${purpose}\nRequirement: ${additionalDetails}`;
    } else if (intent === 'Sell') {
      msg = `Property Location: ${location}\nProperty Type: ${propertyType}\nBHK: ${bhk}\nApprox Area: ${propertyArea}\nExpected Price: ${budget}\nDetails: ${additionalDetails}`;
    } else if (intent === 'Rent') {
      msg = `Preferred Area: ${location}\nProperty Type: ${propertyType}\nBHK: ${bhk}\nMonthly Budget: ${budget}\nMove-in Time: ${moveInTime}\nRequirement: ${additionalDetails}`;
    } else if (intent === 'RentOut') {
      msg = `Property Location: ${location}\nProperty Type: ${propertyType}\nBHK: ${bhk}\nProperty Area: ${propertyArea}\nExpected Rent: ${budget}\nFurnishing: ${furnishingStatus}\nDetails: ${additionalDetails}`;
    }
    return msg;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;
    
    setIsSubmitting(true);
    setSubmitError(false);

    // Anti-spam Honeypot Check
    if (formData.botField) {
      // Silently fail for bots
      console.warn("Spam detected.");
      setIsSubmitting(false);
      return; 
    }
    
    try {
      const { error } = await supabase.from('enquiries').insert([{
        name: formData.name,
        phone: formData.phone,
        requirement: formData.intent,
        message: formatMessage(),
        status: 'New'
      }]);

      if (error) throw error;
      setStep(4);
    } catch (error) {
      console.error('Submission error:', error.message, error.code, error.details, error.hint);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppLink = () => {
    const { intent, name, location, propertyType, bhk, budget, purpose, moveInTime, propertyArea, furnishingStatus, additionalDetails } = formData;
    
    let msg = `Hello Jayeshbhai,\n\nI would like to ${intent.toUpperCase()} a property.\n\nName: ${name}\n`;
    
    if (intent === 'Buy') {
      msg += `Preferred Area: ${location}\nProperty Type: ${propertyType}\nBHK: ${bhk}\nBudget: ${budget}\nPurpose: ${purpose}\nRequirement: ${additionalDetails}`;
    } else if (intent === 'Sell') {
      msg += `Property Location: ${location}\nProperty Type: ${propertyType}\nBHK: ${bhk}\nApprox Area: ${propertyArea}\nExpected Price: ${budget}\nDetails: ${additionalDetails}`;
    } else if (intent === 'Rent') {
      msg += `Preferred Area: ${location}\nProperty Type: ${propertyType}\nBHK: ${bhk}\nMonthly Budget: ${budget}\nMove-in Time: ${moveInTime}\nRequirement: ${additionalDetails}`;
    } else if (intent === 'RentOut') {
      msg += `Property Location: ${location}\nProperty Type: ${propertyType}\nBHK: ${bhk}\nProperty Area: ${propertyArea}\nExpected Rent: ${budget}\nFurnishing: ${furnishingStatus}\nDetails: ${additionalDetails}`;
    }

    msg += `\n\nPlease contact me regarding my requirement.`;
    return `https://wa.me/${BROKER_INFO.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-brand-900/80 backdrop-blur-md" onClick={!isSubmitting ? closeModal : undefined}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="relative bg-brand-50 w-full max-w-2xl rounded-sm shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-brand-900/10 bg-white shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest text-brand-500 font-bold uppercase mb-1">
              {step <= 4 ? `0${step} — 04` : 'ERROR'}
            </span>
            <h2 className="text-xl font-bold text-brand-900">Property Consultation</h2>
          </div>
          <button 
            onClick={closeModal} 
            disabled={isSubmitting}
            className="p-2 text-brand-900/50 hover:text-brand-900 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div ref={scrollRef} className="p-6 sm:p-10 overflow-y-auto flex-grow">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold text-brand-900 mb-6">What are you looking to do?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {INTENTS.map((intent) => (
                    <button
                      key={intent.id}
                      onClick={() => {
                        setFormData({ ...formData, intent: intent.id });
                        handleNext();
                      }}
                      className={cn(
                        "p-6 border text-left transition-all duration-300 group hover:border-brand-500 bg-white shadow-sm hover:shadow-md min-h-[120px]",
                        formData.intent === intent.id ? "border-brand-500 ring-1 ring-brand-500" : "border-brand-900/10"
                      )}
                    >
                      <intent.icon className={cn("w-8 h-8 mb-4 transition-colors", formData.intent === intent.id ? "text-brand-500" : "text-brand-900/40 group-hover:text-brand-500")} />
                      <h4 className="font-bold text-brand-900 mb-1">{intent.label}</h4>
                      <p className="text-xs text-brand-900/60 leading-relaxed">{intent.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold text-brand-900 mb-2">Tell us about your requirement</h3>
                <p className="text-sm text-brand-900/60 mb-8">The more details you provide, the better we can assist you.</p>
                
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-brand-900 uppercase mb-2">
                        {formData.intent === 'Buy' || formData.intent === 'Rent' ? 'Preferred Area *' : 'Property Location *'}
                      </label>
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={(e) => {
                          setFormData({...formData, location: e.target.value});
                          if (formErrors.location) setFormErrors({...formErrors, location: null});
                        }}
                        className={cn(
                          "w-full bg-white border p-4 focus:outline-none transition-colors min-h-[44px]",
                          formErrors.location ? "border-red-500 focus:border-red-500" : "border-brand-900/20 focus:border-brand-500"
                        )}
                      />
                      {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-brand-900 uppercase mb-2">Property Type *</label>
                      <select 
                        value={formData.propertyType}
                        onChange={(e) => {
                          setFormData({...formData, propertyType: e.target.value});
                          if (formErrors.propertyType) setFormErrors({...formErrors, propertyType: null});
                        }}
                        className={cn(
                          "w-full bg-white border p-4 focus:outline-none transition-colors min-h-[44px] appearance-none",
                          formErrors.propertyType ? "border-red-500 focus:border-red-500" : "border-brand-900/20 focus:border-brand-500"
                        )}
                      >
                        <option value="">Select Type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa / Bungalow</option>
                        <option value="Commercial">Commercial / Office</option>
                        <option value="Plot">Plot / Land</option>
                      </select>
                      {formErrors.propertyType && <p className="text-red-500 text-xs mt-1">{formErrors.propertyType}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-brand-900 uppercase mb-2">BHK (If Residential)</label>
                      <select 
                        value={formData.bhk}
                        onChange={(e) => setFormData({...formData, bhk: e.target.value})}
                        className="w-full bg-white border border-brand-900/20 p-4 focus:outline-none focus:border-brand-500 transition-colors min-h-[44px] appearance-none"
                      >
                        <option value="">Select BHK</option>
                        <option value="1 BHK">1 BHK</option>
                        <option value="2 BHK">2 BHK</option>
                        <option value="3 BHK">3 BHK</option>
                        <option value="4+ BHK">4+ BHK</option>
                        <option value="N/A">Not Applicable</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-brand-900 uppercase mb-2">
                        {formData.intent === 'Buy' ? 'Budget *' : formData.intent === 'Sell' ? 'Expected Price *' : formData.intent === 'Rent' ? 'Monthly Budget *' : 'Expected Rent *'}
                      </label>
                      <input 
                        type="text" 
                        value={formData.budget}
                        onChange={(e) => {
                          setFormData({...formData, budget: e.target.value});
                          if (formErrors.budget) setFormErrors({...formErrors, budget: null});
                        }}
                        className={cn(
                          "w-full bg-white border p-4 focus:outline-none transition-colors min-h-[44px]",
                          formErrors.budget ? "border-red-500 focus:border-red-500" : "border-brand-900/20 focus:border-brand-500"
                        )}
                      />
                      {formErrors.budget && <p className="text-red-500 text-xs mt-1">{formErrors.budget}</p>}
                    </div>
                  </div>

                  {(formData.intent === 'Sell' || formData.intent === 'RentOut') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold tracking-wider text-brand-900 uppercase mb-2">Approx Property Area</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 1500 sqft"
                          value={formData.propertyArea}
                          onChange={(e) => setFormData({...formData, propertyArea: e.target.value})}
                          className="w-full bg-white border border-brand-900/20 p-4 focus:outline-none focus:border-brand-500 transition-colors min-h-[44px]"
                        />
                      </div>
                      {formData.intent === 'RentOut' && (
                        <div>
                          <label className="block text-xs font-bold tracking-wider text-brand-900 uppercase mb-2">Furnishing Status</label>
                          <select 
                            value={formData.furnishingStatus}
                            onChange={(e) => setFormData({...formData, furnishingStatus: e.target.value})}
                            className="w-full bg-white border border-brand-900/20 p-4 focus:outline-none focus:border-brand-500 transition-colors min-h-[44px] appearance-none"
                          >
                            <option value="">Select Status</option>
                            <option value="Fully Furnished">Fully Furnished</option>
                            <option value="Semi Furnished">Semi Furnished</option>
                            <option value="Unfurnished">Unfurnished</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.intent === 'Buy' && (
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-brand-900 uppercase mb-2">Purpose</label>
                      <select 
                        value={formData.purpose}
                        onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                        className="w-full bg-white border border-brand-900/20 p-4 focus:outline-none focus:border-brand-500 transition-colors min-h-[44px] appearance-none"
                      >
                        <option value="">Select Purpose</option>
                        <option value="Self Use">Self Use / End User</option>
                        <option value="Investment">Investment</option>
                      </select>
                    </div>
                  )}

                  {formData.intent === 'Rent' && (
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-brand-900 uppercase mb-2">Preferred Move-in Time</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Within 1 month"
                        value={formData.moveInTime}
                        onChange={(e) => setFormData({...formData, moveInTime: e.target.value})}
                        className="w-full bg-white border border-brand-900/20 p-4 focus:outline-none focus:border-brand-500 transition-colors min-h-[44px]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold tracking-wider text-brand-900 uppercase mb-2">Additional Details / Requirements</label>
                    <textarea 
                      rows="2"
                      value={formData.additionalDetails}
                      onChange={(e) => setFormData({...formData, additionalDetails: e.target.value})}
                      className="w-full bg-white border border-brand-900/20 p-4 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-between pt-6 border-t border-brand-900/10">
                    <button onClick={handleBack} className="text-brand-900/60 hover:text-brand-900 text-sm font-bold tracking-wider uppercase transition-colors min-h-[44px] px-2">Back</button>
                    <button 
                      onClick={handleNext}
                      className="bg-brand-900 text-white px-8 py-4 text-sm font-bold tracking-wider uppercase hover:bg-brand-600 transition-colors flex items-center gap-2 min-h-[44px]"
                    >
                      Next Step <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold text-brand-900 mb-2">Contact Details</h3>
                <p className="text-sm text-brand-900/60 mb-8">Jayeshbhai will personally reach out to discuss your requirement.</p>
                
                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 flex gap-3 items-start">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="text-red-800 font-bold text-sm mb-1">Submission Failed</h4>
                      <p className="text-red-700/80 text-xs leading-relaxed">
                        Something went wrong while sending your requirement. Please try again or contact Jayeshbhai directly.
                      </p>
                      <div className="flex gap-4 mt-3">
                        <a href={`https://wa.me/${BROKER_INFO.whatsapp}?text=Hello%20Jayeshbhai`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-red-800 hover:text-red-600 uppercase tracking-wider transition-colors">WhatsApp</a>
                        <a href={`tel:${BROKER_INFO.phone.replace(/[^0-9+]/g, '')}`} className="text-xs font-bold text-red-800 hover:text-red-600 uppercase tracking-wider transition-colors">Call</a>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <input 
                      type="text" 
                      name="botField" 
                      tabIndex="-1" 
                      autoComplete="off"
                      value={formData.botField}
                      onChange={(e) => setFormData({...formData, botField: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-wider text-brand-900 uppercase mb-2">Your Name *</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({...formData, name: e.target.value});
                        if (formErrors.name) setFormErrors({...formErrors, name: null});
                      }}
                      className={cn(
                        "w-full bg-white border p-4 focus:outline-none transition-colors min-h-[44px]",
                        formErrors.name ? "border-red-500 focus:border-red-500" : "border-brand-900/20 focus:border-brand-500"
                      )}
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-brand-900 uppercase mb-2">WhatsApp Number *</label>
                    <input 
                      type="tel" 
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0,10)});
                        if (formErrors.phone) setFormErrors({...formErrors, phone: null});
                      }}
                      className={cn(
                        "w-full bg-white border p-4 focus:outline-none transition-colors min-h-[44px]",
                        formErrors.phone ? "border-red-500 focus:border-red-500" : "border-brand-900/20 focus:border-brand-500"
                      )}
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                  </div>
                  
                  <div className="flex justify-between pt-6 border-t border-brand-900/10">
                    <button type="button" onClick={handleBack} disabled={isSubmitting} className="text-brand-900/60 hover:text-brand-900 text-sm font-bold tracking-wider uppercase transition-colors disabled:opacity-50 min-h-[44px] px-2">Back</button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-brand-900 text-white px-8 py-4 text-sm font-bold tracking-wider uppercase hover:bg-brand-600 transition-colors disabled:opacity-50 min-h-[44px]"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Details'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-brand-900 mb-4">Requirement Received</h3>
                <p className="text-brand-900/70 mb-10 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. We have securely saved your requirement. Jayeshbhai will review it and connect with you directly.
                </p>
                
                <div className="flex flex-col gap-4 max-w-sm mx-auto">
                  <a 
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 font-bold tracking-wider uppercase text-sm transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <Phone size={18} /> WhatsApp Jayeshbhai
                  </a>
                  <button 
                    onClick={closeModal}
                    className="border border-brand-900/20 hover:border-brand-900 text-brand-900 px-8 py-4 font-bold tracking-wider uppercase text-sm transition-colors min-h-[44px]"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
