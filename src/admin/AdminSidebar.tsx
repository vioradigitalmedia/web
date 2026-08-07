interface AdminSidebarProps {
  activeTab: 'dashboard' | 'messages' | 'media' | 'submissions' | 'photo-submissions' | 'cfo' | 'letterhead' | 'partners' | 'applications';
  setActiveTab: (tab: 'dashboard' | 'messages' | 'media' | 'submissions' | 'photo-submissions' | 'cfo' | 'letterhead' | 'partners' | 'applications') => void;
  userEmail: string;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  userEmail,
  onLogout,
  isOpen = false,
  onClose,
  isCollapsed,
  onToggleCollapse
}: AdminSidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-line' },
    { id: 'messages', label: 'Messages', icon: 'fa-solid fa-envelope' },
    { id: 'partners', label: 'Partnerships', icon: 'fa-solid fa-handshake' },
    { id: 'applications', label: 'Applications', icon: 'fa-solid fa-briefcase' },
    { id: 'cfo', label: 'CFO', icon: 'fa-solid fa-money-bill-trend-up' },
    { id: 'media', label: 'Media Library', icon: 'fa-solid fa-images' },
    { id: 'submissions', label: 'Film Submissions', icon: 'fa-solid fa-clapperboard' },
    { id: 'photo-submissions', label: 'Photo Submissions', icon: 'fa-solid fa-camera' },
    { id: 'letterhead', label: 'Letterhead', icon: 'fa-solid fa-file-invoice' }
  ] as const;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        bg-[#0A0A0A] border-r border-white/5 flex flex-col justify-between h-screen fixed md:sticky top-0 z-50 md:z-auto transition-all duration-300 md:translate-x-0 flex-shrink-0 font-sans
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        
        {/* Top Brand & Menu Area */}
        <div className="flex flex-col flex-grow relative overflow-hidden">
          
          {/* Mobile Close Button */}
          {onClose && (
            <button 
              onClick={onClose}
              className="md:hidden absolute top-5 right-5 text-accent-muted hover:text-white p-1.5 transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          )}
          
          {/* Brand Logo Header */}
          <div className={`h-20 border-b border-white/5 flex items-center gap-3 transition-all duration-300 ${
            isCollapsed ? 'justify-center px-0' : 'px-6'
          }`}>
            <img 
              src="/logo.jpg" 
              alt="Viora Logo" 
              className="h-8 w-8 object-contain rounded-md border border-secondary/20 flex-shrink-0"
            />
            {!isCollapsed && (
              <div className="flex flex-col text-left animate-fade-in">
                <span className="font-serif tracking-[0.2em] text-sm font-semibold text-white">
                  VIORA
                </span>
                <span className="text-[8px] tracking-[0.3em] text-secondary font-medium -mt-1 uppercase">
                  Console
                </span>
              </div>
            )}
          </div>

          {/* User profile capsule */}
          <div className={`py-5 border-b border-white/5 bg-black/20 flex items-center gap-3 transition-all duration-300 ${
            isCollapsed ? 'justify-center px-0' : 'px-6'
          }`}>
            <div className="h-8 w-8 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary text-xs font-bold font-serif uppercase flex-shrink-0">
              {userEmail.charAt(0) || 'A'}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col text-left overflow-hidden animate-fade-in">
                <span className="text-[10px] tracking-wider text-accent-muted uppercase font-semibold">Administrator</span>
                <span className="text-xs text-white/80 font-light truncate max-w-[150px]">{userEmail}</span>
              </div>
            )}
          </div>

          {/* Menu Navigation */}
          <nav className={`space-y-1.5 flex-grow mt-4 transition-all duration-300 ${isCollapsed ? 'px-2' : 'p-4'}`}>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-sm text-xs tracking-wider uppercase font-semibold transition-all duration-300 cursor-pointer ${
                    isCollapsed ? 'justify-center py-3.5 px-0' : 'gap-3 px-4 py-3'
                  } ${
                    isActive 
                      ? 'bg-secondary/10 text-secondary border-l-2 border-secondary' 
                      : 'text-accent-muted hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <i className={`${item.icon} text-sm w-5 text-center flex-shrink-0`}></i>
                  {!isCollapsed && <span className="animate-fade-in">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Collapse Toggle Button (Desktop Only) */}
          <div className="hidden md:block border-t border-white/5 bg-black/10">
            <button
              onClick={onToggleCollapse}
              className={`w-full flex items-center text-accent-muted hover:text-white transition-all duration-300 cursor-pointer ${
                isCollapsed ? 'justify-center py-3.5 px-0' : 'gap-3 px-4 py-3 text-xs tracking-wider uppercase font-semibold'
              }`}
            >
              <i className={`fa-solid ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-sm flex-shrink-0`}></i>
              {!isCollapsed && <span>Collapse Menu</span>}
            </button>
          </div>

        </div>

        {/* Logout Footer Section */}
        <div className={`border-t border-white/5 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          <button
            onClick={onLogout}
            title={isCollapsed ? "Logout" : undefined}
            className={`w-full flex items-center justify-center border border-red-500/20 text-red-400 hover:bg-red-950/20 text-xs tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer font-semibold ${
              isCollapsed ? 'py-3.5 px-0' : 'gap-2.5 px-4 py-3.5'
            }`}
          >
            <i className="fa-solid fa-right-from-bracket text-sm flex-shrink-0"></i>
            {!isCollapsed && <span className="animate-fade-in">Logout</span>}
          </button>
        </div>

      </aside>
    </>
  );
}
