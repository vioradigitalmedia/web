import React from 'react';
import { PartnerProposal } from '../types';

interface PartnersTabProps {
  partners: PartnerProposal[];
  partnersLoading: boolean;
  partnersError: string | null;
  selectedPartnerId: string | null;
  setSelectedPartnerId: (id: string | null) => void;
  fetchPartners: () => void;
}

export default function PartnersTab({
  partners,
  partnersLoading,
  partnersError,
  selectedPartnerId,
  setSelectedPartnerId,
  fetchPartners,
}: PartnersTabProps) {
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
}
