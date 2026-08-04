import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import LetterheadScreen from '../screens/LetterheadScreen';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.VITE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY || '',
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  forcePathStyle: true,
});

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

const isSubmissionMsg = (messageStr: string) => {
  const content = (messageStr || '').toLowerCase();
  return (
    content.includes('film title:') ||
    content.includes('logline:') ||
    content.includes('director:') ||
    content.includes('movie url:') ||
    content.includes('genre:') ||
    content.includes('submission:') ||
    content.includes('payment id:') ||
    content.includes('film submission')
  );
};

interface CfoTransaction {
  id: string;
  created_at: string;
  transaction_date: string;
  title: string;
  type: 'income' | 'expense';
  amount: number;
}

interface FestivalSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  film_title: string;
  genre: string;
  runtime: string;
  logline: string;
  lang: string | null;
  director: string;
  cinematographer: string | null;
  editor: string | null;
  music_composer: string | null;
  sound_engineer: string | null;
  main_actor: string | null;
  main_actress: string | null;
  movie_url: string;
  poster_url: string | null;
  is_cs: boolean;
  id_url: string | null;
  payment_id: string;
  payment_status: string;
  amount_paid: number;
  created_at: string;
}

interface PartnerProposal {
  id: string;
  name: string;
  email: string;
  company: string;
  proposal: string;
  status: string;
  created_at: string;
}

interface AdminDocument {
  id: string;
  title: string;
  type: string;
  recipient_name: string;
  file_url: string;
  created_by: string;
  created_at: string;
}

interface PhotoFestSubmission {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  is_student: boolean;
  photo_filename: string;
  photo_url: string | null;
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'messages' | 'media' | 'submissions' | 'photo-submissions' | 'cfo' | 'letterhead' | 'partners'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [appView, setAppView] = useState<'selection' | 'dashboard'>('selection');

  // Partners States
  const [partners, setPartners] = useState<PartnerProposal[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [partnersError, setPartnersError] = useState<string | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [expandedMobileMessageId, setExpandedMobileMessageId] = useState<string | null>(null);

  // CFO States
  const [cfoTransactions, setCfoTransactions] = useState<CfoTransaction[]>([]);
  const [cfoLoading, setCfoLoading] = useState(true);
  const [cfoError, setCfoError] = useState<string | null>(null);

  // CFO Modal & Form States
  const [isCfoModalOpen, setIsCfoModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<'income' | 'expense'>('income');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [cfoSubmitting, setCfoSubmitting] = useState(false);
  const [cfoSubmitError, setCfoSubmitError] = useState<string | null>(null);

  // Submissions States
  const [submissions, setSubmissions] = useState<FestivalSubmission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [expandedMobileSubmissionId, setExpandedMobileSubmissionId] = useState<string | null>(null);

  // Photo Submissions States
  const [photoSubmissions, setPhotoSubmissions] = useState<PhotoFestSubmission[]>([]);
  const [photoSubmissionsLoading, setPhotoSubmissionsLoading] = useState(true);
  const [photoSubmissionsError, setPhotoSubmissionsError] = useState<string | null>(null);
  const [selectedPhotoSubmissionId, setSelectedPhotoSubmissionId] = useState<string | null>(null);
  const [expandedMobilePhotoSubmissionId, setExpandedMobilePhotoSubmissionId] = useState<string | null>(null);
  const [photoPresignedUrl, setPhotoPresignedUrl] = useState<string | null>(null);

  // Presigned URL States for Secure Private R2 Media
  const [moviePresignedUrl, setMoviePresignedUrl] = useState<string | null>(null);
  const [posterPresignedUrl, setPosterPresignedUrl] = useState<string | null>(null);
  const [idPresignedUrl, setIdPresignedUrl] = useState<string | null>(null);
  const [presignedLoading, setPresignedLoading] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<'movies' | 'posters' | 'docs'>('movies');
  const [adminDocs, setAdminDocs] = useState<AdminDocument[]>([]);
  const [adminDocsLoading, setAdminDocsLoading] = useState(false);
  const [selectedDocKey, setSelectedDocKey] = useState<string | null>(null);

  // Admin data for Letterhead auto-fill
  const [adminData, setAdminData] = useState<{ first_name: string; last_name: string; designation: string; signature?: string | null } | null>(null);

  const fetchAdminDocs = async () => {
    setAdminDocsLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminDocs(data || []);
    } catch (err) {
      console.error('Error fetching admin docs:', err);
    } finally {
      setAdminDocsLoading(false);
    }
  };

  useEffect(() => {
    if (mediaFilter === 'docs') {
      fetchAdminDocs();
    }
  }, [mediaFilter]);

  useEffect(() => {
    const generateUrls = async () => {
      if (selectedDocKey) {
        setPresignedLoading(true);
        try {
          const command = new GetObjectCommand({
            Bucket: 'viorasf',
            Key: selectedDocKey,
          });
          const url = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
          setIdPresignedUrl(url); // Re-use idPresignedUrl for the iframe in the modal
          setMoviePresignedUrl(null);
          setPosterPresignedUrl(null);
        } catch (err) {
          console.error(err);
        } finally {
          setPresignedLoading(false);
        }
        return;
      }

      const selected = submissions.find(s => s.id === selectedSubmissionId);
      if (!selected) {
        setMoviePresignedUrl(null);
        setPosterPresignedUrl(null);
        setIdPresignedUrl(null);
        return;
      }

      setPresignedLoading(true);
      try {
        // Generate movie presigned URL (1 hour expiry)
        const movieCommand = new GetObjectCommand({
          Bucket: 'viorasf',
          Key: selected.movie_url,
        });
        const movieUrl = await getSignedUrl(r2Client, movieCommand, { expiresIn: 3600 });
        setMoviePresignedUrl(movieUrl);

        // Generate poster presigned URL (1 hour expiry) if it exists
        if (selected.poster_url) {
          const posterCommand = new GetObjectCommand({
            Bucket: 'viorasf',
            Key: selected.poster_url,
          });
          const posterUrl = await getSignedUrl(r2Client, posterCommand, { expiresIn: 3600 });
          setPosterPresignedUrl(posterUrl);
        } else {
          setPosterPresignedUrl(null);
        }

        // Generate College ID presigned URL (1 hour expiry) if it exists
        if (selected.id_url) {
          const idCommand = new GetObjectCommand({
            Bucket: 'viorasf',
            Key: selected.id_url,
          });
          const idUrlStr = await getSignedUrl(r2Client, idCommand, { expiresIn: 3600 });
          setIdPresignedUrl(idUrlStr);
        } else {
          setIdPresignedUrl(null);
        }
      } catch (err) {
        console.error('Error generating presigned URLs:', err);
        setMoviePresignedUrl(null);
        setPosterPresignedUrl(null);
        setIdPresignedUrl(null);
      } finally {
        setPresignedLoading(false);
      }
    };

    generateUrls();
  }, [selectedSubmissionId, submissions, selectedDocKey]);

  useEffect(() => {
    const generatePhotoUrl = async () => {
      const selected = photoSubmissions.find(s => s.id === selectedPhotoSubmissionId);
      if (!selected || !selected.photo_url) {
        setPhotoPresignedUrl(null);
        return;
      }

      if (selected.photo_url.startsWith('http://') || selected.photo_url.startsWith('https://')) {
        setPhotoPresignedUrl(selected.photo_url);
        return;
      }

      setPresignedLoading(true);
      try {
        const photoCommand = new GetObjectCommand({
          Bucket: 'viorasf',
          Key: selected.photo_url,
        });
        const url = await getSignedUrl(r2Client, photoCommand, { expiresIn: 3600 });
        setPhotoPresignedUrl(url);
      } catch (err) {
        console.error('Error generating photo presigned URL:', err);
        setPhotoPresignedUrl(null);
      } finally {
        setPresignedLoading(false);
      }
    };

    generatePhotoUrl();
  }, [selectedPhotoSubmissionId, photoSubmissions]);

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
      const loadedMessages = data || [];
      setMessages(loadedMessages);

      const filtered = loadedMessages.filter(msg => !isSubmissionMsg(msg.message));
      if (filtered.length > 0) {
        setSelectedMessageId(filtered[0].id);
      } else {
        setSelectedMessageId(null);
      }
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to fetch contact submissions.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCfoTransactions = async () => {
    setCfoLoading(true);
    setCfoError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('cfo_transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (fetchError) throw fetchError;
      setCfoTransactions(data || []);
    } catch (err: any) {
      console.error('Error fetching CFO transactions:', err);
      setCfoError(err.message || 'Failed to fetch financial transactions.');
    } finally {
      setCfoLoading(false);
    }
  };

  const handleCreateCfoTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount || parseFloat(newAmount) <= 0) {
      setCfoSubmitError('Please enter a valid title and positive amount.');
      return;
    }
    setCfoSubmitting(true);
    setCfoSubmitError(null);
    try {
      const { error: insertError } = await supabase
        .from('cfo_transactions')
        .insert({
          title: newTitle.trim(),
          amount: parseFloat(newAmount),
          type: newType,
          transaction_date: newDate
        });

      if (insertError) throw insertError;

      // Reset form and close modal
      setNewTitle('');
      setNewAmount('');
      setNewType('income');
      setNewDate(new Date().toISOString().split('T')[0]);
      setIsCfoModalOpen(false);

      // Refresh list
      await fetchCfoTransactions();
    } catch (err: any) {
      console.error('Error inserting transaction:', err);
      setCfoSubmitError(err.message || 'Failed to submit transaction.');
    } finally {
      setCfoSubmitting(false);
    }
  };

  const fetchAdminData = async () => {
    if (!session?.user?.id) return;
    try {
      const { data, error: fetchError } = await supabase
        .from('admins')
        .select('first_name, last_name, designation, signature')
        .eq('id', session.user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching admin data:', fetchError);
        return;
      }
      setAdminData(data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const fetchPartners = async () => {
    setPartnersLoading(true);
    setPartnersError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('partner_proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPartners(data || []);
      if (data && data.length > 0) {
        setSelectedPartnerId(data[0].id);
      } else {
        setSelectedPartnerId(null);
      }
    } catch (err: any) {
      console.error('Error fetching partners:', err);
      setPartnersError(err.message || 'Failed to fetch partner proposals.');
    } finally {
      setPartnersLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchMessages();
      fetchCfoTransactions();
      fetchSubmissions();
      fetchPhotoSubmissions();
      fetchAdminData();
      fetchPartners();
    }
  }, [session]);

  const fetchPhotoSubmissions = async () => {
    setPhotoSubmissionsLoading(true);
    setPhotoSubmissionsError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('photo_fest_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPhotoSubmissions(data || []);
      if (data && data.length > 0) {
        setSelectedPhotoSubmissionId(data[0].id);
      } else {
        setSelectedPhotoSubmissionId(null);
      }
    } catch (err: any) {
      console.error('Error fetching photo submissions:', err);
      setPhotoSubmissionsError(err.message || 'Failed to fetch photo fest submissions.');
    } finally {
      setPhotoSubmissionsLoading(false);
    }
  };

  const handleDeletePhotoSubmission = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this photo submission?')) return;

    setUpdatingId(id);
    try {
      const { error: deleteError } = await supabase
        .from('photo_fest_submissions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setPhotoSubmissions(prev => prev.filter(item => item.id !== id));
      if (selectedPhotoSubmissionId === id) {
        setSelectedPhotoSubmissionId(null);
      }
    } catch (err: any) {
      alert('Error deleting photo submission: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const fetchSubmissions = async () => {
    setSubmissionsLoading(true);
    setSubmissionsError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('festival_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setSubmissions(data || []);
      if (data && data.length > 0) {
        setSelectedSubmissionId(data[0].id);
      } else {
        setSelectedSubmissionId(null);
      }
    } catch (err: any) {
      console.error('Error fetching submissions:', err);
      setSubmissionsError(err.message || 'Failed to fetch festival submissions.');
    } finally {
      setSubmissionsLoading(false);
    }
  };

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

      // Remove from state and handle selection shifts
      setMessages(prev => {
        const remaining = prev.filter(msg => msg.id !== id);
        if (selectedMessageId === id) {
          setSelectedMessageId(remaining.length > 0 ? remaining[0].id : null);
        }
        return remaining;
      });
    } catch (err: any) {
      alert('Error deleting message: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    setUpdatingId(id);
    try {
      const { error: deleteError } = await supabase
        .from('festival_submissions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Remove from state and handle selection shifts
      setSubmissions(prev => {
        const remaining = prev.filter(sub => sub.id !== id);
        if (selectedSubmissionId === id) {
          setSelectedSubmissionId(remaining.length > 0 ? remaining[0].id : null);
        }
        return remaining;
      });
    } catch (err: any) {
      alert('Error deleting submission: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredMessages = messages.filter(msg => !isSubmissionMsg(msg.message));

  // Metrics calculations
  const totalInquiries = filteredMessages.length;
  const pendingInquiries = filteredMessages.filter(m => m.status === 'pending').length;

  const totalSubmissions = submissions.length;
  const totalRevenue = submissions.reduce((sum, s) => {
    const rawAmount = Number(s.amount_paid || 999.00);
    const gatewayFee = rawAmount * 0.02;
    const gstOnFee = gatewayFee * 0.18;
    const netAmount = rawAmount - gatewayFee - gstOnFee;
    return sum + netAmount;
  }, 0);

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

  if (appView === 'selection' && session?.user?.email === 'takilesh07@gmail.com') {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="mb-12 text-center z-10">
          <img
            src="/logo.jpg"
            alt="Viora Logo"
            className="h-16 w-16 object-contain rounded-md border border-secondary/20 mx-auto mb-6 shadow-[0_0_30px_rgba(197,160,89,0.15)]"
          />
          <h1 className="font-serif text-4xl text-white tracking-wide mb-2">Welcome Admin</h1>
          <p className="text-accent-muted text-sm tracking-widest uppercase font-light">Select an application to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full z-10">
          {/* Option 1: Viora Console */}
          <button
            onClick={() => setAppView('dashboard')}
            className="group relative bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 hover:border-secondary/50 rounded-lg p-8 flex flex-col items-center justify-center gap-6 transition-all duration-500 hover:shadow-[0_0_40px_rgba(197,160,89,0.1)] hover:-translate-y-1 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="h-16 w-16 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500">
              <i className="fa-solid fa-gauge-high text-2xl"></i>
            </div>
            <div className="text-center relative z-10">
              <h3 className="text-xl font-serif tracking-wide text-white mb-2">Viora Web Console</h3>
              <p className="text-xs text-accent-muted font-light leading-relaxed">Access the main dashboard, manage submissions, messages, and analytics.</p>
            </div>
          </button>

          {/* Option 2: Coming Soon */}
          <div className="group relative bg-[#0A0A0A]/40 backdrop-blur-md border border-white/5 rounded-lg p-8 flex flex-col items-center justify-center gap-6 cursor-not-allowed opacity-75">
            <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30">
              <i className="fa-solid fa-film text-2xl"></i>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-serif tracking-wide text-white/50 mb-2">Application 2</h3>
              <div className="inline-block mt-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <span className="text-[10px] tracking-widest text-white/40 uppercase font-semibold">Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Option 3: Coming Soon */}
          <div className="group relative bg-[#0A0A0A]/40 backdrop-blur-md border border-white/5 rounded-lg p-8 flex flex-col items-center justify-center gap-6 cursor-not-allowed opacity-75">
            <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30">
              <i className="fa-solid fa-chart-line text-2xl"></i>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-serif tracking-wide text-white/50 mb-2">Application 3</h3>
              <div className="inline-block mt-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <span className="text-[10px] tracking-widest text-white/40 uppercase font-semibold">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render individual panels
  const renderActiveView = () => {
    switch (activeTab) {
      case 'partners':
        const selectedPartner = partners.find(p => p.id === selectedPartnerId);
        return (
          <div className="space-y-6 animate-fade-in text-left flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase">Collaboration</span>
                <h1 className="font-serif text-3xl text-white tracking-wide mt-1">Partnership Proposals</h1>
              </div>
              <button
                onClick={fetchPartners}
                className="px-4 py-2 bg-primary-light border border-white/10 hover:border-secondary text-xs tracking-widest uppercase transition-all duration-300 rounded-sm text-center flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <i className="fa-solid fa-arrows-rotate"></i> Refresh
              </button>
            </div>
            {partnersLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <i className="fa-solid fa-circle-notch fa-spin text-3xl text-secondary"></i>
                <span className="text-xs tracking-widest uppercase text-accent-muted">Loading Proposals...</span>
              </div>
            ) : partnersError ? (
              <div className="p-6 bg-red-950/20 border border-red-500/20 text-red-400 rounded-sm text-center">
                <i className="fa-solid fa-circle-exclamation text-2xl mb-2"></i>
                <p className="text-sm">{partnersError}</p>
              </div>
            ) : partners.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <i className="fa-solid fa-handshake text-2xl text-accent-muted"></i>
                </div>
                <h3 className="font-serif text-xl text-white mb-2">No Proposals Yet</h3>
                <p className="text-sm text-accent-muted font-light max-w-sm">
                  Partnership proposals submitted via the website will appear here.
                </p>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-16rem)] min-h-[500px]">
                {/* List View */}
                <div className="w-full lg:w-1/3 border border-white/5 bg-primary-light rounded-sm flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-white/5 bg-black/20">
                    <h3 className="text-xs font-semibold tracking-widest text-accent-muted uppercase">Proposals ({partners.length})</h3>
                  </div>
                  <div className="overflow-y-auto flex-1 custom-scrollbar">
                    {partners.map(p => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPartnerId(p.id)}
                        className={`p-4 border-b border-white/5 cursor-pointer transition-all ${selectedPartnerId === p.id ? 'bg-secondary/10 border-l-2 border-l-secondary' : 'hover:bg-white/5 border-l-2 border-l-transparent'}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-medium text-sm truncate ${selectedPartnerId === p.id ? 'text-secondary' : 'text-white'}`}>{p.company}</h4>
                          <span className="text-[10px] text-accent-muted flex-shrink-0">{new Date(p.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-accent-muted truncate">{p.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detail View */}
                <div className="hidden lg:flex w-full lg:w-2/3 border border-white/5 bg-primary-light rounded-sm flex-col overflow-hidden">
                  {selectedPartner ? (
                    <>
                      <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-start">
                        <div>
                          <h2 className="font-serif text-2xl text-white">{selectedPartner.company}</h2>
                          <div className="flex items-center gap-4 mt-2 text-xs text-accent-muted">
                            <span><i className="fa-solid fa-user mr-2 text-secondary"></i>{selectedPartner.name}</span>
                            <a href={`mailto:${selectedPartner.email}`} className="hover:text-white transition-colors">
                              <i className="fa-solid fa-envelope mr-2 text-secondary"></i>{selectedPartner.email}
                            </a>
                          </div>
                        </div>
                        <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-accent-muted">
                          {new Date(selectedPartner.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                        <div className="mb-6">
                          <h4 className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold border-b border-white/5 pb-2 mb-4">
                            Proposal Details
                          </h4>
                          <div className="prose prose-invert prose-sm max-w-none text-accent-muted whitespace-pre-wrap font-light leading-relaxed">
                            {selectedPartner.proposal}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        );
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border border-white/5 bg-primary-light p-6 rounded-sm flex items-center justify-between border-gold-glow">
                <div>
                  <span className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold">Total Inquiries</span>
                  <h2 className="text-3xl font-serif text-white mt-1">{totalInquiries}</h2>
                </div>
                <div className="h-10 w-10 bg-secondary/5 rounded-full border border-secondary/20 flex items-center justify-center">
                  <i className="fa-solid fa-inbox text-secondary text-sm"></i>
                </div>
              </div>

              <div className="border border-white/5 bg-primary-light p-6 rounded-sm flex items-center justify-between border-gold-glow">
                <div>
                  <span className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold">Pending Inquiries</span>
                  <h2 className="text-3xl font-serif text-secondary mt-1">{pendingInquiries}</h2>
                </div>
                <div className="h-10 w-10 bg-secondary/5 rounded-full border border-secondary/20 flex items-center justify-center">
                  <i className="fa-solid fa-clock text-secondary text-sm"></i>
                </div>
              </div>

              <div className="border border-white/5 bg-primary-light p-6 rounded-sm flex items-center justify-between border-gold-glow">
                <div>
                  <span className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold">Film Festival Entries</span>
                  <h2 className="text-3xl font-serif text-white mt-1">{totalSubmissions}</h2>
                </div>
                <div className="h-10 w-10 bg-secondary/5 rounded-full border border-secondary/20 flex items-center justify-center">
                  <i className="fa-solid fa-clapperboard text-secondary text-sm"></i>
                </div>
              </div>

              <div className="border border-white/5 bg-primary-light p-6 rounded-sm flex items-center justify-between border-gold-glow">
                <div>
                  <span className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold">Submission Revenue</span>
                  <h2 className="text-3xl font-serif text-white mt-1">
                    ₹{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                </div>
                <div className="h-10 w-10 bg-secondary/5 rounded-full border border-secondary/20 flex items-center justify-center">
                  <i className="fa-solid fa-rupee-sign text-secondary text-sm"></i>
                </div>
              </div>
            </div>
          </div>
        );

      case 'messages':
        const selectedMessage = filteredMessages.find(m => m.id === selectedMessageId);

        return (
          <div className="space-y-6 animate-fade-in text-left flex flex-col h-full">
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
            ) : filteredMessages.length === 0 ? (
              <div className="py-20 text-center text-accent-muted space-y-3">
                <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center mx-auto text-white/40">
                  <i className="fa-solid fa-folder-open text-lg"></i>
                </div>
                <p className="text-sm font-light">No briefs or messages found in the database.</p>
              </div>
            ) : (
              <div className="flex-grow flex flex-col md:flex-row gap-6 min-h-0">

                {/* Desktop View: Left column messages list */}
                <div className="hidden md:flex flex-col w-1/3 min-w-[280px] max-w-[360px] border border-white/5 bg-primary-light rounded-sm overflow-hidden h-[calc(100vh-14rem)]">
                  <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
                    <span className="text-[10px] tracking-widest uppercase font-bold text-secondary">
                      Inboxes ({filteredMessages.length})
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                    {filteredMessages.map((msg) => {
                      const isSelected = msg.id === selectedMessageId;
                      const snippet = msg.message.length > 80
                        ? msg.message.slice(0, 80) + '...'
                        : msg.message;
                      return (
                        <button
                          key={msg.id}
                          onClick={() => setSelectedMessageId(msg.id)}
                          className={`w-full text-left p-4 transition-all duration-200 cursor-pointer block hover:bg-white/[0.02] ${isSelected
                            ? 'bg-secondary/5 border-l-2 border-secondary shadow-[inset_4px_0_12px_rgba(197,160,89,0.05)]'
                            : ''
                            }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-white/80'}`}>
                              {msg.name}
                            </span>
                            <span className="text-[9px] text-accent-muted/80 whitespace-nowrap">
                              {new Date(msg.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>

                          <p className="text-[11px] text-accent-muted line-clamp-2 leading-relaxed mb-2">
                            {snippet}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-secondary font-light truncate max-w-[120px]">
                              {msg.email}
                            </span>
                            <span className={`inline-block px-1.5 py-0.5 text-[8px] tracking-widest uppercase font-bold rounded-sm border ${msg.status === 'pending'
                              ? 'bg-amber-950/20 text-amber-400 border-amber-500/20'
                              : 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20'
                              }`}>
                              {msg.status}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop View: Right column reading pane */}
                <div className="hidden md:flex flex-col flex-grow border border-white/5 bg-primary-light rounded-sm overflow-hidden h-[calc(100vh-14rem)]">
                  {selectedMessage ? (
                    <div className="flex flex-col h-full">
                      {/* Reader header */}
                      <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-serif text-white tracking-wide mb-1">
                            {selectedMessage.name}
                          </h2>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 text-xs font-light">
                            <div>
                              <span className="text-accent-muted">From: </span>
                              <a href={`mailto:${selectedMessage.email}`} className="text-secondary hover:text-white transition-colors duration-200">
                                {selectedMessage.email}
                              </a>
                            </div>
                            <span className="hidden sm:inline text-white/10">|</span>
                            <div className="text-accent-muted">
                              <span>Received: </span>
                              <span>
                                {new Date(selectedMessage.created_at).toLocaleString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`inline-block px-2.5 py-1 text-[9px] tracking-widest uppercase font-bold rounded-sm border ${selectedMessage.status === 'pending'
                            ? 'bg-amber-950/20 text-amber-400 border-amber-500/20'
                            : 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20'
                            }`}>
                            {selectedMessage.status}
                          </span>
                        </div>
                      </div>

                      {/* Reader body */}
                      <div className="flex-1 p-6 overflow-y-auto bg-black/10">
                        <span className="text-[10px] tracking-widest text-secondary font-semibold uppercase block mb-3">
                          Message Body
                        </span>
                        <div className="text-sm font-light text-accent-muted leading-relaxed whitespace-pre-wrap max-w-3xl bg-black/40 border border-white/5 p-5 rounded-sm">
                          {selectedMessage.message}
                        </div>
                      </div>

                      {/* Reader actions */}
                      <div className="p-4 border-t border-white/5 bg-black/25 flex justify-end gap-3">
                        <button
                          disabled={updatingId === selectedMessage.id}
                          onClick={() => handleUpdateStatus(selectedMessage.id, selectedMessage.status)}
                          className={`px-4 py-2 border rounded-sm text-xs tracking-widest uppercase font-semibold transition-all duration-300 cursor-pointer ${selectedMessage.status === 'pending'
                            ? 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/30'
                            : 'border-amber-500/20 text-amber-400 hover:bg-amber-950/30'
                            } disabled:opacity-50`}
                        >
                          {selectedMessage.status === 'pending' ? 'Mark as Reviewed' : 'Mark as Pending'}
                        </button>
                        <button
                          disabled={updatingId === selectedMessage.id}
                          onClick={() => handleDeleteMessage(selectedMessage.id)}
                          className="px-4 py-2 border border-red-500/20 text-red-400 hover:bg-red-950/30 rounded-sm text-xs tracking-widest uppercase font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50"
                        >
                          Delete Message
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-accent-muted p-10">
                      <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center mb-4 text-white/30">
                        <i className="fa-solid fa-envelope-open text-lg"></i>
                      </div>
                      <p className="text-sm font-light">Select an inquiry from the inbox list to read it.</p>
                    </div>
                  )}
                </div>

                {/* Mobile View: Accordion message cards */}
                <div className="block md:hidden space-y-4 w-full">
                  {filteredMessages.map((msg) => {
                    const isExpanded = msg.id === expandedMobileMessageId;
                    const snippet = msg.message.length > 60
                      ? msg.message.slice(0, 60) + '...'
                      : msg.message;

                    return (
                      <div
                        key={msg.id}
                        className={`border rounded-sm transition-all duration-300 overflow-hidden ${isExpanded
                          ? 'border-secondary/30 bg-[#0E0E0E]'
                          : 'border-white/5 bg-primary-light'
                          }`}
                      >
                        {/* Accordion Toggle Header */}
                        <button
                          onClick={() => setExpandedMobileMessageId(isExpanded ? null : msg.id)}
                          className="w-full text-left p-4 flex flex-col gap-2 cursor-pointer"
                        >
                          <div className="flex justify-between items-start gap-2 w-full">
                            <span className="font-semibold text-white text-sm truncate max-w-[70%]">
                              {msg.name}
                            </span>
                            <span className="text-[9px] text-accent-muted/80 whitespace-nowrap pt-0.5">
                              {new Date(msg.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          {!isExpanded && (
                            <p className="text-xs text-accent-muted line-clamp-1 leading-relaxed">
                              {snippet}
                            </p>
                          )}

                          <div className="flex justify-between items-center w-full mt-1">
                            <span className="text-[10px] text-secondary font-light truncate max-w-[70%]">
                              {msg.email}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`inline-block px-1.5 py-0.5 text-[8px] tracking-widest uppercase font-bold rounded-sm border ${msg.status === 'pending'
                                ? 'bg-amber-950/20 text-amber-400 border-amber-500/20'
                                : 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20'
                                }`}>
                                {msg.status}
                              </span>
                              <i className={`fa-solid fa-chevron-down text-[10px] text-accent-muted transition-transform duration-300 ${isExpanded ? 'rotate-180 text-secondary' : ''
                                }`}></i>
                            </div>
                          </div>
                        </button>

                        {/* Accordion Expandable Content */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t border-white/5 bg-black/30 space-y-4 animate-fade-in">
                            <div>
                              <span className="text-[9px] uppercase tracking-widest text-secondary block mb-1">
                                Message body
                              </span>
                              <p className="text-xs text-accent-muted leading-relaxed break-words bg-black/40 border border-white/5 p-3 rounded-sm">
                                {msg.message}
                              </p>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-white/5">
                              <button
                                disabled={updatingId === msg.id}
                                onClick={() => handleUpdateStatus(msg.id, msg.status)}
                                className={`flex-1 py-2 border rounded-sm text-[10px] tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer text-center ${msg.status === 'pending'
                                  ? 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/30'
                                  : 'border-amber-500/20 text-amber-400 hover:bg-amber-950/30'
                                  } disabled:opacity-50`}
                              >
                                {msg.status === 'pending' ? 'Review' : 'Re-open'}
                              </button>
                              <button
                                disabled={updatingId === msg.id}
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="px-4 py-2 border border-red-500/20 text-red-400 hover:bg-red-950/30 rounded-sm text-[10px] tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer text-center disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            )}
          </div>
        );

      case 'media':
        return (
          <div className="space-y-6 animate-fade-in text-left flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase">Assets</span>
                <div className="flex items-center gap-6 mt-1">
                  <h1 className="font-serif text-3xl text-white tracking-wide">Media Library</h1>
                  <div className="flex items-center bg-black/40 p-1 rounded-sm border border-white/5">
                    <button
                      onClick={() => setMediaFilter('movies')}
                      className={`px-4 py-1.5 text-xs tracking-widest uppercase transition-all duration-300 rounded-sm ${mediaFilter === 'movies' ? 'bg-secondary text-black font-bold' : 'text-accent-muted hover:text-white'}`}
                    >
                      Movies
                    </button>
                    <button
                      onClick={() => setMediaFilter('posters')}
                      className={`px-4 py-1.5 text-xs tracking-widest uppercase transition-all duration-300 rounded-sm ${mediaFilter === 'posters' ? 'bg-secondary text-black font-bold' : 'text-accent-muted hover:text-white'}`}
                    >
                      Posters
                    </button>
                    <button
                      onClick={() => setMediaFilter('docs')}
                      className={`px-4 py-1.5 text-xs tracking-widest uppercase transition-all duration-300 rounded-sm ${mediaFilter === 'docs' ? 'bg-secondary text-black font-bold' : 'text-accent-muted hover:text-white'}`}
                    >
                      Docs
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={fetchSubmissions}
                className="px-4 py-2 bg-primary-light border border-white/10 hover:border-secondary text-xs tracking-widest uppercase transition-all duration-300 rounded-sm text-center flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <i className="fa-solid fa-arrows-rotate"></i> Refresh
              </button>
            </div>

            {submissionsLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="h-8 w-8 rounded-full border-2 border-secondary/20 border-t-secondary animate-spin" />
                <span className="text-xs text-accent-muted tracking-widest uppercase font-light">Loading Media Assets...</span>
              </div>
            ) : submissionsError ? (
              <div className="py-12 text-center max-w-md mx-auto space-y-4">
                <div className="h-12 w-12 rounded-full border border-red-500/20 bg-red-950/20 flex items-center justify-center mx-auto text-red-500">
                  <i className="fa-solid fa-circle-exclamation text-lg"></i>
                </div>
                <p className="text-red-400 text-sm font-light">{submissionsError}</p>
                <button
                  onClick={fetchSubmissions}
                  className="px-4 py-2 border border-red-500/20 text-red-400 hover:bg-red-950/20 text-xs tracking-widest uppercase transition-all duration-300 rounded-sm"
                >
                  Retry Request
                </button>
              </div>
            ) : submissions.length === 0 ? (
              <div className="py-20 text-center text-accent-muted space-y-3">
                <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center mx-auto text-white/40">
                  <i className="fa-solid fa-film text-lg"></i>
                </div>
                <p className="text-sm font-light">No media assets found.</p>
              </div>
            ) : mediaFilter === 'docs' ? (
              adminDocsLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <div className="h-8 w-8 rounded-full border-2 border-secondary/20 border-t-secondary animate-spin" />
                  <span className="text-xs text-accent-muted tracking-widest uppercase font-light">Loading Documents...</span>
                </div>
              ) : adminDocs.length === 0 ? (
                <div className="py-20 text-center text-accent-muted space-y-3">
                  <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center mx-auto text-white/40">
                    <i className="fa-solid fa-file-pdf text-lg"></i>
                  </div>
                  <p className="text-sm font-light">No documents found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {adminDocs.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setSelectedSubmissionId(null);
                        setSelectedDocKey(doc.file_url);
                        setShowMediaModal(true);
                      }}
                      className="border border-white/5 bg-primary-light rounded-sm overflow-hidden flex flex-col hover:border-secondary/50 hover:bg-white/[0.02] transition-all duration-300 text-left w-full cursor-pointer group"
                    >
                      <div className="aspect-video w-full bg-black/40 flex flex-col items-center justify-center border-b border-white/5 relative p-4 text-center">
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                          <div className="h-12 w-12 rounded-full bg-secondary/90 flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.4)]">
                            <i className="fa-solid fa-magnifying-glass text-black text-lg"></i>
                          </div>
                        </div>
                        <i className="fa-solid fa-file-pdf text-3xl text-white/20 mb-3 group-hover:opacity-0 transition-opacity duration-300"></i>
                        <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold break-all line-clamp-2 group-hover:opacity-0 transition-opacity duration-300">
                          {doc.file_url.split('/').pop()}
                        </span>
                      </div>
                      <div className="p-5 flex-grow flex flex-col w-full">
                        <h3 className="text-sm font-semibold text-white truncate w-full" title={doc.title}>
                          {doc.title}
                        </h3>
                        <p className="text-[10px] text-accent-muted truncate w-full mt-1">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(mediaFilter === 'movies' ? submissions.filter(s => s.movie_url) : submissions.filter(s => s.poster_url)).map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedDocKey(null);
                      setSelectedSubmissionId(sub.id);
                      setShowMediaModal(true);
                    }}
                    className="border border-white/5 bg-primary-light rounded-sm overflow-hidden flex flex-col hover:border-secondary/50 hover:bg-white/[0.02] transition-all duration-300 text-left w-full cursor-pointer group"
                  >
                    <div className="aspect-video w-full bg-black/40 flex flex-col items-center justify-center border-b border-white/5 relative p-4 text-center">
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                        <div className="h-12 w-12 rounded-full bg-secondary/90 flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.4)]">
                          <i className={`fa-solid ${mediaFilter === 'movies' ? 'fa-play ml-1' : 'fa-magnifying-glass'} text-black text-lg`}></i>
                        </div>
                      </div>
                      <i className={`fa-solid ${mediaFilter === 'movies' ? 'fa-film' : 'fa-image'} text-3xl text-white/20 mb-3 group-hover:opacity-0 transition-opacity duration-300`}></i>
                      <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold break-all line-clamp-2 group-hover:opacity-0 transition-opacity duration-300">
                        {mediaFilter === 'movies' ? sub.movie_url : sub.poster_url}
                      </span>
                    </div>
                    <div className="p-5 space-y-2 flex-grow flex flex-col w-full">
                      <h3 className="text-sm font-semibold text-white truncate w-full" title={sub.film_title}>
                        {sub.film_title}
                      </h3>
                      <p className="text-xs text-accent-muted truncate w-full">
                        Dir: <span className="text-white/80">{sub.director}</span>
                      </p>

                      {sub.poster_url && mediaFilter !== 'posters' && (
                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between w-full">
                          <span className="text-[10px] text-white/30 font-medium tracking-wide">
                            Has assets
                          </span>
                          <span className="text-[10px] text-secondary/80 font-medium tracking-wide">
                            + POSTER
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Media Player Modal */}
            {showMediaModal && (selectedSubmissionId || selectedDocKey) && (
              <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
                <button
                  onClick={() => setShowMediaModal(false)}
                  className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors duration-200 z-10"
                >
                  <i className="fa-solid fa-xmark text-3xl"></i>
                </button>
                <div className="w-full max-w-5xl bg-black rounded-sm overflow-hidden border border-white/10 shadow-2xl relative">
                  {presignedLoading ? (
                    <div className="py-32 flex flex-col items-center justify-center gap-4">
                      <div className="h-10 w-10 rounded-full border-2 border-secondary/20 border-t-secondary animate-spin"></div>
                      <span className="text-sm text-accent-muted tracking-widest uppercase">Securing media stream...</span>
                    </div>
                  ) : mediaFilter === 'movies' && moviePresignedUrl ? (
                    <video
                      src={moviePresignedUrl}
                      controls
                      autoPlay
                      className="w-full aspect-video bg-black outline-none"
                    />
                  ) : mediaFilter === 'posters' && posterPresignedUrl ? (
                    <img
                      src={posterPresignedUrl}
                      alt="Poster"
                      className="w-full max-h-[85vh] object-contain bg-black outline-none"
                    />
                  ) : mediaFilter === 'docs' && idPresignedUrl ? (
                    <iframe
                      src={idPresignedUrl}
                      title="Document"
                      className="w-full h-[85vh] bg-white outline-none rounded-sm"
                    />
                  ) : (
                    <div className="py-32 flex flex-col items-center justify-center gap-4">
                      <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500/50"></i>
                      <span className="text-sm text-red-400">Failed to load media stream</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'submissions':
        const selectedSubmission = submissions.find(s => s.id === selectedSubmissionId);

        return (
          <div className="space-y-6 animate-fade-in text-left flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase">Showcase</span>
                <h1 className="font-serif text-3xl text-white tracking-wide mt-1">Festival Submissions</h1>
              </div>
              <button
                onClick={fetchSubmissions}
                className="px-4 py-2 bg-primary-light border border-white/10 hover:border-secondary text-xs tracking-widest uppercase transition-all duration-300 rounded-sm text-center flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <i className="fa-solid fa-arrows-rotate"></i> Refresh
              </button>
            </div>

            {submissionsLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="h-8 w-8 rounded-full border-2 border-secondary/20 border-t-secondary animate-spin" />
                <span className="text-xs text-accent-muted tracking-widest uppercase font-light">Loading Database Records...</span>
              </div>
            ) : submissionsError ? (
              <div className="py-12 text-center max-w-md mx-auto space-y-4">
                <div className="h-12 w-12 rounded-full border border-red-500/20 bg-red-950/20 flex items-center justify-center mx-auto text-red-500">
                  <i className="fa-solid fa-circle-exclamation text-lg"></i>
                </div>
                <p className="text-red-400 text-sm font-light">{submissionsError}</p>
                <button
                  onClick={fetchSubmissions}
                  className="px-4 py-2 border border-red-500/20 text-red-400 hover:bg-red-950/20 text-xs tracking-widest uppercase transition-all duration-300 rounded-sm"
                >
                  Retry Request
                </button>
              </div>
            ) : submissions.length === 0 ? (
              <div className="py-20 text-center text-accent-muted space-y-3">
                <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center mx-auto text-white/40">
                  <i className="fa-solid fa-folder-open text-lg"></i>
                </div>
                <p className="text-sm font-light">No submissions found in the database.</p>
              </div>
            ) : (
              <div className="flex-grow flex flex-col md:flex-row gap-6 min-h-0">

                {/* Desktop View: Left column submissions list */}
                <div className="hidden md:flex flex-col w-1/3 min-w-[280px] max-w-[360px] border border-white/5 bg-primary-light rounded-sm overflow-hidden h-[calc(100vh-14rem)]">
                  <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
                    <span className="text-[10px] tracking-widest uppercase font-bold text-secondary">
                      Entries ({submissions.length})
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                    {submissions.map((sub) => {
                      const isSelected = sub.id === selectedSubmissionId;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setSelectedSubmissionId(sub.id)}
                          className={`w-full text-left p-4 transition-all duration-200 cursor-pointer block hover:bg-white/[0.02] ${isSelected
                            ? 'bg-secondary/5 border-l-2 border-secondary shadow-[inset_4px_0_12px_rgba(197,160,89,0.05)]'
                            : ''
                            }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-white/80'}`}>
                              {sub.film_title}
                            </span>
                            <span className="text-[9px] text-accent-muted/80 whitespace-nowrap">
                              {new Date(sub.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>

                          <p className="text-[11px] text-accent-muted truncate leading-relaxed mb-2">
                            Dir: {sub.director} | {sub.genre}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-secondary font-light truncate max-w-[120px]">
                              {sub.name}
                            </span>
                            <span className="inline-block px-1.5 py-0.5 text-[8px] tracking-widest uppercase font-bold rounded-sm border bg-emerald-950/20 text-emerald-400 border-emerald-500/20">
                              Paid
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop View: Right column reading pane */}
                <div className="hidden md:flex flex-col flex-grow border border-white/5 bg-primary-light rounded-sm overflow-hidden h-[calc(100vh-14rem)]">
                  {selectedSubmission ? (
                    <div className="flex flex-col h-full">
                      {/* Reader header */}
                      <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-serif text-white tracking-wide mb-1">
                            {selectedSubmission.film_title}
                          </h2>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 text-xs font-light">
                            <div>
                              <span className="text-accent-muted">Submitter: </span>
                              <span className="text-secondary">{selectedSubmission.name}</span>
                            </div>
                            <span className="hidden sm:inline text-white/10">|</span>
                            <div className="text-accent-muted">
                              <span>Submitted: </span>
                              <span>
                                {new Date(selectedSubmission.created_at).toLocaleString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="inline-block px-2.5 py-1 text-[9px] tracking-widest uppercase font-bold rounded-sm border bg-emerald-950/20 text-emerald-400 border-emerald-500/20">
                            Payment: {selectedSubmission.payment_status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Reader body */}
                      <div className="flex-1 p-6 space-y-6 bg-black/10 overflow-y-auto">
                        {/* Submitter & Film Details Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Submitter Info */}
                          <div className="border border-white/5 bg-black/40 p-5 rounded-sm space-y-3">
                            <span className="text-[10px] tracking-widest text-secondary font-semibold uppercase block border-b border-white/5 pb-2">
                              Submitter Details
                            </span>
                            <div className="text-xs space-y-2 font-light text-accent-muted">
                              <p><strong className="text-white">Name:</strong> {selectedSubmission.name}</p>
                              <p><strong className="text-white">Email:</strong> <a href={`mailto:${selectedSubmission.email}`} className="text-secondary hover:text-white transition-colors duration-200">{selectedSubmission.email}</a></p>
                              <p><strong className="text-white">Phone:</strong> <a href={`tel:${selectedSubmission.phone}`} className="text-secondary hover:text-white transition-colors duration-200">{selectedSubmission.phone}</a></p>
                              <p><strong className="text-white">City:</strong> {selectedSubmission.city}</p>
                              <p><strong className="text-white">College Student:</strong> {selectedSubmission.is_cs ? 'Yes' : 'No'}</p>
                            </div>
                          </div>

                          {/* Film Details */}
                          <div className="border border-white/5 bg-black/40 p-5 rounded-sm space-y-3">
                            <span className="text-[10px] tracking-widest text-secondary font-semibold uppercase block border-b border-white/5 pb-2">
                              Film Metadata
                            </span>
                            <div className="text-xs space-y-2 font-light text-accent-muted">
                              <p><strong className="text-white">Genre:</strong> {selectedSubmission.genre}</p>
                              <p><strong className="text-white">Language:</strong> {selectedSubmission.lang || 'N/A'}</p>
                              <p><strong className="text-white">Runtime:</strong> {selectedSubmission.runtime}</p>
                              <p><strong className="text-white">Logline:</strong></p>
                              <p className="italic bg-black/20 p-2.5 rounded-sm text-[11px] leading-relaxed border border-white/5">{selectedSubmission.logline}</p>
                            </div>
                          </div>
                        </div>

                        {/* Creative Credits */}
                        <div className="border border-white/5 bg-black/40 p-5 rounded-sm space-y-3">
                          <span className="text-[10px] tracking-widest text-secondary font-semibold uppercase block border-b border-white/5 pb-2">
                            Creative Credits
                          </span>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-light text-accent-muted">
                            <p><strong className="text-white">Director:</strong> {selectedSubmission.director}</p>
                            <p><strong className="text-white">Cinematographer:</strong> {selectedSubmission.cinematographer || 'N/A'}</p>
                            <p><strong className="text-white">Editor:</strong> {selectedSubmission.editor || 'N/A'}</p>
                            <p><strong className="text-white">Music Composer:</strong> {selectedSubmission.music_composer || 'N/A'}</p>
                            <p><strong className="text-white">Sound Engineer:</strong> {selectedSubmission.sound_engineer || 'N/A'}</p>
                            <p><strong className="text-white">Lead Actor:</strong> {selectedSubmission.main_actor || 'N/A'}</p>
                            <p><strong className="text-white">Lead Actress:</strong> {selectedSubmission.main_actress || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Media Links & Payment */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Media Assets */}
                          <div className="border border-white/5 bg-black/40 p-5 rounded-sm space-y-4">
                            <span className="text-[10px] tracking-widest text-secondary font-semibold uppercase block border-b border-white/5 pb-2">
                              Cinematic Media Assets
                            </span>
                            <div className="flex flex-col gap-3">
                              {presignedLoading ? (
                                <div className="px-4 py-2.5 border border-white/5 text-secondary text-xs rounded-sm text-center flex items-center justify-center gap-2">
                                  <div className="h-3.5 w-3.5 rounded-full border-2 border-secondary/20 border-t-secondary animate-spin"></div>
                                  Generating secure watch link...
                                </div>
                              ) : moviePresignedUrl ? (
                                <a
                                  href={moviePresignedUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2.5 bg-secondary hover:bg-white text-black font-semibold text-xs tracking-widest uppercase transition-all duration-300 rounded-sm text-center flex items-center justify-center gap-2 cursor-pointer"
                                >
                                  <i className="fa-solid fa-play"></i> Watch Movie File
                                </a>
                              ) : (
                                <div className="px-4 py-2.5 border border-white/5 text-red-400 text-xs rounded-sm text-center">
                                  Failed to sign media link
                                </div>
                              )}

                              {selectedSubmission.poster_url ? (
                                presignedLoading ? (
                                  <div className="px-4 py-2.5 border border-white/5 text-accent-muted text-xs rounded-sm text-center">
                                    Generating poster link...
                                  </div>
                                ) : posterPresignedUrl ? (
                                  <a
                                    href={posterPresignedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2.5 bg-transparent border border-white/20 text-white font-semibold text-xs tracking-widest uppercase hover:border-secondary hover:text-secondary transition-all duration-300 rounded-sm text-center flex items-center justify-center gap-2 cursor-pointer"
                                  >
                                    <i className="fa-solid fa-image"></i> View Poster Image
                                  </a>
                                ) : (
                                  <div className="px-4 py-2.5 border border-white/5 text-red-400 text-xs rounded-sm text-center">
                                    Failed to sign poster link
                                  </div>
                                )
                              ) : (
                                <div className="px-4 py-2.5 border border-white/5 text-white/30 text-xs rounded-sm text-center">
                                  No Poster Uploaded
                                </div>
                              )}

                              {selectedSubmission.is_cs && (
                                selectedSubmission.id_url ? (
                                  presignedLoading ? (
                                    <div className="px-4 py-2.5 border border-white/5 text-accent-muted text-xs rounded-sm text-center">
                                      Generating College ID link...
                                    </div>
                                  ) : idPresignedUrl ? (
                                    <a
                                      href={idPresignedUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-4 py-2.5 bg-transparent border border-white/20 text-white font-semibold text-xs tracking-widest uppercase hover:border-secondary hover:text-secondary transition-all duration-300 rounded-sm text-center flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                      <i className="fa-solid fa-address-card"></i> View College ID
                                    </a>
                                  ) : (
                                    <div className="px-4 py-2.5 border border-white/5 text-red-400 text-xs rounded-sm text-center">
                                      Failed to sign College ID link
                                    </div>
                                  )
                                ) : (
                                  <div className="px-4 py-2.5 border border-white/5 text-red-400 text-xs rounded-sm text-center">
                                    No ID URL Found
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Payment Records */}
                          <div className="border border-white/5 bg-black/40 p-5 rounded-sm space-y-3">
                            <span className="text-[10px] tracking-widest text-secondary font-semibold uppercase block border-b border-white/5 pb-2">
                              Payment Transaction
                            </span>
                            <div className="text-xs space-y-2 font-light text-accent-muted">
                              <p><strong className="text-white">Razorpay ID:</strong> <span className="font-mono text-secondary">{selectedSubmission.payment_id}</span></p>
                              <p><strong className="text-white">Amount Paid:</strong> ₹{Number(selectedSubmission.amount_paid).toFixed(2)}</p>
                              <p><strong className="text-white">Status:</strong> <span className="text-emerald-400 font-semibold">{selectedSubmission.payment_status.toUpperCase()}</span></p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reader actions */}
                      <div className="p-4 border-t border-white/5 bg-black/25 flex justify-end gap-3">
                        <button
                          disabled={updatingId === selectedSubmission.id}
                          onClick={() => handleDeleteSubmission(selectedSubmission.id)}
                          className="px-4 py-2 border border-red-500/20 text-red-400 hover:bg-red-950/30 rounded-sm text-xs tracking-widest uppercase font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50"
                        >
                          Delete Entry
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-accent-muted p-10">
                      <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center mb-4 text-white/30">
                        <i className="fa-solid fa-video text-lg"></i>
                      </div>
                      <p className="text-sm font-light">Select a submission from the list to view its information.</p>
                    </div>
                  )}
                </div>

                {/* Mobile View: Accordion submission cards */}
                <div className="block md:hidden space-y-4 w-full">
                  {submissions.map((sub) => {
                    const isExpanded = sub.id === expandedMobileSubmissionId;
                    return (
                      <div
                        key={sub.id}
                        className={`border rounded-sm bg-primary-light transition-all duration-300 ${isExpanded ? 'border-secondary/30' : 'border-white/5'
                          }`}
                      >
                        {/* Summary Header */}
                        <div
                          onClick={() => {
                            setSelectedSubmissionId(sub.id);
                            setExpandedMobileSubmissionId(isExpanded ? null : sub.id);
                          }}
                          className="p-4 flex items-center justify-between cursor-pointer"
                        >
                          <div className="space-y-1 text-left">
                            <h4 className="text-xs font-semibold text-white truncate max-w-[200px]">{sub.film_title}</h4>
                            <p className="text-[10px] text-accent-muted">Dir: {sub.director} | {sub.genre}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] tracking-widest font-bold uppercase text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-1 py-0.5 rounded-sm">
                              Paid
                            </span>
                            <i className={`fa-solid fa-chevron-down text-accent-muted text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180 text-secondary' : ''}`}></i>
                          </div>
                        </div>

                        {/* Collapsible Details */}
                        {isExpanded && (
                          <div className="p-4 border-t border-white/5 bg-black/20 space-y-4 text-left">
                            <div className="text-[11px] space-y-2 text-accent-muted">
                              <p><strong className="text-white">Submitter:</strong> {sub.name}</p>
                              <p><strong className="text-white">Email:</strong> {sub.email}</p>
                              <p><strong className="text-white">Phone:</strong> {sub.phone}</p>
                              <p><strong className="text-white">City:</strong> {sub.city}</p>
                              <p><strong className="text-white">College Student:</strong> {sub.is_cs ? 'Yes' : 'No'}</p>
                              <p><strong className="text-white">Runtime:</strong> {sub.runtime} | <strong className="text-white">Language:</strong> {sub.lang || 'N/A'}</p>
                              <p><strong className="text-white">Logline:</strong> {sub.logline}</p>
                              <p className="border-t border-white/5 pt-2"><strong className="text-white">Creative Credits:</strong></p>
                              <p className="pl-2">Director: {sub.director}</p>
                              <p className="pl-2">Cinematographer: {sub.cinematographer || 'N/A'}</p>
                              <p className="pl-2">Editor: {sub.editor || 'N/A'}</p>
                              <p className="pl-2">Composer: {sub.music_composer || 'N/A'}</p>
                              <p className="pl-2">Sound Engineer: {sub.sound_engineer || 'N/A'}</p>
                              <p className="pl-2">Lead Cast: {sub.main_actor || 'N/A'} & {sub.main_actress || 'N/A'}</p>
                              <p className="border-t border-white/5 pt-2"><strong className="text-white">Razorpay Payment ID:</strong> {sub.payment_id}</p>
                            </div>

                            <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                              {presignedLoading ? (
                                <div className="w-full py-2 border border-white/5 text-secondary text-[10px] rounded-sm text-center flex items-center justify-center gap-2">
                                  <div className="h-3 w-3 rounded-full border border-secondary/20 border-t-secondary animate-spin"></div>
                                  Generating secure watch link...
                                </div>
                              ) : moviePresignedUrl ? (
                                <a
                                  href={moviePresignedUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-2 bg-secondary text-black font-semibold text-[10px] tracking-widest uppercase hover:bg-white transition-all rounded-sm text-center flex items-center justify-center gap-2 cursor-pointer"
                                >
                                  <i className="fa-solid fa-play"></i> Watch Movie
                                </a>
                              ) : (
                                <div className="w-full py-2 border border-white/5 text-red-400 text-[10px] rounded-sm text-center">
                                  Failed to sign media link
                                </div>
                              )}

                              {sub.poster_url && (
                                presignedLoading ? (
                                  <div className="w-full py-2 border border-white/5 text-accent-muted text-[10px] rounded-sm text-center">
                                    Generating poster link...
                                  </div>
                                ) : posterPresignedUrl ? (
                                  <a
                                    href={posterPresignedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2 border border-white/20 text-white font-semibold text-[10px] tracking-widest uppercase hover:border-secondary transition-all rounded-sm text-center flex items-center justify-center gap-2 cursor-pointer"
                                  >
                                    <i className="fa-solid fa-image"></i> View Poster
                                  </a>
                                ) : (
                                  <div className="w-full py-2 border border-white/5 text-red-400 text-[10px] rounded-sm text-center">
                                    Failed to sign poster link
                                  </div>
                                )
                              )}

                              {sub.is_cs && (
                                sub.id_url ? (
                                  presignedLoading ? (
                                    <div className="w-full py-2 border border-white/5 text-accent-muted text-[10px] rounded-sm text-center">
                                      Generating ID link...
                                    </div>
                                  ) : idPresignedUrl ? (
                                    <a
                                      href={idPresignedUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full py-2 border border-white/20 text-white font-semibold text-[10px] tracking-widest uppercase hover:border-secondary transition-all rounded-sm text-center flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                      <i className="fa-solid fa-address-card"></i> View College ID
                                    </a>
                                  ) : (
                                    <div className="w-full py-2 border border-white/5 text-red-400 text-[10px] rounded-sm text-center">
                                      Failed to sign ID link
                                    </div>
                                  )
                                ) : (
                                  <div className="w-full py-2 border border-white/5 text-red-400 text-[10px] rounded-sm text-center">
                                    No ID URL Found
                                  </div>
                                )
                              )}

                              <button
                                disabled={updatingId === sub.id}
                                onClick={() => handleDeleteSubmission(sub.id)}
                                className="w-full py-2 border border-red-500/20 text-red-400 hover:bg-red-950/30 rounded-sm text-[10px] tracking-widest uppercase font-semibold transition-all disabled:opacity-50 cursor-pointer"
                              >
                                Delete Entry
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'photo-submissions':
        const selectedPhotoSub = photoSubmissions.find(s => s.id === selectedPhotoSubmissionId);

        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <h1 className="font-serif text-2xl md:text-3xl text-white tracking-wide">Photo Fest Submissions</h1>
                <p className="text-xs text-accent-muted mt-1">Review Art & Light Photo Fest participant entries and photo assets stored on Cloudflare R2.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchPhotoSubmissions}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-sm text-xs font-semibold hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-rotate-right"></i> Refresh
                </button>
              </div>
            </div>

            {photoSubmissionsLoading ? (
              <div className="py-20 text-center text-accent-muted space-y-3">
                <div className="h-6 w-6 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs">Loading photo submissions...</p>
              </div>
            ) : photoSubmissionsError ? (
              <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-sm">
                {photoSubmissionsError}
              </div>
            ) : photoSubmissions.length === 0 ? (
              <div className="py-20 text-center text-accent-muted border border-white/5 rounded-sm bg-black/20">
                <i className="fa-solid fa-camera text-3xl mb-3 text-white/20 block"></i>
                <p className="text-sm font-serif text-white">No Photo Submissions Received Yet</p>
                <p className="text-xs text-accent-muted mt-1">Entries submitted via Art & Light Photo Fest form will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Desktop Split View */}
                <div className="hidden md:flex gap-6 min-h-[600px] h-[calc(100vh-220px)]">
                  {/* Left Column: Submissions List */}
                  <div className="w-1/3 border border-white/5 rounded-sm bg-primary-light flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-black/40 flex justify-between items-center">
                      <span className="text-xs font-mono text-secondary uppercase font-semibold">
                        Entries ({photoSubmissions.length})
                      </span>
                    </div>

                    <div className="flex-grow overflow-y-auto divide-y divide-white/5">
                      {photoSubmissions.map((sub) => {
                        const isSelected = sub.id === selectedPhotoSubmissionId;
                        return (
                          <div
                            key={sub.id}
                            onClick={() => setSelectedPhotoSubmissionId(sub.id)}
                            className={`p-4 cursor-pointer transition-all duration-200 text-left ${
                              isSelected ? 'bg-secondary/10 border-l-2 border-secondary' : 'hover:bg-white/[0.02]'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="text-xs font-semibold text-white truncate max-w-[180px]">{sub.full_name}</h4>
                              <span className="text-[9px] text-accent-muted font-mono">
                                {new Date(sub.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-[11px] text-accent-muted truncate">{sub.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {sub.is_student && (
                                <span className="text-[8px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 border border-secondary/20 px-1.5 py-0.5 rounded-sm">
                                  Student
                                </span>
                              )}
                              <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-1.5 py-0.5 rounded-sm">
                                {sub.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Selected Submission Detail */}
                  <div className="w-2/3 border border-white/5 rounded-sm bg-primary-light flex flex-col overflow-hidden">
                    {selectedPhotoSub ? (
                      <div className="flex-grow overflow-y-auto p-6 space-y-6 text-left">
                        {/* Summary Card */}
                        <div className="border border-white/5 bg-black/30 p-6 rounded-sm space-y-4">
                          <div className="flex justify-between items-start border-b border-white/5 pb-4">
                            <div>
                              <h3 className="font-serif text-xl text-white">{selectedPhotoSub.full_name}</h3>
                              <p className="text-xs text-accent-muted mt-0.5">{selectedPhotoSub.city} • {selectedPhotoSub.phone}</p>
                            </div>
                            <span className="text-xs text-accent-muted font-mono">
                              Submitted: {new Date(selectedPhotoSub.created_at).toLocaleString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-accent-muted block mb-0.5">Email Address</span>
                              <span className="text-white font-medium">{selectedPhotoSub.email}</span>
                            </div>
                            <div>
                              <span className="text-accent-muted block mb-0.5">Category</span>
                              <span className="text-white font-medium">{selectedPhotoSub.is_student ? 'Student Category' : 'General / Professional'}</span>
                            </div>
                            <div>
                              <span className="text-accent-muted block mb-0.5">Original File</span>
                              <span className="text-white font-mono">{selectedPhotoSub.photo_filename}</span>
                            </div>
                            <div>
                              <span className="text-accent-muted block mb-0.5">Storage Key (R2)</span>
                              <span className="text-secondary font-mono text-[11px] truncate block">{selectedPhotoSub.photo_url || 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Photo Preview & Media Link */}
                        <div className="border border-white/5 bg-black/30 p-6 rounded-sm space-y-4">
                          <span className="text-[10px] tracking-widest text-secondary font-semibold uppercase block border-b border-white/5 pb-2">
                            Submitted Photograph (Cloudflare R2)
                          </span>

                          {presignedLoading ? (
                            <div className="py-12 text-center text-accent-muted space-y-2">
                              <div className="h-5 w-5 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
                              <p className="text-xs">Generating secure Cloudflare R2 preview link...</p>
                            </div>
                          ) : photoPresignedUrl ? (
                            <div className="space-y-4">
                              <div className="border border-white/10 rounded-sm overflow-hidden bg-black flex items-center justify-center max-h-[400px]">
                                <img
                                  src={photoPresignedUrl}
                                  alt={selectedPhotoSub.photo_filename}
                                  className="max-h-[400px] w-auto object-contain"
                                />
                              </div>
                              <div className="flex gap-3 justify-end">
                                <a
                                  href={photoPresignedUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-secondary text-black font-semibold text-xs rounded-sm hover:bg-white transition-colors inline-flex items-center gap-2 cursor-pointer"
                                >
                                  <i className="fa-solid fa-expand"></i> View Full Resolution
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="py-8 text-center text-red-400 text-xs border border-red-500/20 rounded-sm bg-red-950/20">
                              Photo asset URL not available or failed to generate secure signed link.
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end pt-4 border-t border-white/5">
                          <button
                            disabled={updatingId === selectedPhotoSub.id}
                            onClick={() => handleDeletePhotoSubmission(selectedPhotoSub.id)}
                            className="px-4 py-2 border border-red-500/20 text-red-400 hover:bg-red-950/30 rounded-sm text-xs tracking-widest uppercase font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50"
                          >
                            Delete Submission
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center text-accent-muted p-10">
                        <i className="fa-solid fa-camera text-2xl text-white/30 mb-3"></i>
                        <p className="text-sm font-light">Select a photo submission from the left list to view details.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile View */}
                <div className="block md:hidden space-y-4 w-full">
                  {photoSubmissions.map((sub) => {
                    const isExpanded = sub.id === expandedMobilePhotoSubmissionId;
                    return (
                      <div
                        key={sub.id}
                        className={`border rounded-sm bg-primary-light transition-all duration-300 ${
                          isExpanded ? 'border-secondary/30' : 'border-white/5'
                        }`}
                      >
                        <div
                          onClick={() => {
                            setSelectedPhotoSubmissionId(sub.id);
                            setExpandedMobilePhotoSubmissionId(isExpanded ? null : sub.id);
                          }}
                          className="p-4 flex items-center justify-between cursor-pointer"
                        >
                          <div className="space-y-1 text-left">
                            <h4 className="text-xs font-semibold text-white truncate max-w-[200px]">{sub.full_name}</h4>
                            <p className="text-[10px] text-accent-muted">{sub.city} | {sub.is_student ? 'Student' : 'General'}</p>
                          </div>
                          <i className={`fa-solid fa-chevron-down text-accent-muted text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180 text-secondary' : ''}`}></i>
                        </div>

                        {isExpanded && (
                          <div className="p-4 border-t border-white/5 bg-black/20 space-y-4 text-left">
                            <div className="text-[11px] space-y-2 text-accent-muted">
                              <p><strong className="text-white">Email:</strong> {sub.email}</p>
                              <p><strong className="text-white">Phone:</strong> {sub.phone}</p>
                              <p><strong className="text-white">City:</strong> {sub.city}</p>
                              <p><strong className="text-white">Student:</strong> {sub.is_student ? 'Yes' : 'No'}</p>
                              <p><strong className="text-white">Photo File:</strong> {sub.photo_filename}</p>
                            </div>

                            {photoPresignedUrl && (
                              <div className="space-y-2">
                                <img src={photoPresignedUrl} alt={sub.photo_filename} className="w-full h-auto rounded-sm border border-white/10" />
                                <a
                                  href={photoPresignedUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-2 bg-secondary text-black font-semibold text-[10px] tracking-widest uppercase hover:bg-white transition-all rounded-sm text-center flex items-center justify-center gap-2 cursor-pointer"
                                >
                                  <i className="fa-solid fa-expand"></i> View Full Resolution
                                </a>
                              </div>
                            )}

                            <button
                              disabled={updatingId === sub.id}
                              onClick={() => handleDeletePhotoSubmission(sub.id)}
                              className="w-full py-2 border border-red-500/20 text-red-400 hover:bg-red-950/30 rounded-sm text-[10px] tracking-widest uppercase font-semibold transition-all disabled:opacity-50 cursor-pointer"
                            >
                              Delete Submission
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'cfo':
        const sfsRegistrationIncome = submissions
          .filter(sub => sub.payment_status === 'completed' || sub.payment_status === 'paid' || sub.payment_status === 'captured')
          .reduce((sum, sub) => sum + Number(sub.amount_paid || 0) * 0.9764, 0);

        const grossRevenue = cfoTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0) + sfsRegistrationIncome;

        const operatingCosts = cfoTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const netIncome = grossRevenue - operatingCosts;
        const netMargin = grossRevenue > 0 ? (netIncome / grossRevenue) * 100 : 0;

        // Group by month name (Jan - Dec) using transaction_date split to avoid timezone shifting
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyStats = monthNames.map(name => ({ name, income: 0, expense: 0 }));

        const currentYear = new Date().getFullYear();

        cfoTransactions.forEach(t => {
          if (t.transaction_date) {
            const parts = t.transaction_date.split('-');
            if (parts.length >= 2) {
              const year = parseInt(parts[0], 10);
              const monthIdx = parseInt(parts[1], 10) - 1;
              // Group only transactions for the current year
              if (year === currentYear && monthIdx >= 0 && monthIdx < 12) {
                if (t.type === 'income') {
                  monthlyStats[monthIdx].income += Number(t.amount);
                } else {
                  monthlyStats[monthIdx].expense += Number(t.amount);
                }
              }
            }
          }
        });

        // Add SFS registration income to monthlyStats (deducting 2% fee + 18% GST on the fee)
        submissions.forEach(sub => {
          if ((sub.payment_status === 'completed' || sub.payment_status === 'paid' || sub.payment_status === 'captured') && sub.created_at) {
            const dateObj = new Date(sub.created_at);
            const year = dateObj.getFullYear();
            const monthIdx = dateObj.getMonth();
            if (year === currentYear && monthIdx >= 0 && monthIdx < 12) {
              monthlyStats[monthIdx].income += Number(sub.amount_paid || 0) * 0.9764;
            }
          }
        });

        // Filter to only show months with activity to keep the chart clean, or fallback to first 6 if empty
        const activeMonthlyData = monthlyStats.filter(m => m.income > 0 || m.expense > 0);
        const displayData = activeMonthlyData.length > 0 ? activeMonthlyData : monthlyStats.slice(0, 6);

        // Find max value to auto-scale bars
        const maxVal = Math.max(...displayData.map(d => Math.max(d.income, d.expense)), 1);

        return (
          <div className="space-y-8 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase">Finance & Ledger</span>
                <h1 className="font-serif text-3xl text-white tracking-wide mt-1">CFO Console</h1>
              </div>
              <div className="flex gap-3 self-start sm:self-auto">
                <button
                  onClick={() => setIsCfoModalOpen(true)}
                  className="px-4 py-2 bg-secondary text-black hover:bg-secondary/90 hover:shadow-[0_0_10px_rgba(197,160,89,0.2)] text-xs tracking-widest uppercase font-bold transition-all duration-300 rounded-sm text-center flex items-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-plus"></i> New
                </button>
                <button
                  onClick={fetchCfoTransactions}
                  disabled={cfoLoading}
                  className="px-4 py-2 bg-primary-light border border-white/10 hover:border-secondary text-xs tracking-widest uppercase transition-all duration-300 rounded-sm text-center flex items-center gap-2 cursor-pointer disabled:opacity-55"
                >
                  <i className="fa-solid fa-arrows-rotate"></i> Refresh
                </button>
              </div>
            </div>

            {cfoLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="h-8 w-8 rounded-full border-2 border-secondary/20 border-t-secondary animate-spin" />
                <span className="text-xs text-accent-muted tracking-widest uppercase font-light">Retrieving Ledger Records...</span>
              </div>
            ) : cfoError ? (
              <div className="py-12 text-center max-w-md mx-auto space-y-4">
                <div className="h-12 w-12 rounded-full border border-red-500/20 bg-red-950/20 flex items-center justify-center mx-auto text-red-500">
                  <i className="fa-solid fa-circle-exclamation text-lg"></i>
                </div>
                <p className="text-red-400 text-sm font-light">{cfoError}</p>
                <button
                  onClick={fetchCfoTransactions}
                  className="px-4 py-2 border border-red-500/20 text-red-400 hover:bg-red-950/20 text-xs tracking-widest uppercase transition-all duration-300 rounded-sm"
                >
                  Retry Request
                </button>
              </div>
            ) : (
              <>
                {/* Financial Overview Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                  <div className="border border-white/5 bg-primary-light p-6 rounded-sm flex items-center justify-between border-gold-glow">
                    <div>
                      <span className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold">Gross Revenue</span>
                      <h2 className="text-2xl font-serif text-white mt-1">
                        ₹{grossRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h2>
                      <span className="text-[9px] text-accent-muted font-light block mt-1">
                        Total inflows registered
                      </span>
                    </div>
                    <div className="h-10 w-10 bg-secondary/5 rounded-full border border-secondary/20 flex items-center justify-center">
                      <i className="fa-solid fa-chart-line text-secondary text-sm"></i>
                    </div>
                  </div>

                  <div className="border border-white/5 bg-primary-light p-6 rounded-sm flex items-center justify-between border-gold-glow">
                    <div>
                      <span className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold">Operating Costs</span>
                      <h2 className="text-2xl font-serif text-white mt-1">
                        ₹{operatingCosts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h2>
                      <span className="text-[9px] text-accent-muted font-light block mt-1">
                        Total outflows registered
                      </span>
                    </div>
                    <div className="h-10 w-10 bg-secondary/5 rounded-full border border-secondary/20 flex items-center justify-center">
                      <i className="fa-solid fa-wallet text-secondary text-sm"></i>
                    </div>
                  </div>

                  <div className="border border-white/5 bg-primary-light p-6 rounded-sm flex items-center justify-between border-gold-glow">
                    <div>
                      <span className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold">Net Profit Margin</span>
                      <h2 className="text-2xl font-serif text-secondary mt-1">
                        {netMargin.toFixed(2)}%
                      </h2>
                      <span className="text-[9px] text-accent-muted font-light block mt-1">
                        Target threshold: 65.00%
                      </span>
                    </div>
                    <div className="h-10 w-10 bg-secondary/5 rounded-full border border-secondary/20 flex items-center justify-center">
                      <i className="fa-solid fa-percent text-secondary text-sm"></i>
                    </div>
                  </div>

                  <div className="border border-white/5 bg-primary-light p-6 rounded-sm flex items-center justify-between border-gold-glow">
                    <div>
                      <span className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold">Net Income / Profit</span>
                      <h2 className={`text-2xl font-serif mt-1 ${netIncome >= 0 ? 'text-white' : 'text-red-400'}`}>
                        {netIncome < 0 ? '-' : ''}₹{Math.abs(netIncome).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h2>
                      <span className="text-[9px] text-accent-muted font-light block mt-1">
                        Inflows minus outflows
                      </span>
                    </div>
                    <div className="h-10 w-10 bg-secondary/5 rounded-full border border-secondary/20 flex items-center justify-center">
                      <i className="fa-solid fa-file-invoice-dollar text-secondary text-sm"></i>
                    </div>
                  </div>

                </div>

                {/* Bottom Split Layout: Chart Mockup and Ledger Logs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                  {/* Chart Mockup (2 Cols) */}
                  <div className="lg:col-span-2 border border-white/5 bg-primary-light p-6 rounded-sm border-gold-glow flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-secondary font-bold">Analytics</span>
                        <h3 className="font-serif text-lg text-white">Projected Earnings vs. Expenses</h3>
                      </div>
                      <span className="text-[10px] text-accent-muted border border-white/5 bg-black/40 px-3 py-1 rounded-sm">
                        FY 2026/27
                      </span>
                    </div>

                    {/* Chart Container with Axis and Guide Lines */}
                    <div className="flex flex-col gap-2 h-64 mt-4 w-full">
                      <div className="flex gap-4 items-stretch flex-grow min-h-0">
                        {/* Y-Axis Labels */}
                        <div className="flex flex-col justify-between text-[9px] text-accent-muted/80 text-right pr-3 select-none font-sans w-14 pb-1">
                          <span>₹{maxVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          <span>₹{(maxVal * 0.75).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          <span>₹{(maxVal * 0.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          <span>₹{(maxVal * 0.25).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          <span>₹0</span>
                        </div>

                        {/* Bar chart area (Border-b is X-axis baseline) */}
                        <div className="flex-grow flex items-end justify-between gap-2.5 relative border-b border-white/10 pb-1">
                          {/* Guide Lines */}
                          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-1">
                            <div className="border-b border-white/[0.03] w-full"></div>
                            <div className="border-b border-white/[0.03] w-full"></div>
                            <div className="border-b border-white/[0.03] w-full"></div>
                            <div className="border-b border-white/[0.03] w-full"></div>
                            <div className="w-full"></div> {/* Baseline covered by parent border-b */}
                          </div>

                          {displayData.map((d) => {
                            const incHeight = (d.income / maxVal) * 100;
                            const expHeight = (d.expense / maxVal) * 100;
                            return (
                              <div key={d.name} className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer z-10 relative">
                                <div className="w-full flex justify-center gap-1 h-full items-end">
                                  <div
                                    className="w-2.5 bg-secondary/60 group-hover:bg-secondary transition-all rounded-t-sm"
                                    style={{ height: `${incHeight}%` }}
                                    title={`Earnings: ₹${d.income.toLocaleString()}`}
                                  ></div>
                                  <div
                                    className="w-2.5 bg-white/10 group-hover:bg-white/20 transition-all rounded-t-sm"
                                    style={{ height: `${expHeight}%` }}
                                    title={`Expenses: ₹${d.expense.toLocaleString()}`}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* X-Axis Month Labels Row */}
                      <div className="flex gap-4">
                        {/* Spacer to align with Y-axis */}
                        <div className="w-14 select-none pr-3"></div>

                        {/* Month names matching columns */}
                        <div className="flex-grow flex justify-between gap-2.5 text-center">
                          {displayData.map((d) => (
                            <span key={d.name} className="flex-1 text-[10px] text-accent-muted group-hover:text-white transition-colors">
                              {d.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-end mt-4 text-[10px] text-accent-muted font-light font-sans">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-secondary"></div>
                        <span>Projected Revenue</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-white/35"></div>
                        <span>Operational Cost</span>
                      </div>
                    </div>
                  </div>

                  {/* Transactions Ledger (1 Col) */}
                  <div className="border border-white/5 bg-primary-light p-6 rounded-sm border-gold-glow flex flex-col">
                    <div className="mb-6 font-sans">
                      <span className="text-[9px] uppercase tracking-widest text-secondary font-bold">Ledger</span>
                      <h3 className="font-serif text-lg text-white">Recent Transactions</h3>
                    </div>

                    {(() => {
                      interface LedgerItem {
                        id: string;
                        title: string;
                        date: string;
                        amount: number;
                        type: 'income' | 'expense';
                        source: 'ledger' | 'sfs';
                      }

                      const ledgerItems: LedgerItem[] = [
                        ...cfoTransactions.map(t => ({
                          id: t.id,
                          title: t.title,
                          date: t.transaction_date,
                          amount: Number(t.amount),
                          type: t.type as 'income' | 'expense',
                          source: 'ledger' as const
                        })),
                        ...submissions
                          .filter(sub => (sub.payment_status === 'completed' || sub.payment_status === 'paid' || sub.payment_status === 'captured') && sub.created_at)
                          .map(sub => ({
                            id: sub.id,
                            title: `SFS Reg: ${sub.film_title}`,
                            date: sub.created_at.split('T')[0],
                            amount: Number(sub.amount_paid || 0) * 0.9764,
                            type: 'income' as const,
                            source: 'sfs' as const
                          }))
                      ].sort((a, b) => b.date.localeCompare(a.date));

                      return (
                        <div className="flex-1 divide-y divide-white/5 space-y-4 overflow-y-auto max-h-[290px] pr-1">
                          {ledgerItems.length === 0 ? (
                            <div className="py-20 text-center text-accent-muted">
                              <p className="text-xs font-light">No ledger records found.</p>
                            </div>
                          ) : (
                            ledgerItems.map((t) => (
                              <div key={t.id} className="flex items-center justify-between pt-3">
                                <div className="text-left overflow-hidden mr-2">
                                  <h4 className="text-xs font-semibold text-white truncate max-w-[155px]" title={t.title}>
                                    {t.title}
                                  </h4>
                                  <span className="text-[9px] text-accent-muted block">
                                    {new Date(t.date).toLocaleDateString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <span className={`text-xs font-serif font-bold ${t.type === 'income' ? 'text-secondary' : 'text-white'
                                    }`}>
                                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                  <span className={`text-[8px] border rounded-sm px-1.5 py-0.5 block mt-0.5 uppercase tracking-widest font-bold text-center ${t.type === 'income'
                                    ? (t.source === 'sfs'
                                      ? 'bg-secondary/10 text-secondary border-secondary/20'
                                      : 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20')
                                    : 'bg-amber-950/20 text-amber-400 border-amber-500/20'
                                    }`}>
                                    {t.source === 'sfs' ? 'Registration' : t.type}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      );
                    })()}
                  </div>

                </div>
              </>
            )}
          </div>
        );
      case 'letterhead':
        return <LetterheadScreen adminData={adminData} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col md:flex-row font-sans print:bg-white print:text-black print:block print:h-auto">

      {/* Mobile Top Header bar */}
      <header className="md:hidden h-16 border-b border-white/5 bg-[#0A0A0A] flex items-center justify-between px-6 sticky top-0 z-30 flex-shrink-0 print:hidden">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Viora Logo"
            className="h-8 w-8 object-contain rounded-md border border-secondary/20"
          />
          <div className="flex flex-col text-left">
            <span className="font-serif tracking-[0.2em] text-sm font-semibold text-white">
              VIORA
            </span>
            <span className="text-[8px] tracking-[0.3em] text-secondary font-medium -mt-1 uppercase">
              Console
            </span>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(true)}
          className="h-10 w-10 border border-white/5 hover:border-secondary/50 rounded-sm flex items-center justify-center text-white transition-all cursor-pointer"
          aria-label="Open navigation menu"
        >
          <i className="fa-solid fa-bars text-lg"></i>
        </button>
      </header>

      {/* Left Sidebar */}
      <div className="print:hidden">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userEmail={session.user?.email || 'admin@vioramedia.in'}
          onLogout={() => supabase.auth.signOut()}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />
      </div>

      {/* Right Content Area */}
      <main className={`flex-grow h-[calc(100vh-4rem)] md:h-screen overflow-y-auto p-4 sm:p-6 md:p-10 print:h-auto print:p-0 print:block print:static ${activeTab === 'letterhead' ? 'md:p-0 sm:p-0 p-0 overflow-y-hidden print:overflow-visible' : ''
        }`}>
        {renderActiveView()}
      </main>

      {/* CFO Transaction Entry Modal */}
      {isCfoModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div
            className="fixed inset-0"
            onClick={() => setIsCfoModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-[#0A0A0A] border border-white/10 p-6 md:p-8 rounded-sm border-gold-glow flex flex-col shadow-[0_0_50px_rgba(197,160,89,0.08)]">
            <button
              onClick={() => setIsCfoModalOpen(false)}
              className="absolute top-4 right-4 text-accent-muted hover:text-white p-1 cursor-pointer transition-colors"
              aria-label="Close dialog"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <span className="text-[9px] tracking-[0.25em] text-secondary font-semibold uppercase mb-1">
              Add Record
            </span>
            <h3 className="font-serif text-xl text-white tracking-wide mb-6">
              New Ledger Transaction
            </h3>

            <form onSubmit={handleCreateCfoTransaction} className="space-y-5 text-left">
              <div>
                <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-2">
                  Transaction Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Supabase Premium Hosting"
                  className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0.01"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-2">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-2">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewType('income')}
                    className={`py-3 text-xs uppercase tracking-wider font-semibold border rounded-sm transition-all duration-300 cursor-pointer text-center ${newType === 'income'
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-white/10 text-accent-muted hover:border-white/20'
                      }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('expense')}
                    className={`py-3 text-xs uppercase tracking-wider font-semibold border rounded-sm transition-all duration-300 cursor-pointer text-center ${newType === 'expense'
                      ? 'border-red-500/50 bg-red-950/20 text-red-400'
                      : 'border-white/10 text-accent-muted hover:border-white/20'
                      }`}
                  >
                    Expense
                  </button>
                </div>
              </div>

              {cfoSubmitError && (
                <p className="text-red-500 text-xs font-light bg-red-950/25 border border-red-500/25 p-3 rounded-sm text-center">
                  {cfoSubmitError}
                </p>
              )}

              <div className="flex gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsCfoModalOpen(false)}
                  className="flex-1 py-3 border border-white/10 hover:border-white/20 text-xs tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer text-center font-bold text-accent-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={cfoSubmitting}
                  className="flex-1 py-3 bg-secondary text-black hover:bg-secondary/90 hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] text-xs tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer text-center font-bold disabled:opacity-50"
                >
                  {cfoSubmitting ? 'Submitting...' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
