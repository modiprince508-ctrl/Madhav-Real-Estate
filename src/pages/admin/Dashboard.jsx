import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Building2, MessageSquare, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    enquiries: 0,
    siteVisits: 0,
    testimonials: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        { count: propertiesCount },
        { count: enquiriesCount },
        { count: siteVisitsCount },
        { count: testimonialsCount }
      ] = await Promise.all([
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'New'),
        supabase.from('site_visits').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
        supabase.from('testimonials').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        properties: propertiesCount || 0,
        enquiries: enquiriesCount || 0,
        siteVisits: siteVisitsCount || 0,
        testimonials: testimonialsCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Total Properties', value: stats.properties, icon: Building2, color: 'bg-blue-500', link: '/admin/properties' },
    { name: 'New Enquiries', value: stats.enquiries, icon: MessageSquare, color: 'bg-green-500', link: '/admin/enquiries' },
    { name: 'Pending Visits', value: stats.siteVisits, icon: Calendar, color: 'bg-purple-500', link: '/admin/site-visits' },
    { name: 'Total Testimonials', value: stats.testimonials, icon: Star, color: 'bg-orange-500', link: '/admin/testimonials' },
  ];

  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading stats...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} to={stat.link} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/properties/new" className="bg-brand-900 hover:bg-brand-900/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            + Add New Property
          </Link>
          <Link to="/admin/enquiries" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
            View Enquiries
          </Link>
        </div>
      </div>
    </div>
  );
}
