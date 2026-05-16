import Battlefield from '../components/game/Battlefield'

const NAV_ITEMS = [
    { label: 'DEPLOY',  icon: '◎', active: true  },
    { label: 'UNITS',   icon: '⚇', active: false },
    { label: 'STORES',  icon: '⊙', active: false },
    { label: 'LOGS',    icon: '▤', active: false  },
]

function Sidebar() {
    return (
        <aside className="w-60 shrink-0 bg-surface-container-low border-r border-outline-variant flex flex-col h-screen">
            {/* Logo */}
            <div className="p-5 border-b border-outline-variant">
                <h1 className="font-grotesk text-xl font-bold text-primary tracking-tighter text-glow-red">
                    KINETIC_STRIKE
                </h1>
            </div>

            {/* Player info */}
            <div className="p-4 border-b border-outline-variant flex items-center gap-3">
                <div className="w-9 h-9 bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
                    <span className="font-mono text-[10px] text-outline">OPR</span>
                </div>
                <div>
                    <p className="font-mono text-[11px] text-on-surface uppercase tracking-wider">OPR-092</p>
                    <p className="font-mono text-[9px] text-outline uppercase tracking-widest">SECTOR-7 GARRISON</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-col p-3 gap-1 flex-1">
                {NAV_ITEMS.map(({ label, icon, active }) => (
                    <button
                        key={label}
                        className={`
              w-full flex items-center gap-3 px-4 py-3 font-mono text-xs tracking-widest uppercase transition-colors text-left
              ${active
                            ? 'bg-primary text-on-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            : 'text-outline hover:text-on-surface hover:bg-surface-container-high border border-transparent hover:border-outline-variant'
                        }
            `}
                    >
                        <span>{icon}</span>
                        {label}
                    </button>
                ))}
            </nav>

            {/* Bottom */}
            <div className="p-3 border-t border-outline-variant flex flex-col gap-2">
                <button className="w-full border border-outline-variant font-mono text-[10px] text-outline uppercase tracking-widest py-2.5 hover:border-primary hover:text-primary transition-colors">
                    SYSTEM_REBOOT
                </button>
                <button className="w-full flex items-center gap-2 px-2 py-2 font-mono text-[10px] text-outline uppercase tracking-widest hover:text-on-surface transition-colors">
                    <span>⚙</span> SETTINGS
                </button>
            </div>
        </aside>
    )
}

export default function GamePage() {
    return (
        <div className="h-screen w-full overflow-hidden flex bg-background">
            <Sidebar />
            <Battlefield isYourTurn />
        </div>
    )
}