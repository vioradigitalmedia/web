import React from 'react';
import { PhotoFestSubmission } from '../types';

interface PhotoSubmissionsTabProps {
  photoSubmissions: PhotoFestSubmission[];
  photoSubmissionsLoading: boolean;
  photoSubmissionsError: string | null;
  selectedPhotoSubmissionId: string | null;
  setSelectedPhotoSubmissionId: (id: string | null) => void;
  expandedMobilePhotoSubmissionId: string | null;
  setExpandedMobilePhotoSubmissionId: (id: string | null) => void;
  fetchPhotoSubmissions: (forceRefresh?: boolean) => void;
  handleDeletePhotoSubmission: (id: string) => void;
  updatingId: string | null;
  photoPresignedUrl: string | null;
  photoIdPresignedUrl: string | null;
  presignedLoading: boolean;
}

export default function PhotoSubmissionsTab({
  photoSubmissions,
  photoSubmissionsLoading,
  photoSubmissionsError,
  selectedPhotoSubmissionId,
  setSelectedPhotoSubmissionId,
  expandedMobilePhotoSubmissionId,
  setExpandedMobilePhotoSubmissionId,
  fetchPhotoSubmissions,
  handleDeletePhotoSubmission,
  updatingId,
  photoPresignedUrl,
  photoIdPresignedUrl,
  presignedLoading,
}: PhotoSubmissionsTabProps) {
  const selectedSubmission = photoSubmissions.find(s => s.id === selectedPhotoSubmissionId);

  return (
    <div className="space-y-6 animate-fade-in text-left flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase">Entries</span>
          <h1 className="font-serif text-3xl text-white tracking-wide mt-1">Photo Submissions</h1>
        </div>
        <button
          onClick={() => fetchPhotoSubmissions(true)}
          className="px-4 py-2 bg-primary-light border border-white/10 hover:border-secondary text-xs tracking-widest uppercase transition-all duration-300 rounded-sm text-center flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <i className="fa-solid fa-arrows-rotate"></i> Refresh
        </button>
      </div>

      {photoSubmissionsLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl text-secondary"></i>
          <span className="text-xs tracking-widest uppercase text-accent-muted">Loading Photo Entries...</span>
        </div>
      ) : photoSubmissionsError ? (
        <div className="p-6 bg-red-950/20 border border-red-500/20 text-red-400 rounded-sm text-center">
          <i className="fa-solid fa-circle-exclamation text-2xl mb-2"></i>
          <p className="text-sm">{photoSubmissionsError}</p>
        </div>
      ) : photoSubmissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <i className="fa-solid fa-images text-2xl text-accent-muted"></i>
          </div>
          <h3 className="font-serif text-xl text-white mb-2">No Photo Submissions Found</h3>
          <p className="text-sm text-accent-muted font-light max-w-sm">
            Photo contest entries sent through the submit page will show up here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-16rem)] min-h-[500px]">
          {/* Submissions list (left sidebar pane) */}
          <div className="w-full lg:w-1/3 border border-white/5 bg-primary-light rounded-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
              <h3 className="text-xs font-semibold tracking-widest text-accent-muted uppercase">Entries ({photoSubmissions.length})</h3>
            </div>

            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {photoSubmissions.map(sub => {
                const isSelected = selectedPhotoSubmissionId === sub.id;

                return (
                  <div key={sub.id} className="border-b border-white/5">
                    {/* Desktop/Tablet Click handler */}
                    <div
                      onClick={() => {
                        setSelectedPhotoSubmissionId(sub.id);
                        setExpandedMobilePhotoSubmissionId(expandedMobilePhotoSubmissionId === sub.id ? null : sub.id);
                      }}
                      className={`p-4 cursor-pointer transition-all duration-300 text-left border-l-2 relative ${
                        isSelected
                          ? 'bg-secondary/10 border-l-secondary'
                          : 'hover:bg-white/5 border-l-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h4 className={`font-medium text-sm truncate ${isSelected ? 'text-secondary font-semibold' : 'text-white'}`}>
                          {sub.full_name}
                        </h4>
                        <span className="text-[10px] text-accent-muted whitespace-nowrap">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-accent-muted truncate">
                        File: {sub.photo_filename}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] tracking-wider uppercase font-semibold px-1.5 py-0.5 rounded-sm bg-white/5 text-accent-muted">
                          {sub.city}
                        </span>
                        {sub.is_student && (
                          <span className="text-[9px] tracking-wider uppercase font-semibold px-1.5 py-0.5 rounded-sm bg-purple-500/10 text-purple-400">
                            Student
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mobile Expandable Panel */}
                    {expandedMobilePhotoSubmissionId === sub.id && (
                      <div className="lg:hidden p-5 bg-black/40 border-t border-white/5 space-y-4 text-left animate-slide-down">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[9px] tracking-widest text-secondary font-semibold uppercase block">Name</span>
                            <span className="text-xs text-white">{sub.full_name}</span>
                          </div>
                          <div>
                            <span className="text-[9px] tracking-widest text-secondary font-semibold uppercase block">City</span>
                            <span className="text-xs text-white">{sub.city}</span>
                          </div>
                          <div>
                            <span className="text-[9px] tracking-widest text-secondary font-semibold uppercase block">Filename</span>
                            <span className="text-xs text-white break-all">{sub.photo_filename}</span>
                          </div>
                          <div>
                            <span className="text-[9px] tracking-widest text-secondary font-semibold uppercase block">Email</span>
                            <a href={`mailto:${sub.email}`} className="text-xs text-white underline break-all">{sub.email}</a>
                          </div>
                        </div>

                        {/* R2 Media Links */}
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          <span className="text-[9px] tracking-widest text-secondary font-semibold uppercase block">Private Assets (R2)</span>
                          {presignedLoading ? (
                            <span className="text-[10px] text-accent-muted italic">Requesting presigned keys...</span>
                          ) : (
                            <div className="flex flex-col gap-2">
                              {photoPresignedUrl && (
                                <a href={photoPresignedUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary hover:underline flex items-center gap-1.5">
                                  <i className="fa-solid fa-image text-[10px]"></i> View Submitted Photo
                                </a>
                              )}
                              {sub.is_student && photoIdPresignedUrl && (
                                <a href={photoIdPresignedUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary hover:underline flex items-center gap-1.5">
                                  <i className="fa-solid fa-id-card text-[10px]"></i> View Student ID
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhotoSubmission(sub.id);
                          }}
                          disabled={updatingId === sub.id}
                          className="w-full py-2 rounded-sm text-[10px] tracking-widest uppercase font-semibold border border-red-500/20 text-red-400 hover:bg-red-950/20 transition-all duration-300 cursor-pointer text-center disabled:opacity-50"
                        >
                          Delete Entry
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission detail view (right panel) */}
          <div className="hidden lg:flex w-full lg:w-2/3 border border-white/5 bg-primary-light rounded-sm flex-col overflow-hidden">
            {selectedSubmission ? (
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-start">
                  <div>
                    <h2 className="font-serif text-2xl text-white">{selectedSubmission.full_name}</h2>
                    <p className="text-xs text-accent-muted mt-2">
                      Submitted by <span className="text-secondary font-medium">{selectedSubmission.full_name}</span> &bull; {selectedSubmission.email} &bull; {selectedSubmission.phone}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-accent-muted">
                      {new Date(selectedSubmission.created_at).toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2">
                      {selectedSubmission.is_student && (
                        <span className="text-[9px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded-sm bg-purple-500/10 text-purple-400">
                          Student Category
                        </span>
                      )}
                      <span className="text-[9px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded-sm bg-white/5 text-accent-muted">
                        {selectedSubmission.city}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
                  {/* Media Players Section */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Column: Logline & details */}
                    <div className="md:col-span-7 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] tracking-widest text-accent-muted uppercase font-semibold block">Full Name</span>
                          <span className="text-xs text-white font-medium">{selectedSubmission.full_name}</span>
                        </div>
                        <div>
                          <span className="text-[9px] tracking-widest text-accent-muted uppercase font-semibold block">City</span>
                          <span className="text-xs text-white font-medium">{selectedSubmission.city}</span>
                        </div>
                        <div>
                          <span className="text-[9px] tracking-widest text-accent-muted uppercase font-semibold block">Photo Filename</span>
                          <span className="text-xs text-white font-medium break-all">{selectedSubmission.photo_filename}</span>
                        </div>
                        <div>
                          <span className="text-[9px] tracking-widest text-accent-muted uppercase font-semibold block">Student Verification</span>
                          <span className="text-xs text-white font-medium">{selectedSubmission.is_student ? 'Yes (Requires ID Review)' : 'No'}</span>
                        </div>
                      </div>

                      {/* Payment Card Details */}
                      <div className="bg-[#0A0A0A] p-4 rounded-sm border border-white/5">
                        <span className="text-[9px] tracking-widest text-secondary font-semibold uppercase block mb-3">Verification Details</span>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[10px] text-accent-muted block">Status</span>
                            <span className="text-green-400 capitalize font-medium">{selectedSubmission.status || 'Success'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-accent-muted block">Submission ID</span>
                            <span className="font-mono text-white/50">{selectedSubmission.id.substring(0, 8)}...</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Video & Media assets */}
                    <div className="md:col-span-5 space-y-6">
                      {/* Photo Image Preview */}
                      <div>
                        <h4 className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold border-b border-white/5 pb-2 mb-4">
                          Submitted Photograph
                        </h4>

                        {presignedLoading ? (
                          <div className="aspect-video bg-black/60 rounded-sm flex flex-col items-center justify-center gap-3 border border-white/5">
                            <i className="fa-solid fa-circle-notch fa-spin text-xl text-secondary"></i>
                            <span className="text-[10px] tracking-widest text-accent-muted uppercase font-light">Validating API signature...</span>
                          </div>
                        ) : photoPresignedUrl ? (
                          <a href={photoPresignedUrl} target="_blank" rel="noopener noreferrer">
                            <img
                              src={photoPresignedUrl}
                              alt="Submitted Photograph"
                              className="w-full max-h-60 object-contain bg-black rounded-sm border border-white/10 hover:border-secondary/40 transition-all duration-300 shadow-lg"
                            />
                          </a>
                        ) : (
                          <div className="aspect-video bg-red-950/10 rounded-sm flex flex-col items-center justify-center gap-2 border border-red-500/10 p-4 text-center">
                            <i className="fa-solid fa-image-portrait text-red-400 text-lg"></i>
                            <span className="text-xs text-red-400 font-medium">Failed to establish private link</span>
                            <p className="text-[10px] text-accent-muted font-light">{selectedSubmission.photo_filename}</p>
                          </div>
                        )}
                      </div>

                      {/* College ID if CS Category */}
                      {selectedSubmission.is_student && selectedSubmission.id_url && (
                        <div>
                          <h4 className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold border-b border-white/5 pb-2 mb-4">
                            Verification Document (Student ID)
                          </h4>
                          {presignedLoading ? (
                            <div className="h-32 w-full bg-black/60 rounded-sm flex items-center justify-center border border-white/5">
                              <i className="fa-solid fa-circle-notch fa-spin text-secondary"></i>
                            </div>
                          ) : photoIdPresignedUrl ? (
                            <a href={photoIdPresignedUrl} target="_blank" rel="noopener noreferrer">
                              <img
                                src={photoIdPresignedUrl}
                                alt="Student ID"
                                className="w-full max-h-40 object-contain bg-black rounded-sm border border-white/10 hover:border-secondary/40 transition-all duration-300"
                              />
                            </a>
                          ) : (
                            <div className="h-32 w-full bg-red-950/10 rounded-sm flex flex-col items-center justify-center border border-red-500/10 text-xs text-red-400 p-4 text-center">
                              <i className="fa-solid fa-id-card-slash text-lg mb-1"></i>
                              <span>Failed to load student ID.</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-black/10 flex justify-between items-center">
                  <button
                    onClick={() => handleDeletePhotoSubmission(selectedSubmission.id)}
                    disabled={updatingId === selectedSubmission.id}
                    className="px-4 py-2 text-[10px] tracking-widest uppercase font-semibold rounded-sm border border-red-500/20 text-red-400 hover:bg-red-950/20 transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    <i className="fa-solid fa-trash-can mr-2"></i>Delete Entry
                  </button>
                  <span className="text-[10px] text-accent-muted italic">
                    UUID: {selectedSubmission.id}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-accent-muted">
                <i className="fa-solid fa-images text-4xl mb-4 opacity-30"></i>
                <p className="text-xs tracking-widest uppercase font-light">Select a submission to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
