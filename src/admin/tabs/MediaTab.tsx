import { FestivalSubmission, AdminDocument } from '../types';

interface MediaTabProps {
  submissions: FestivalSubmission[];
  mediaFilter: 'movies' | 'posters' | 'docs';
  setMediaFilter: (filter: 'movies' | 'posters' | 'docs') => void;
  adminDocs: AdminDocument[];
  adminDocsLoading: boolean;
  setSelectedSubmissionId: (id: string | null) => void;
  selectedDocKey: string | null;
  setSelectedDocKey: (key: string | null) => void;
  moviePresignedUrl: string | null;
  posterPresignedUrl: string | null;
  idPresignedUrl: string | null;
  presignedLoading: boolean;
  showMediaModal: boolean;
  setShowMediaModal: (show: boolean) => void;
}

export default function MediaTab({
  submissions,
  mediaFilter,
  setMediaFilter,
  adminDocs,
  adminDocsLoading,
  setSelectedSubmissionId,
  selectedDocKey,
  setSelectedDocKey,
  moviePresignedUrl,
  posterPresignedUrl,
  idPresignedUrl,
  presignedLoading,
  showMediaModal,
  setShowMediaModal,
}: MediaTabProps) {
  // Helpers to format file URLs or display original name
  const extractFilename = (pathStr: string | null) => {
    if (!pathStr) return 'N/A';
    const parts = pathStr.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div className="space-y-6 animate-fade-in text-left flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase">Cloud Assets</span>
          <h1 className="font-serif text-3xl text-white tracking-wide mt-1">Media Library</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-6">
        {(['movies', 'posters', 'docs'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => {
              setMediaFilter(tab);
              setSelectedDocKey(null);
              setSelectedSubmissionId(null);
            }}
            className={`pb-4 text-xs font-semibold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              mediaFilter === tab
                ? 'border-secondary text-secondary'
                : 'border-transparent text-accent-muted hover:text-white'
            }`}
          >
            {tab === 'movies' ? 'Film Video Files' : tab === 'posters' ? 'Poster Images' : 'Admin Documents'}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      {mediaFilter === 'docs' ? (
        adminDocsLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <i className="fa-solid fa-circle-notch fa-spin text-3xl text-secondary"></i>
            <span className="text-xs tracking-widest uppercase text-accent-muted">Fetching Documents...</span>
          </div>
        ) : adminDocs.length === 0 ? (
          <div className="text-center py-20 text-accent-muted">No documents found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminDocs.map(doc => (
              <div
                key={doc.id}
                className="border border-white/5 bg-[#0A0A0A] p-6 rounded-sm flex flex-col justify-between group hover:border-secondary/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-secondary/10 border border-secondary/20 rounded flex items-center justify-center text-secondary">
                      <i className="fa-solid fa-file-pdf text-lg"></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-serif text-white truncate max-w-[200px]">{doc.title}</h4>
                      <span className="text-[10px] text-accent-muted uppercase tracking-wider">{doc.type}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-accent-muted mb-6">
                    <p><span className="text-secondary font-medium">To:</span> {doc.recipient_name}</p>
                    <p><span className="text-secondary font-medium">By:</span> {doc.created_by}</p>
                    <p><span className="text-secondary font-medium">Date:</span> {new Date(doc.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedDocKey(doc.file_url);
                    setShowMediaModal(true);
                  }}
                  className="w-full py-2.5 bg-primary-light border border-white/10 hover:border-secondary/50 text-[10px] tracking-widest uppercase font-semibold transition-all duration-300 cursor-pointer rounded-sm text-center"
                >
                  Open Document
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions
            .filter(sub => (mediaFilter === 'movies' ? sub.movie_url : sub.poster_url))
            .map(sub => {
              const fileKey = mediaFilter === 'movies' ? sub.movie_url : sub.poster_url;
              return (
                <div
                  key={sub.id}
                  className="border border-white/5 bg-[#0A0A0A] p-6 rounded-sm flex flex-col justify-between group hover:border-secondary/40 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-secondary/10 border border-secondary/20 rounded flex items-center justify-center text-secondary">
                        <i className={`fa-solid ${mediaFilter === 'movies' ? 'fa-video' : 'fa-image'} text-lg`}></i>
                      </div>
                      <div className="truncate flex-1 text-left">
                        <h4 className="text-sm font-serif text-white truncate">{sub.film_title}</h4>
                        <span className="text-[10px] text-accent-muted font-light truncate block">
                          {extractFilename(fileKey)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-accent-muted mb-6 text-left">
                      <p><span className="text-secondary font-medium">Director:</span> {sub.director}</p>
                      <p><span className="text-secondary font-medium">Genre:</span> {sub.genre}</p>
                      <p><span className="text-secondary font-medium">Submittor:</span> {sub.name}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedSubmissionId(sub.id);
                      setShowMediaModal(true);
                    }}
                    className="w-full py-2.5 bg-primary-light border border-white/10 hover:border-secondary/50 text-[10px] tracking-widest uppercase font-semibold transition-all duration-300 cursor-pointer rounded-sm text-center"
                  >
                    Preview Asset
                  </button>
                </div>
              );
            })}
        </div>
      )}

      {/* Asset Viewer Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setShowMediaModal(false)} />
          <div className="relative z-10 w-full max-w-5xl bg-[#020202] border border-white/10 rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0A0A0A]">
              <h3 className="font-serif text-lg text-white">
                {selectedDocKey
                  ? `Document Preview`
                  : mediaFilter === 'movies'
                  ? 'Video Player'
                  : 'Image Viewer'}
              </h3>
              <button
                onClick={() => setShowMediaModal(false)}
                className="text-accent-muted hover:text-white cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="flex-1 bg-black flex items-center justify-center p-4 min-h-[300px] overflow-hidden">
              {presignedLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <i className="fa-solid fa-circle-notch fa-spin text-2xl text-secondary"></i>
                  <span className="text-xs text-accent-muted">Authorizing Access...</span>
                </div>
              ) : selectedDocKey ? (
                idPresignedUrl ? (
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(idPresignedUrl)}&embedded=true`}
                    className="w-full h-[60dvh] border-0"
                    title="Doc Preview"
                  />
                ) : (
                  <p className="text-xs text-red-400">Failed to load document URL.</p>
                )
              ) : mediaFilter === 'movies' ? (
                moviePresignedUrl ? (
                  <video controls className="max-w-full max-h-[60vh] rounded" playsInline>
                    <source src={moviePresignedUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p className="text-xs text-red-400">Failed to authorize media stream.</p>
                )
              ) : posterPresignedUrl ? (
                <img
                  src={posterPresignedUrl}
                  alt="Film Poster"
                  className="max-w-full max-h-[60vh] object-contain rounded"
                />
              ) : (
                <p className="text-xs text-red-400">Failed to load poster asset.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
