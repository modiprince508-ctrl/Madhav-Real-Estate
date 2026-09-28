import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2 } from 'lucide-react';

export default function AreasManager() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick form state
  const [isAdding, setIsAdding] = useState(false);
  const [newArea, setNewArea] = useState({ name: '', slug: '', description: '', featured: false });

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('areas')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setAreas(data || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this area?')) return;
    
    try {
      const { error } = await supabase.from('areas').delete().eq('id', id);
      if (error) throw error;
      setAreas(areas.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting area:', error);
      alert('Error deleting area');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newArea.name,
        slug: newArea.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: newArea.description,
        featured: newArea.featured
      };

      const { data, error } = await supabase.from('areas').insert(payload).select().single();
      if (error) throw error;

      setAreas([...areas, data].sort((a, b) => a.name.localeCompare(b.name)));
      setIsAdding(false);
      setNewArea({ name: '', slug: '', description: '', featured: false });
    } catch (error) {
      console.error('Error adding area:', error);
      alert('Failed to add area');
    }
  };

  if (loading) return <div>Loading areas...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Areas</h1>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-brand-900 hover:bg-brand-900/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Area
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Add New Area</h2>
          <form onSubmit={handleAddSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input required type="text" value={newArea.name} onChange={e => setNewArea({...newArea, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" placeholder="e.g., Vesu" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={newArea.description} onChange={e => setNewArea({...newArea, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" rows="3"></textarea>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={newArea.featured} onChange={e => setNewArea({...newArea, featured: e.target.checked})} className="w-5 h-5 text-brand-600 rounded border-gray-300 focus:ring-brand-500" />
                <span className="text-sm font-medium text-gray-700">Featured Area</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-brand-900 text-white px-4 py-2 rounded-lg font-medium">Save Area</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Name</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Slug</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Featured</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {areas.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No areas found.</td>
                </tr>
              ) : (
                areas.map((area) => (
                  <tr key={area.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{area.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{area.slug}</td>
                    <td className="px-6 py-4">
                      {area.featured ? <span className="px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">Yes</span> : <span className="px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">No</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(area.id)} className="text-gray-400 hover:text-red-600 inline-block">
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
