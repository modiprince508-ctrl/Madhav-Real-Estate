import { MessageCircle } from 'lucide-react';
import { BROKER_INFO } from '../../data/mockData';

export default function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${BROKER_INFO.whatsapp}?text=Hello%20Jayeshbhai,%20I%20found%20your%20website%20and%20would%20like%20help%20with%20a%20property.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-white text-brand-900 text-sm font-medium py-2 px-4 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
}
