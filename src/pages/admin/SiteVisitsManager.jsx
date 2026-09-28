import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SiteVisitsManager() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const { data, error } = await supabase
        .from('site_visits')
        .select(`*, properties(title, slug)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVisits(data || []);
    } catch (error) {
      console.error('Error fetching site visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('site_visits')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setVisits(visits.map(v => v.id === id ? { ...v, status: newStatus } : v));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading site visits...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Site Visits</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Requested On</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Customer</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Property</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Preferred Time</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visits.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No site visits found.</td>
                </tr>
              ) : (
                visits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(visit.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{visit.name}</div>
                      <div className="text-sm text-gray-500">{visit.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      {visit.properties ? (
                        <Link to={`/properties/${visit.properties.slug}`} target="_blank" className="text-sm font-medium text-brand-600 hover:underline flex items-center gap-1">
                          {visit.properties.title} <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-500">Unknown Property</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{new Date(visit.preferred_date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{visit.preferred_time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={visit.status}
                        onChange={(e) => handleStatusChange(visit.id, e.target.value)}
                        className={`text-sm rounded-lg border-gray-300 font-medium px-3 py-1 outline-none focus:ring-2 focus:ring-brand-500
                          ${visit.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                            visit.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            visit.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                            'bg-red-50 text-red-700 border-red-200'}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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
