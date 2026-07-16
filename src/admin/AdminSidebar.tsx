interface AdminSidebarProps {
  activeTab: 'dashboard' | 'messages' | 'media' | 'submissions';
  setActiveTab: (tab: 'dashboard' | 'messages' | 'media' | 'submissions') => void;
  userEmail: string;
  onLogout: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  userEmail,
  onLogout
}: AdminSidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-line' },
    { id: 'messages', label: 'Messages', icon: 'fa-solid fa-envelope' },
    { id: 'media', label: 'Media Library', icon: 'fa-solid fa-images' },
    { id: 'submissions', label: 'Submissions', icon: 'fa-solid fa-clapperboard' }
  ] as const;

  return (
    <aside className="w-64 bg-[#0A0A0A] border-r border-white/5 flex flex-col justify-between h-screen sticky top-0 flex-shrink-0 font-sans">
      
      {/* Top Brand & Menu Area */}
      <div className="flex flex-col flex-grow">
        
        {/* Brand Logo Header */}
        <div className="h-20 border-b border-white/5 flex items-center px-6 gap-3">
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

        {/* User profile capsule */}
        <div className="px-6 py-5 border-b border-white/5 bg-black/20 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary text-xs font-bold font-serif uppercase">
            {userEmail.charAt(0) || 'A'}
          </div>
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-[10px] tracking-wider text-accent-muted uppercase font-semibold">Administrator</span>
            <span className="text-xs text-white/80 font-light truncate max-w-[150px]">{userEmail}</span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1.5 flex-grow mt-4">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-xs tracking-wider uppercase font-semibold transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'bg-secondary/10 text-secondary border-l-2 border-secondary' 
                    : 'text-accent-muted hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <i className={`${item.icon} text-sm w-5 text-center`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* Logout Footer Section */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 border border-red-500/20 text-red-400 hover:bg-red-950/20 text-xs tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer font-semibold"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}
