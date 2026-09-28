import { Link } from 'react-router-dom';
import { MapPin, Maximize, BedDouble, Phone } from 'lucide-react';
import { BROKER_INFO } from '../../data/mockData';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function PropertyCard({ property }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Check if we are on a mobile device where hover effects are disabled
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const disable3D = isMobile || prefersReducedMotion;

  return (
    <motion.div 
      ref={ref}
      onMouseMove={disable3D ? undefined : handleMouseMove}
      onMouseLeave={disable3D ? undefined : handleMouseLeave}
      style={{
        rotateX: disable3D ? 0 : rotateX,
        rotateY: disable3D ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      className="bg-white rounded-xl overflow-hidden premium-shadow group transition-all duration-300 relative"
    >
      <div 
        className="relative aspect-[4/3] overflow-hidden bg-brand-100"
        style={{ transform: disable3D ? 'none' : 'translateZ(20px)' }}
      >
        <img 
          src={property.images?.[0] || property.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-brand-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {property.transaction_type || property.purpose}
          </span>
          <span className="bg-white/90 backdrop-blur text-brand-900 text-xs font-semibold px-3 py-1 rounded-full">
            {property.property_type || property.type}
          </span>
        </div>
        <div className="absolute bottom-4 right-4">
          <span className="bg-brand-500 text-brand-900 text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
            {property.price}
          </span>
        </div>
      </div>

      <div 
        className="p-6 bg-white relative z-10"
        style={{ transform: disable3D ? 'none' : 'translateZ(10px)' }}
      >
        <h3 className="text-xl font-bold text-brand-900 mb-2 line-clamp-1">{property.title}</h3>
        
        <div className="flex items-center text-brand-900/60 text-sm mb-4">
          <MapPin size={16} className="mr-1 shrink-0" />
          <span className="truncate">{property.location}, {property.city}</span>
        </div>

        <div className="flex items-center justify-between py-4 border-y border-brand-100 mb-6">
          <div className="flex items-center gap-2 text-brand-900">
            <BedDouble size={18} className="text-brand-500" />
            <span className="text-sm font-medium">{property.bhk || '-'}</span>
          </div>
          <div className="w-px h-6 bg-brand-100"></div>
          <div className="flex items-center gap-2 text-brand-900">
            <Maximize size={18} className="text-brand-500" />
            <span className="text-sm font-medium">{property.area_sqft || property.area}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link 
            to={`/properties/${property.slug || property.id}`}
            className="flex-1 bg-brand-50 hover:bg-brand-100 text-brand-900 text-center py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            View Details
          </Link>
          <a 
            href={`https://wa.me/${BROKER_INFO.whatsapp}?text=Hello%20Jayeshbhai,%20I%20am%20interested%20in%20the%20${property.title}%20(${property.slug || property.id}).`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-brand-900 hover:bg-brand-900/90 text-white flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Phone size={16} />
            Enquire
          </a>
        </div>
      </div>
    </motion.div>
  );
}
