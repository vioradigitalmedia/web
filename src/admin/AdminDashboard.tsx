import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import LetterheadScreen from '../screens/LetterheadScreen';

// Imported Types & R2 Client
import {
  r2Client,
  ContactMessage,
  isSubmissionMsg,
  CfoTransaction,
  FestivalSubmission,
  PartnerProposal,
  JobApplication,
  AdminDocument,
  PhotoFestSubmission,
} from './types';

// Imported Tabs
import DashboardTab from './tabs/DashboardTab';
import PartnersTab from './tabs/PartnersTab';
import ApplicationsTab from './tabs/ApplicationsTab';
import MessagesTab from './tabs/MessagesTab';
import MediaTab from './tabs/MediaTab';
import SubmissionsTab from './tabs/SubmissionsTab';
import PhotoSubmissionsTab from './tabs/PhotoSubmissionsTab';
import CfoTab from './tabs/CfoTab';

export default function AdminDashboard() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'messages' | 'media' | 'submissions' | 'photo-submissions' | 'cfo' | 'letterhead' | 'partners' | 'applications'>('dashboard');
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

  // Job Applications States
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [jobApplicationsLoading, setJobApplicationsLoading] = useState(true);
  const [jobApplicationsError, setJobApplicationsError] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

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
  const [photoIdPresignedUrl, setPhotoIdPresignedUrl] = useState<string | null>(null);

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
      if (!selected) {
        setPhotoPresignedUrl(null);
        setPhotoIdPresignedUrl(null);
        return;
      }

      setPresignedLoading(true);
      try {
        if (selected.photo_url) {
          if (selected.photo_url.startsWith('http://') || selected.photo_url.startsWith('https://')) {
            setPhotoPresignedUrl(selected.photo_url);
          } else {
            const photoCommand = new GetObjectCommand({
              Bucket: 'viorasf',
              Key: selected.photo_url,
            });
            const url = await getSignedUrl(r2Client, photoCommand, { expiresIn: 3600 });
            setPhotoPresignedUrl(url);
          }
        } else {
          setPhotoPresignedUrl(null);
        }

        if (selected.id_url) {
          if (selected.id_url.startsWith('http://') || selected.id_url.startsWith('https://')) {
            setPhotoIdPresignedUrl(selected.id_url);
          } else {
            const idCommand = new GetObjectCommand({
              Bucket: 'viorasf',
              Key: selected.id_url,
            });
            const idUrl = await getSignedUrl(r2Client, idCommand, { expiresIn: 3600 });
            setPhotoIdPresignedUrl(idUrl);
          }
        } else {
          setPhotoIdPresignedUrl(null);
        }
      } catch (err) {
        console.error('Error generating photo presigned URLs:', err);
        setPhotoPresignedUrl(null);
        setPhotoIdPresignedUrl(null);
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

  const fetchJobApplications = async () => {
    setJobApplicationsLoading(true);
    setJobApplicationsError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setJobApplications(data || []);
      if (data && data.length > 0) {
        setSelectedApplicationId(data[0].id);
      } else {
        setSelectedApplicationId(null);
      }
    } catch (err: any) {
      console.error('Error fetching job applications:', err);
      setJobApplicationsError(err.message || 'Failed to fetch job applications.');
    } finally {
      setJobApplicationsLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const { error: updateError } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (updateError) throw updateError;

      setJobApplications(prev =>
        prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
      );
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    setUpdatingId(id);
    try {
      const { error: deleteError } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      const updated = jobApplications.filter(app => app.id !== id);
      setJobApplications(updated);
      if (selectedApplicationId === id) {
        setSelectedApplicationId(updated.length > 0 ? updated[0].id : null);
      }
    } catch (err: any) {
      alert('Error deleting application: ' + err.message);
    } finally {
      setUpdatingId(null);
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
      fetchJobApplications();
    }
  }, [session]);

  const fetchPhotoSubmissions = async (forceRefresh = false) => {
    // 1. Check in-memory / sessionStorage cache if forceRefresh is false
    if (!forceRefresh) {
      try {
        const cachedData = sessionStorage.getItem('viora_photo_submissions_cache');
        const cachedTime = sessionStorage.getItem('viora_photo_submissions_time');
        if (cachedData && cachedTime) {
          const age = Date.now() - parseInt(cachedTime, 10);
          if (age < 5 * 60 * 1000) { // 5 minutes TTL
            const parsed = JSON.parse(cachedData);
            setPhotoSubmissions(parsed);
            if (parsed.length > 0 && !selectedPhotoSubmissionId) {
              setSelectedPhotoSubmissionId(parsed[0].id);
            }
            setPhotoSubmissionsLoading(false);
            return;
          }
        }
      } catch (cacheErr) {
        console.warn('Frontend cache read notice:', cacheErr);
      }
    }

    setPhotoSubmissionsLoading(true);
    setPhotoSubmissionsError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('photo_fest_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      const result = data || [];
      setPhotoSubmissions(result);

      // Save to sessionStorage cache
      try {
        sessionStorage.setItem('viora_photo_submissions_cache', JSON.stringify(result));
        sessionStorage.setItem('viora_photo_submissions_time', Date.now().toString());
      } catch (cacheSaveErr) {
        console.warn('Frontend cache save notice:', cacheSaveErr);
      }

      if (result.length > 0) {
        setSelectedPhotoSubmissionId(prev => prev || result[0].id);
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

      const updated = photoSubmissions.filter(item => item.id !== id);
      setPhotoSubmissions(updated);

      // Update cache
      try {
        sessionStorage.setItem('viora_photo_submissions_cache', JSON.stringify(updated));
      } catch (e) {}

      if (selectedPhotoSubmissionId === id) {
        setSelectedPhotoSubmissionId(updated.length > 0 ? updated[0].id : null);
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
  const totalApplications = jobApplications.length;
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
        return (
          <PartnersTab
            partners={partners}
            partnersLoading={partnersLoading}
            partnersError={partnersError}
            selectedPartnerId={selectedPartnerId}
            setSelectedPartnerId={setSelectedPartnerId}
            fetchPartners={fetchPartners}
          />
        );

      case 'applications':
        return (
          <ApplicationsTab
            jobApplications={jobApplications}
            jobApplicationsLoading={jobApplicationsLoading}
            jobApplicationsError={jobApplicationsError}
            selectedApplicationId={selectedApplicationId}
            setSelectedApplicationId={setSelectedApplicationId}
            fetchJobApplications={fetchJobApplications}
            handleUpdateApplicationStatus={handleUpdateApplicationStatus}
            handleDeleteApplication={handleDeleteApplication}
            updatingId={updatingId}
          />
        );

      case 'dashboard':
        return (
          <DashboardTab
            totalInquiries={totalInquiries}
            pendingInquiries={pendingInquiries}
            totalSubmissions={totalSubmissions}
            totalApplications={totalApplications}
            totalRevenue={totalRevenue}
          />
        );

      case 'messages':
        return (
          <MessagesTab
            messages={messages}
            loading={loading}
            error={error}
            selectedMessageId={selectedMessageId}
            setSelectedMessageId={setSelectedMessageId}
            expandedMobileMessageId={expandedMobileMessageId}
            setExpandedMobileMessageId={setExpandedMobileMessageId}
            fetchMessages={fetchMessages}
            handleUpdateStatus={handleUpdateStatus}
            handleDeleteMessage={handleDeleteMessage}
            updatingId={updatingId}
          />
        );

      case 'media':
        return (
          <MediaTab
            submissions={submissions}
            mediaFilter={mediaFilter}
            setMediaFilter={setMediaFilter}
            adminDocs={adminDocs}
            adminDocsLoading={adminDocsLoading}
            selectedSubmissionId={selectedSubmissionId}
            setSelectedSubmissionId={setSelectedSubmissionId}
            selectedDocKey={selectedDocKey}
            setSelectedDocKey={setSelectedDocKey}
            moviePresignedUrl={moviePresignedUrl}
            posterPresignedUrl={posterPresignedUrl}
            idPresignedUrl={idPresignedUrl}
            presignedLoading={presignedLoading}
            showMediaModal={showMediaModal}
            setShowMediaModal={setShowMediaModal}
          />
        );

      case 'submissions':
        return (
          <SubmissionsTab
            submissions={submissions}
            submissionsLoading={submissionsLoading}
            submissionsError={submissionsError}
            selectedSubmissionId={selectedSubmissionId}
            setSelectedSubmissionId={setSelectedSubmissionId}
            expandedMobileSubmissionId={expandedMobileSubmissionId}
            setExpandedMobileSubmissionId={setExpandedMobileSubmissionId}
            fetchSubmissions={fetchSubmissions}
            handleDeleteSubmission={handleDeleteSubmission}
            updatingId={updatingId}
            moviePresignedUrl={moviePresignedUrl}
            posterPresignedUrl={posterPresignedUrl}
            idPresignedUrl={idPresignedUrl}
            presignedLoading={presignedLoading}
          />
        );

      case 'photo-submissions':
        return (
          <PhotoSubmissionsTab
            photoSubmissions={photoSubmissions}
            photoSubmissionsLoading={photoSubmissionsLoading}
            photoSubmissionsError={photoSubmissionsError}
            selectedPhotoSubmissionId={selectedPhotoSubmissionId}
            setSelectedPhotoSubmissionId={setSelectedPhotoSubmissionId}
            expandedMobilePhotoSubmissionId={expandedMobilePhotoSubmissionId}
            setExpandedMobilePhotoSubmissionId={setExpandedMobilePhotoSubmissionId}
            fetchPhotoSubmissions={fetchPhotoSubmissions}
            handleDeletePhotoSubmission={handleDeletePhotoSubmission}
            updatingId={updatingId}
            photoPresignedUrl={photoPresignedUrl}
            photoIdPresignedUrl={photoIdPresignedUrl}
            presignedLoading={presignedLoading}
          />
        );

      case 'cfo':
        return (
          <CfoTab
            cfoTransactions={cfoTransactions}
            cfoLoading={cfoLoading}
            cfoError={cfoError}
            fetchCfoTransactions={fetchCfoTransactions}
            setIsCfoModalOpen={setIsCfoModalOpen}
          />
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
