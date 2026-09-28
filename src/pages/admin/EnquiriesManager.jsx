import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Phone, CheckCircle, Search, Filter, Calendar, MessageSquare, StickyNote, X, RefreshCw } from 'lucide-react';
import { cn } from '../../components/layout/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_OPTIONS = [
  'New', 'Contacted', 'Follow-up', 'Visit Planned', 'Converted', 'Closed', 'Not Interested'
];

const INTENT_OPTIONS = [
  'Buy', 'Sell', 'Rent', 'RentOut'
];

export default function EnquiriesManager() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterIntent, setFilterIntent] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Update State
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('enquiries')
        .select(`*`)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setEnquiries(data || []);
      
      // Update selected lead reference if already open
      if (selectedLead && data) {
        const updatedSelected = data.find(l => l.id === selectedLead.id);
        if (updatedSelected) setSelectedLead(updatedSelected);
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      setError('Unable to load enquiries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updates) => {
    if (!selectedLead) return;
    setIsUpdating(true);
    setUpdateSuccess(false);

    try {
      const { error: updateError } = await supabase
        .from('enquiries')
        .update(updates)
        .eq('id', selectedLead.id);

      if (updateError) throw updateError;
      
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      
      // Optimistic local update
      setEnquiries(prev => prev.map(lead => 
        lead.id === selectedLead.id ? { ...lead, ...updates } : lead
      ));
      setSelectedLead(prev => ({ ...prev, ...updates }));

    } catch (err) {
      console.error('Error updating enquiry:', err);
      alert('Failed to update lead. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredEnquiries = enquiries.filter(lead => {
    if (filterStatus !== 'All' && lead.status !== filterStatus) return false;
    if (filterIntent !== 'All' && lead.requirement !== filterIntent) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!lead.name?.toLowerCase().includes(q) && !lead.phone?.includes(q) && !lead.message?.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-red-50 text-red-700 border-red-200';
      case 'Contacted': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Follow-up': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Visit Planned': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Converted': return 'bg-green-50 text-green-700 border-green-200';
      case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Not Interested': return 'bg-gray-100 text-gray-500 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-brand-900 mb-1">Enquiries</h1>
          <p className="text-sm text-brand-900/60">Manage incoming property requirements and follow-ups.</p>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold text-brand-900">
          Total Leads: <span className="bg-brand-900 text-white px-3 py-1 rounded-full">{enquiries.length}</span>
          <button onClick={fetchEnquiries} className="p-2 hover:bg-brand-900/5 rounded-full transition-colors" title="Refresh">
            <RefreshCw size={18} className={cn(loading && "animate-spin text-brand-500")} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 border border-brand-900/10 mb-6 shrink-0 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900/40" />
          <input 
            type="text" 
            placeholder="Search name, phone, or requirement..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-brand-50/50 border border-brand-900/10 focus:outline-none focus:border-brand-500 text-sm transition-colors"
          />
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-brand-900/10 focus:outline-none focus:border-brand-500 text-sm font-bold text-brand-900"
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            value={filterIntent} 
            onChange={(e) => setFilterIntent(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-brand-900/10 focus:outline-none focus:border-brand-500 text-sm font-bold text-brand-900"
          >
            <option value="All">All Intents</option>
            {INTENT_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      {/* Main CRM Layout */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6 relative">
        
        {/* Lead List (Left Pane) */}
        <div className={cn(
          "bg-white border border-brand-900/10 flex flex-col h-full overflow-hidden transition-all duration-300",
          selectedLead ? "lg:w-1/3 hidden lg:flex" : "w-full flex"
        )}>
          <div className="p-4 border-b border-brand-900/10 bg-brand-50/30 flex justify-between items-center shrink-0">
            <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wider">Lead Inbox</h3>
            <span className="text-xs font-bold text-brand-900/50">{filteredEnquiries.length} results</span>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-brand-900/10">
            {loading ? (
              <div className="p-8 text-center text-sm text-brand-900/50 font-bold">Loading enquiries...</div>
            ) : error ? (
              <div className="p-8 text-center text-sm text-red-600 font-bold">{error}</div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="p-8 text-center text-sm text-brand-900/50 font-bold">No enquiries match your filters.</div>
            ) : (
              filteredEnquiries.map(lead => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={cn(
                    "w-full text-left p-4 transition-colors border-l-4 flex flex-col gap-2 relative",
                    selectedLead?.id === lead.id ? "bg-brand-50 border-brand-500" : "hover:bg-brand-50/50 border-transparent"
                  )}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-brand-900 truncate pr-4">{lead.name}</h4>
                    <span className="text-[10px] font-bold text-brand-900/40 shrink-0 uppercase tracking-wider">
                      {new Date(lead.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-brand-900/60 mb-1">{lead.phone}</p>
                      <p className="text-xs font-bold text-brand-500 uppercase tracking-wider">{lead.requirement || 'Unknown'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider", getStatusColor(lead.status))}>
                        {lead.status}
                      </span>
                      {lead.next_follow_up_at && (
                        <span className="flex items-center gap-1 text-[10px] text-orange-600 font-bold">
                          <Calendar size={10} /> {new Date(lead.next_follow_up_at).toLocaleDateString('en-GB')}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Lead Detail (Right Pane) */}
        {selectedLead && (
          <div className="bg-white border border-brand-900/10 flex-1 flex flex-col h-full overflow-hidden absolute inset-0 z-10 lg:static">
            
            {/* Detail Header */}
            <div className="p-6 border-b border-brand-900/10 bg-brand-50/30 shrink-0 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => setSelectedLead(null)} className="lg:hidden p-1 text-brand-900/50 hover:text-brand-900 -ml-2">
                    <X size={20} />
                  </button>
                  <h2 className="text-2xl font-bold text-brand-900">{selectedLead.name}</h2>
                  <span className={cn("text-xs px-2 py-1 rounded-full border font-bold uppercase tracking-wider", getStatusColor(selectedLead.status))}>
                    {selectedLead.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-brand-900/60">
                  <span className="flex items-center gap-1.5"><Phone size={14} /> {selectedLead.phone}</span>
                  <span className="font-bold text-brand-900 uppercase tracking-wider px-2 py-0.5 bg-white border border-brand-900/10 text-[10px]">
                    {selectedLead.requirement || 'General'}
                  </span>
                  <span className="text-xs">
                    Received: {new Date(selectedLead.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
              </div>
              <div className="hidden lg:block">
                <button onClick={() => setSelectedLead(null)} className="p-2 text-brand-900/40 hover:text-brand-900 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Left Col: Message & Actions */}
              <div className="xl:col-span-2 space-y-8">
                
                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                  <a 
                    href={`tel:${selectedLead.phone.replace(/[^0-9+]/g, '')}`} 
                    className="flex-1 min-h-[44px] bg-brand-900 text-white font-bold uppercase tracking-wider text-xs px-4 py-3 flex justify-center items-center gap-2 hover:bg-brand-600 transition-colors"
                  >
                    <Phone size={16} /> Call Customer
                  </a>
                  <a 
                    href={`https://wa.me/91${selectedLead.phone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${selectedLead.name},\nThis is Jayeshbhai from Madhav Real Estate.`)}`} 
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 min-h-[44px] bg-[#25D366] text-white font-bold uppercase tracking-wider text-xs px-4 py-3 flex justify-center items-center gap-2 hover:bg-[#128C7E] transition-colors"
                  >
                    <MessageSquare size={16} /> WhatsApp Customer
                  </a>
                </div>

                {/* Requirement Message */}
                <div>
                  <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wider mb-4 border-b border-brand-900/10 pb-2">Requirement Details</h3>
                  <div className="bg-brand-50/50 p-6 border border-brand-900/5 text-sm text-brand-900/80 whitespace-pre-wrap font-mono leading-relaxed">
                    {selectedLead.message}
                  </div>
                </div>

              </div>

              {/* Right Col: CRM Controls */}
              <div className="bg-gray-50 border border-gray-200 p-6 space-y-6">
                
                {/* Status Update */}
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Update Status</label>
                  <select 
                    value={selectedLead.status}
                    onChange={(e) => handleUpdate({ status: e.target.value })}
                    disabled={isUpdating}
                    className="w-full bg-white border border-gray-300 p-3 text-sm font-bold focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 min-h-[44px]"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Follow-up Date */}
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Next Follow-up</label>
                  <input 
                    type="date" 
                    value={selectedLead.next_follow_up_at ? new Date(selectedLead.next_follow_up_at).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleUpdate({ next_follow_up_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    disabled={isUpdating}
                    className="w-full bg-white border border-gray-300 p-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 min-h-[44px]"
                  />
                </div>

                {/* Internal Notes */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                    <StickyNote size={14} /> Internal Notes (Private)
                  </label>
                  <textarea 
                    rows="6"
                    placeholder="Add private admin notes here..."
                    value={selectedLead.notes || ''}
                    onChange={(e) => setSelectedLead({...selectedLead, notes: e.target.value})}
                    onBlur={(e) => handleUpdate({ notes: e.target.value })}
                    disabled={isUpdating}
                    className="w-full bg-white border border-gray-300 p-4 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none disabled:opacity-50 font-mono"
                  ></textarea>
                  <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider font-bold">Notes auto-save when you click away.</p>
                </div>

                {/* Success Indicator */}
                <AnimatePresence>
                  {updateSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2 text-green-700 bg-green-50 border border-green-200 p-3 text-xs font-bold uppercase tracking-wider"
                    >
                      <CheckCircle size={14} /> Saved Successfully
                    </motion.div>
                  )}
                </AnimatePresence>
                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
