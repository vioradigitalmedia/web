import React from 'react';
import { ContactMessage } from '../types';

interface MessagesTabProps {
  messages: ContactMessage[];
  loading: boolean;
  error: string | null;
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
  expandedMobileMessageId: string | null;
  setExpandedMobileMessageId: (id: string | null) => void;
  fetchMessages: () => void;
  handleUpdateStatus: (id: string, currentStatus: string) => void;
  handleDeleteMessage: (id: string) => void;
  updatingId: string | null;
}

export default function MessagesTab({
  messages,
  loading,
  error,
  selectedMessageId,
  setSelectedMessageId,
  expandedMobileMessageId,
  setExpandedMobileMessageId,
  fetchMessages,
  handleUpdateStatus,
  handleDeleteMessage,
  updatingId,
}: MessagesTabProps) {
  // Exclude submissions if any remains in the list just in case (already filtered in parent, but safe measure)
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
  const filteredMessages = messages.filter(msg => !isSubmissionMsg(msg.message));
  const selectedMessage = filteredMessages.find(m => m.id === selectedMessageId);

  return (
    <div className="space-y-6 animate-fade-in text-left flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase">Inbox</span>
          <h1 className="font-serif text-3xl text-white tracking-wide mt-1">Visitor Inquiries</h1>
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
          <i className="fa-solid fa-circle-notch fa-spin text-3xl text-secondary"></i>
          <span className="text-xs tracking-widest uppercase text-accent-muted">Loading Mailbox...</span>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-950/20 border border-red-500/20 text-red-400 rounded-sm text-center">
          <i className="fa-solid fa-circle-exclamation text-2xl mb-2"></i>
          <p className="text-sm">{error}</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <i className="fa-solid fa-envelope-open text-2xl text-accent-muted"></i>
          </div>
          <h3 className="font-serif text-xl text-white mb-2">Your Mailbox is Empty</h3>
          <p className="text-sm text-accent-muted font-light max-w-sm">
            Any customer inquiries, comments, or general contacts sent through the landing page form will show up here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-16rem)] min-h-[500px]">
          {/* Messages list (left sidebar pane) */}
          <div className="w-full lg:w-1/3 border border-white/5 bg-primary-light rounded-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
              <h3 className="text-xs font-semibold tracking-widest text-accent-muted uppercase">Inbox ({filteredMessages.length})</h3>
            </div>

            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {filteredMessages.map(msg => {
                const isSelected = selectedMessageId === msg.id;
                const isPending = msg.status === 'pending';

                return (
                  <div key={msg.id} className="border-b border-white/5">
                    {/* Desktop/Tablet Click handler */}
                    <div
                      onClick={() => {
                        setSelectedMessageId(msg.id);
                        setExpandedMobileMessageId(expandedMobileMessageId === msg.id ? null : msg.id);
                      }}
                      className={`p-4 cursor-pointer transition-all duration-300 text-left border-l-2 relative ${
                        isSelected
                          ? 'bg-secondary/10 border-l-secondary'
                          : 'hover:bg-white/5 border-l-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h4 className={`font-medium text-sm truncate ${isSelected ? 'text-secondary font-semibold' : 'text-white'}`}>
                          {msg.name}
                        </h4>
                        <span className="text-[10px] text-accent-muted whitespace-nowrap">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-accent-muted truncate pr-4">
                        {msg.message}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[9px] tracking-wider uppercase font-semibold px-1.5 py-0.5 rounded-sm ${
                          isPending
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-green-500/10 text-green-400'
                        }`}>
                          {msg.status}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Expandable Panel */}
                    {expandedMobileMessageId === msg.id && (
                      <div className="lg:hidden p-5 bg-black/40 border-t border-white/5 space-y-4 text-left animate-slide-down">
                        <div className="space-y-1">
                          <span className="text-[9px] tracking-widest text-secondary font-semibold uppercase">Email Contact</span>
                          <p className="text-xs text-white">
                            <a href={`mailto:${msg.email}`} className="hover:text-secondary underline transition-colors">
                              {msg.email}
                            </a>
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] tracking-widest text-secondary font-semibold uppercase">Full Message</span>
                          <p className="text-xs text-accent-muted leading-relaxed whitespace-pre-wrap font-light">
                            {msg.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(msg.id, msg.status);
                            }}
                            disabled={updatingId === msg.id}
                            className={`flex-1 py-2 rounded-sm text-[10px] tracking-widest uppercase font-semibold border transition-all duration-300 cursor-pointer text-center ${
                              msg.status === 'pending'
                                ? 'bg-green-950/20 border-green-500/20 text-green-400 hover:border-green-400'
                                : 'bg-yellow-950/20 border-yellow-500/20 text-yellow-500 hover:border-yellow-500'
                            } disabled:opacity-50`}
                          >
                            {msg.status === 'pending' ? 'Mark Resolved' : 'Mark Pending'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMessage(msg.id);
                            }}
                            disabled={updatingId === msg.id}
                            className="flex-1 py-2 rounded-sm text-[10px] tracking-widest uppercase font-semibold border border-red-500/20 text-red-400 hover:bg-red-950/20 transition-all duration-300 cursor-pointer text-center disabled:opacity-50"
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

          {/* Message detail view (right panel) */}
          <div className="hidden lg:flex w-full lg:w-2/3 border border-white/5 bg-primary-light rounded-sm flex-col overflow-hidden">
            {selectedMessage ? (
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-start">
                  <div>
                    <h2 className="font-serif text-2xl text-white">{selectedMessage.name}</h2>
                    <p className="text-xs text-accent-muted mt-2">
                      <i className="fa-solid fa-envelope mr-2 text-secondary"></i>
                      <a href={`mailto:${selectedMessage.email}`} className="hover:text-white transition-colors">
                        {selectedMessage.email}
                      </a>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-accent-muted">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </span>
                    <span className={`text-[9px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded-sm ${
                      selectedMessage.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-green-500/10 text-green-400'
                    }`}>
                      Status: {selectedMessage.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                  <div className="mb-6">
                    <h4 className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold border-b border-white/5 pb-2 mb-4">
                      Message Content
                    </h4>
                    <p className="text-sm text-accent-muted leading-relaxed whitespace-pre-wrap font-light">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-black/10 flex justify-between items-center">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdateStatus(selectedMessage.id, selectedMessage.status)}
                      disabled={updatingId === selectedMessage.id}
                      className={`px-4 py-2 text-[10px] tracking-widest uppercase font-semibold rounded-sm transition-all duration-300 cursor-pointer border ${
                        selectedMessage.status === 'pending'
                          ? 'bg-green-950/20 border-green-500/20 text-green-400 hover:border-green-400 hover:text-white'
                          : 'bg-yellow-950/20 border-yellow-500/20 text-yellow-500 hover:border-yellow-500 hover:text-white'
                      } disabled:opacity-50`}
                    >
                      {selectedMessage.status === 'pending' ? (
                        <>
                          <i className="fa-solid fa-check mr-2"></i>Mark as Resolved
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-clock-rotate-left mr-2"></i>Reopen Ticket
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      disabled={updatingId === selectedMessage.id}
                      className="px-4 py-2 text-[10px] tracking-widest uppercase font-semibold rounded-sm border border-red-500/20 text-red-400 hover:bg-red-950/20 transition-all duration-300 cursor-pointer disabled:opacity-50"
                    >
                      <i className="fa-solid fa-trash-can mr-2"></i>Delete Message
                    </button>
                  </div>
                  <span className="text-[10px] text-accent-muted italic">
                    ID: {selectedMessage.id}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-accent-muted">
                <i className="fa-solid fa-inbox text-4xl mb-4 opacity-30"></i>
                <p className="text-xs tracking-widest uppercase font-light">Select an inquiry to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
