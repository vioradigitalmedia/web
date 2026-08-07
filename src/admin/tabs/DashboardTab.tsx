import React from 'react';

interface DashboardTabProps {
  totalInquiries: number;
  pendingInquiries: number;
  totalSubmissions: number;
  totalApplications: number;
  totalRevenue: number;
}

export default function DashboardTab({
  totalInquiries,
  pendingInquiries,
  totalSubmissions,
  totalApplications,
  totalRevenue,
}: DashboardTabProps) {
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

        <div className="border border-white/5 bg-primary-light p-6 rounded-sm flex items-center justify-between border-gold-glow">
          <div>
            <span className="text-[10px] tracking-widest text-accent-muted uppercase font-semibold">Job Applications</span>
            <h2 className="text-3xl font-serif text-white mt-1">{totalApplications}</h2>
          </div>
          <div className="h-10 w-10 bg-secondary/5 rounded-full border border-secondary/20 flex items-center justify-center">
            <i className="fa-solid fa-briefcase text-secondary text-sm"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
