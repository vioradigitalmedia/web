import { CfoTransaction } from '../types';

interface CfoTabProps {
  cfoTransactions: CfoTransaction[];
  cfoLoading: boolean;
  cfoError: string | null;
  fetchCfoTransactions: () => void;
  setIsCfoModalOpen: (open: boolean) => void;
}

export default function CfoTab({
  cfoTransactions,
  cfoLoading,
  cfoError,
  fetchCfoTransactions,
  setIsCfoModalOpen,
}: CfoTabProps) {
  // Aggregate calculations
  const totalIncome = cfoTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = cfoTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6 animate-fade-in text-left flex flex-col h-full print:block print:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6 print:pb-4 print:border-black/10">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase print:text-black">Finance</span>
          <h1 className="font-serif text-3xl text-white tracking-wide mt-1 print:text-black print:text-2xl">Ledger & Statements</h1>
        </div>
        <div className="flex gap-3 print:hidden">
          <button
            onClick={() => setIsCfoModalOpen(true)}
            className="px-4 py-2 bg-secondary text-black hover:bg-secondary/90 text-xs tracking-widest uppercase transition-all duration-300 rounded-sm text-center flex items-center gap-2 cursor-pointer font-bold"
          >
            <i className="fa-solid fa-plus"></i> Add Entry
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-primary-light border border-white/10 hover:border-secondary text-xs tracking-widest uppercase transition-all duration-300 rounded-sm text-center flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-print"></i> Export / Print
          </button>
          <button
            onClick={fetchCfoTransactions}
            className="px-4 py-2 bg-primary-light border border-white/10 hover:border-secondary text-xs tracking-widest uppercase transition-all duration-300 rounded-sm text-center flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-arrows-rotate"></i> Refresh
          </button>
        </div>
      </div>

      {/* Ledger aggregates banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4 print:mb-6">
        <div className="border border-white/5 bg-primary-light p-6 rounded-sm border-gold-glow print:border-black/10 print:bg-white print:text-black print:p-4">
          <span className="text-[9px] tracking-widest text-accent-muted uppercase font-semibold print:text-black/60">Ledger Income</span>
          <h3 className="text-2xl font-serif text-green-400 mt-1 print:text-green-600 font-bold">
            ₹{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="border border-white/5 bg-primary-light p-6 rounded-sm border-gold-glow print:border-black/10 print:bg-white print:text-black print:p-4">
          <span className="text-[9px] tracking-widest text-accent-muted uppercase font-semibold print:text-black/60">Ledger Expenses</span>
          <h3 className="text-2xl font-serif text-red-400 mt-1 print:text-red-600 font-bold">
            ₹{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="border border-white/5 bg-primary-light p-6 rounded-sm border-gold-glow print:border-black/10 print:bg-white print:text-black print:p-4">
          <span className="text-[9px] tracking-widest text-accent-muted uppercase font-semibold print:text-black/60">Net Treasury Balance</span>
          <h3 className={`text-2xl font-serif mt-1 font-bold ${netBalance >= 0 ? 'text-secondary print:text-black' : 'text-red-400 print:text-red-600'}`}>
            ₹{netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {cfoLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 print:hidden">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl text-secondary"></i>
          <span className="text-xs tracking-widest uppercase text-accent-muted">Compiling statements...</span>
        </div>
      ) : cfoError ? (
        <div className="p-6 bg-red-950/20 border border-red-500/20 text-red-400 rounded-sm text-center print:border-black print:text-black">
          <i className="fa-solid fa-circle-exclamation text-2xl mb-2"></i>
          <p className="text-sm">{cfoError}</p>
        </div>
      ) : cfoTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center print:py-10">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 print:border print:border-black">
            <i className="fa-solid fa-receipt text-2xl text-accent-muted print:text-black"></i>
          </div>
          <h3 className="font-serif text-xl text-white mb-2 print:text-black">No Transactions Logged</h3>
          <p className="text-sm text-accent-muted font-light max-w-sm print:text-black/80">
            Use the 'Add Entry' button above to register new income streams or operating expenses to the database.
          </p>
        </div>
      ) : (
        <div className="border border-white/5 bg-primary-light rounded-sm overflow-hidden print:border-black/10 print:bg-white print:text-black">
          <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center print:border-black/10 print:bg-transparent">
            <h3 className="text-xs font-semibold tracking-widest text-accent-muted uppercase print:text-black/80">Transaction History ({cfoTransactions.length})</h3>
            <span className="text-[10px] text-accent-muted print:text-black/60 font-mono">Statement date: {new Date().toLocaleDateString()}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/10 text-secondary uppercase font-semibold tracking-wider print:border-black/10 print:bg-transparent print:text-black/80">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-black/10">
                {cfoTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-white/5 transition-all print:hover:bg-transparent">
                    <td className="px-6 py-4 font-mono text-accent-muted print:text-black/70">
                      {new Date(t.transaction_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-white print:text-black">
                      {t.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 rounded-sm uppercase tracking-wider text-[10px] font-semibold ${
                        t.type === 'income'
                          ? 'bg-green-500/10 text-green-400 print:text-green-700 print:bg-transparent'
                          : 'bg-red-500/10 text-red-400 print:text-red-700 print:bg-transparent'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-semibold font-mono ${
                      t.type === 'income' ? 'text-green-400 print:text-green-700' : 'text-red-400 print:text-red-700'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
