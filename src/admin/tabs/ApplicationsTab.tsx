import React from 'react';
import { JobApplication } from '../types';

interface ApplicationsTabProps {
  jobApplications: JobApplication[];
  jobApplicationsLoading: boolean;
  jobApplicationsError: string | null;
  selectedApplicationId: string | null;
  setSelectedApplicationId: (id: string | null) => void;
  fetchJobApplications: () => void;
  handleUpdateApplicationStatus: (id: string, newStatus: string) => void;
  handleDeleteApplication: (id: string) => void;
  updatingId: string | null;
}

export default function ApplicationsTab({
  jobApplications,
  jobApplicationsLoading,
  jobApplicationsError,
  selectedApplicationId,
  setSelectedApplicationId,
  fetchJobApplications,
  handleUpdateApplicationStatus,
  handleDeleteApplication,
  updatingId,
}: ApplicationsTabProps) {
  const selectedApplication = jobApplications.find(a => a.id === selectedApplicationId);

  return (
    <div className="space-y-6 animate-fade-in text-left flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase">Recruitment</span>
          <h1 className="font-serif text-3xl text-white tracking-wide mt-1">Job Applications</h1>
        </div>
        <button
          onClick={fetchJobApplications}
          className="px-4 py-2 bg-primary-light border border-white/10 hover:border-secondary text-xs tracking-widest uppercase transition-all duration-300 rounded-sm text-center flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <i className="fa-solid fa-arrows-rotate"></i> Refresh
        </button>
      </div>

      {jobApplicationsLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl text-secondary"></i>
          <span className="text-xs tracking-widest uppercase text-accent-muted">Loading Applications...</span>
        </div>
      ) : jobApplicationsError ? (
        <div className="p-6 bg-red-950/20 border border-red-500/20 text-red-400 rounded-sm text-center">
          <i className="fa-solid fa-circle-exclamation text-2xl mb-2"></i>
          <p className="text-sm">{jobApplicationsError}</p>
        </div>
      ) : jobApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <i className="fa-solid fa-briefcase text-2xl text-accent-muted"></i>
          </div>
          <h3 className="font-serif text-xl text-white mb-2">No Applications Yet</h3>
          <p className="text-sm text-accent-muted font-light max-w-sm">
            Job applications submitted via the Join Us page will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-16rem)] min-h-[500px]">
          {/* List View */}
          <div className="w-full lg:w-1/3 border border-white/5 bg-primary-light rounded-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-black/20">
              <h3 className="text-xs font-semibold tracking-widest text-accent-muted uppercase">Applications ({jobApplications.length})</h3>
            </div>
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {jobApplications.map(app => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApplicationId(app.id)}
                  className={`p-4 border-b border-white/5 cursor-pointer transition-all ${selectedApplicationId === app.id ? 'bg-secondary/10 border-l-2 border-l-secondary' : 'hover:bg-white/5 border-l-2 border-l-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-medium text-sm truncate ${selectedApplicationId === app.id ? 'text-secondary' : 'text-white'}`}>{app.name}</h4>
                    <span className="text-[10px] text-accent-muted flex-shrink-0">{new Date(app.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-accent-muted truncate">{app.role_title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[9px] tracking-wider uppercase font-semibold px-1.5 py-0.5 rounded-sm ${
                      app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      app.status === 'reviewed' ? 'bg-blue-500/10 text-blue-400' :
                      app.status === 'shortlisted' ? 'bg-green-500/10 text-green-400' :
                      app.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                      'bg-white/5 text-accent-muted'
                    }`}>{app.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail View */}
          <div className="hidden lg:flex w-full lg:w-2/3 border border-white/5 bg-primary-light rounded-sm flex-col overflow-hidden">
            {selectedApplication ? (
              <>
                <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-start">
                  <div>
                    <h2 className="font-serif text-2xl text-white">{selectedApplication.name}</h2>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-accent-muted">
                      <a href={`mailto:${selectedApplication.email}`} className="hover:text-white transition-colors">
                        <i className="fa-solid fa-envelope mr-2 text-secondary"></i>{selectedApplication.email}
                      </a>
                      {selectedApplication.phone && (
                        <span>
                          <i className="fa-solid fa-phone mr-2 text-secondary"></i>{selectedApplication.phone}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] tracking-widest uppercase text-secondary font-semibold bg-secondary/10 px-2 py-0.5 rounded-sm">
                        {selectedApplication.role_title}
                      </span>
                      {selectedApplication.portfolio && (
                        <a href={selectedApplication.portfolio} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary hover:text-white transition-colors">
                          <i className="fa-solid fa-arrow-up-right-from-square mr-1"></i>Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-accent-muted">
                    {new Date(selectedApplication.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                  <div className="mb-6">
                    <h4 className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold border-b border-white/5 pb-2 mb-4">
                      Why Viora?
                    </h4>
                    <div className="prose prose-invert prose-sm max-w-none text-accent-muted whitespace-pre-wrap font-light leading-relaxed">
                      {selectedApplication.cover_letter}
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="border-t border-white/5 pt-6">
                    <h4 className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold mb-4">
                      Update Status
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'reviewed', 'shortlisted', 'rejected'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleUpdateApplicationStatus(selectedApplication.id, status)}
                          disabled={updatingId === selectedApplication.id || selectedApplication.status === status}
                          className={`px-4 py-2 text-[10px] tracking-widest uppercase font-semibold rounded-sm transition-all duration-300 cursor-pointer border ${
                            selectedApplication.status === status
                              ? 'bg-secondary/10 text-secondary border-secondary/30'
                              : 'border-white/10 text-accent-muted hover:border-white/20 hover:text-white'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handleDeleteApplication(selectedApplication.id)}
                      disabled={updatingId === selectedApplication.id}
                      className="mt-4 px-4 py-2 text-[10px] tracking-widest uppercase font-semibold rounded-sm border border-red-500/20 text-red-400 hover:bg-red-950/20 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fa-solid fa-trash-can mr-2"></i>Delete Application
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
