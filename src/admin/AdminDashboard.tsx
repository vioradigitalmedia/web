import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'messages' | 'media' | 'submissions'>('dashboard');

  useEffect(() => {
    // 1. Fetch current session
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      setAuthLoading(false);
    });

    // 2. Listen to session shifts
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      setSession(activeSession);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setMessages(data || []);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to fetch contact submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchMessages();
    }
  }, [session]);

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    setUpdatingId(id);
    const newStatus = currentStatus === 'pending' ? 'reviewed' : 'pending';
    try {
      const { error: updateError } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', id);

      if (updateError) throw updateError;
      
      // Update local state
      setMessages(prev => 
        prev.map(msg => msg.id === id ? { ...msg, status: newStatus } : msg)
      );
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    setUpdatingId(id);
    try {
      const { error: deleteError } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Remove from state
      setMessages(prev => prev.filter(msg => msg.id !== id));
    } catch (err: any) {
      alert('Error deleting message: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics calculations
  const totalInquiries = messages.length;
  const pendingInquiries = messages.filter(m => m.status === 'pending').length;
  const reviewedInquiries = messages.filter(m => m.status === 'reviewed').length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-secondary/20 border-t-secondary animate-spin" />
        <span className="text-xs text-accent-muted tracking-widest uppercase font-light">Verifying Credentials...</span>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  // Render individual panels
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in text-left">
            {/* Greeting card */}
            <div className="border border-white/5 bg-primary-light p-8 rounded-sm border-gold-glow flex flex-col gap-3">
              <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase">Management Console</span>
              <h2 className="font-serif text-2xl md:text-3xl text-white">Welcome to the Viora Admin Console</h2>
              <p className="text-xs text-accent-muted font-light leading-relaxed max-w-xl">
                Use the left-hand navigation sidebar to inspect visitor messages, manage short film submissions, review uploaded files in the media library, and maintain system updates.
              </p>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="border border-white/5 bg-primary-light p-6 rounded-sm flex items-center justify-between border-gold-glow">
                <div>
                  <span className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold">Total Submissions</span>
                  <h2 className="text-3xl font-serif text-white mt-1">{totalInquiries}</h2>
                </div>
                <div className="h-10 w-10 bg-secondary/5 rounded-full border border-secondary/20 flex items-center justify-center">
                  <i className="fa-solid fa-inbox text-secondary text-sm"></i>
                </div>
              </div>

              <div className="border border-white/5 bg-primary-light p-6 rounded-sm flex items-center justify-between border-gold-glow">
                <div>
                  <span className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold">Pending Action</span>
                  <h2 className="text-3xl font-serif text-secondary mt-1">{pendingInquiries}</h2>
                </div>
                <div className="h-10 w-10 bg-secondary/5 rounded-full border border-secondary/20 flex items-center justify-center">
                  <i className="fa-solid fa-clock text-secondary text-sm"></i>
                </div>
              </div>

              <div className="border border-white/5 bg-primary-light p-6 rounded-sm flex items-center justify-between border-gold-glow">
                <div>
                  <span className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold">Reviewed / Resolved</span>
                  <h2 className="text-3xl font-serif text-white mt-1">{reviewedInquiries}</h2>
                </div>
                <div className="h-10 w-10 bg-secondary/5 rounded-full border border-secondary/20 flex items-center justify-center">
                  <i className="fa-solid fa-circle-check text-secondary text-sm"></i>
                </div>
              </div>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase">Communication</span>
                <h1 className="font-serif text-3xl text-white tracking-wide mt-1">Inquiry Queue</h1>
              </div>
              <button 
                onClick={fetchMessages}
                className="px-4 py-2 bg-primary-light border border-white/10 hover:border-secondary text-xs tracking-widest uppercase transition-all duration-300 rounded-sm text-center flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <i className="fa-solid fa-arrows-rotate"></i> Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="h-8 w-8 rounded-full border-2 border-secondary/20 border-t-secondary animate-spin" />
                <span className="text-xs text-accent-muted tracking-widest uppercase font-light">Loading Database Records...</span>
              </div>
            ) : error ? (
              <div className="py-12 text-center max-w-md mx-auto space-y-4">
                <div className="h-12 w-12 rounded-full border border-red-500/20 bg-red-950/20 flex items-center justify-center mx-auto text-red-500">
                  <i className="fa-solid fa-circle-exclamation text-lg"></i>
                </div>
                <p className="text-red-400 text-sm font-light">{error}</p>
                <button 
                  onClick={fetchMessages}
                  className="px-4 py-2 border border-red-500/20 text-red-400 hover:bg-red-950/20 text-xs tracking-widest uppercase transition-all duration-300 rounded-sm"
                >
                  Retry Request
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="py-20 text-center text-accent-muted space-y-3">
                <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center mx-auto text-white/40">
                  <i className="fa-solid fa-folder-open text-lg"></i>
                </div>
                <p className="text-sm font-light">No briefs or messages found in the database.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-white/5 bg-primary-light p-4 rounded-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] tracking-widest uppercase font-semibold text-secondary">
                      <th className="py-4 px-4">Date</th>
                      <th className="py-4 px-4">Sender</th>
                      <th className="py-4 px-4">Email</th>
                      <th className="py-4 px-4">Message Brief</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs font-light text-accent-muted">
                    {messages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-white/[0.02] transition-colors duration-200">
                        <td className="py-4 px-4 whitespace-nowrap text-white">
                          {new Date(msg.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-4 px-4 font-semibold text-white whitespace-nowrap">
                          {msg.name}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <a 
                            href={`mailto:${msg.email}`} 
                            className="text-secondary hover:text-white transition-colors duration-200"
                          >
                            {msg.email}
                          </a>
                        </td>
                        <td className="py-4 px-4 max-w-md break-words leading-relaxed">
                          {msg.message}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-block px-2.5 py-1 text-[9px] tracking-widest uppercase font-bold rounded-sm border ${
                            msg.status === 'pending'
                              ? 'bg-amber-950/20 text-amber-400 border-amber-500/20'
                              : 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {msg.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                          <button
                            disabled={updatingId === msg.id}
                            onClick={() => handleUpdateStatus(msg.id, msg.status)}
                            className={`px-3 py-1.5 border rounded-sm text-[10px] tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                              msg.status === 'pending'
                                ? 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/30'
                                : 'border-amber-500/20 text-amber-400 hover:bg-amber-950/30'
                            } disabled:opacity-50`}
                            title={msg.status === 'pending' ? 'Mark as Reviewed' : 'Mark as Pending'}
                          >
                            {msg.status === 'pending' ? 'Review' : 'Re-open'}
                          </button>
                          <button
                            disabled={updatingId === msg.id}
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="px-3 py-1.5 border border-red-500/20 text-red-400 hover:bg-red-950/30 rounded-sm text-[10px] tracking-widest uppercase transition-all duration-300 cursor-pointer disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'media':
        return (
          <div className="space-y-6 animate-fade-in text-left">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase">Assets</span>
              <h1 className="font-serif text-3xl text-white tracking-wide mt-1">Media Library</h1>
            </div>
            <div className="border border-white/5 bg-[#0A0A0A] p-12 rounded-sm text-center max-w-md mx-auto space-y-4 mt-12 border-gold-glow">
              <div className="h-14 w-14 rounded-full border border-secondary/20 bg-secondary/5 flex items-center justify-center mx-auto text-secondary text-lg">
                <i className="fa-solid fa-images"></i>
              </div>
              <h3 className="font-serif text-lg text-white">Asset Cataloging Coming Soon</h3>
              <p className="text-xs text-accent-muted font-light leading-relaxed">
                The media library is currently under construction. You will soon be able to upload, review, and catalog film posters, screenplays, and promo files directly from here.
              </p>
            </div>
          </div>
        );

      case 'submissions':
        return (
          <div className="space-y-6 animate-fade-in text-left">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase">Showcase</span>
              <h1 className="font-serif text-3xl text-white tracking-wide mt-1">Submissions</h1>
            </div>
            <div className="border border-white/5 bg-[#0A0A0A] p-12 rounded-sm text-center max-w-md mx-auto space-y-4 mt-12 border-gold-glow">
              <div className="h-14 w-14 rounded-full border border-secondary/20 bg-secondary/5 flex items-center justify-center mx-auto text-secondary text-lg">
                <i className="fa-solid fa-clapperboard"></i>
              </div>
              <h3 className="font-serif text-lg text-white">Submissions Manager Coming Soon</h3>
              <p className="text-xs text-accent-muted font-light leading-relaxed">
                The submission tracking platform is under construction. Once enabled, all submissions entered via short film festival forms will show up in this queue for grading.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex font-sans">
      
      {/* Left Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userEmail={session.user?.email || 'admin@vioramedia.in'}
        onLogout={() => supabase.auth.signOut()}
      />

      {/* Right Content Area */}
      <main className="flex-grow h-screen overflow-y-auto p-6 md:p-10">
        {renderActiveView()}
      </main>

    </div>
  );
}
