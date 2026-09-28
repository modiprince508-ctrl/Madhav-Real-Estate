import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2 } from 'lucide-react';

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalChange = async (id, approved) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ approved })
        .eq('id', id);

      if (error) throw error;
      setTestimonials(testimonials.map(t => t.id === id ? { ...t, approved } : t));
    } catch (error) {
      console.error('Error updating approval:', error);
      alert('Failed to update approval');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Error deleting testimonial');
    }
  };

  if (loading) return <div>Loading testimonials...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Client</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Review</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Rating</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Approved</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No testimonials found.</td>
                </tr>
              ) : (
                testimonials.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(test.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{test.client_name}</div>
                      <div className="text-sm text-gray-500">{test.role}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      <p className="truncate" title={test.review}>{test.review}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {test.rating}/5
                    </td>
                    <td className="px-6 py-4">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input type="checkbox" className="sr-only" checked={test.approved} onChange={(e) => handleApprovalChange(test.id, e.target.checked)} />
                          <div className={`block w-10 h-6 rounded-full transition-colors ${test.approved ? 'bg-brand-500' : 'bg-gray-300'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${test.approved ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                      </label>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(test.id)} className="text-gray-400 hover:text-red-600 inline-block">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
